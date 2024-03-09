# Presigned URL File Uploads

## Introduction

This repository showcases a Next.js application which handles file uploads and downloads via **GCP Cloud Storage presigned URLs**. Rather than routing file data through our application server, files are transferred directly between the browser and cloud storage — keeping the server fast and scalable.

## Why Presigned URLs?

Uploading files directly to your application server then onto cloud storage has several problems at scale:

- **Bandwidth**: Every file passes through your server twice — once in, once out to cloud storage. With many concurrent uploads this adds up fast.
- **Memory**: The server must buffer the entire file in memory (or to disk) before it can be passed onto cloud storage. A few large uploads can exhaust a Node.js process.
- **Connections**: Long-lived upload connections occupy HTTP worker slots or connection pool entries for the full duration of the transfer. Under load, legitimate requests queue behind slow uploads.

By using presigned URLs we delegate the transfer entirely to cloud storage:

1. The browser asks your server for a short-lived, scoped URL (no credentials are exposed to the client).
2. Your server generates the URL server-side using service account credentials and returns it.
3. The browser PUTs the file directly to cloud storage using that URL — your server isn't sent the file.
4. Your server only records the resulting filename/reference, which is a tiny metadata write.

Downloads work the same way: your server generates a time-limited, read-scoped URL on demand, and the browser fetches the file straight from cloud storage. Presigned URLs are scoped to specific objects and are time sensitive, expiring after a configurable period of time.

## Instructions

These instructions assume you are running a version of NodeJS equal to or greater than the version mentioned in the .nvmrc file and have pnpm installed:

### Google Cloud Storage Credentials Setup

This application authenticates to Google Cloud Storage using a **service account key**. Follow these steps to mint credentials:

1. Create a project

```bash
gcloud projects create <YOUR_PROJECT_ID>
gcloud config set project <YOUR_PROJECT_ID>
```

2. Enable the Cloud Storage API

```bash
gcloud services enable storage.googleapis.com
```

3. Create a Service Account

```bash
gcloud iam service-accounts create node-experiment \
  --display-name="Node Experiment SA"
```

4. Grant Storage Permissions

```bash
gcloud projects add-iam-policy-binding <YOUR_PROJECT_ID> \
  --member="serviceAccount:node-experiment@<YOUR_PROJECT_ID>.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"
```

5. Generate a JSON Key

```bash
gcloud iam service-accounts keys create ./sa-key.json \
  --iam-account="node-experiment@<YOUR_PROJECT_ID>.iam.gserviceaccount.com"
```

Open `sa-key.json` and extract the fields you need for the environment variables below. **Do not commit this file.**

6. Provision the bucket via Terraform

Terraform is used to manage the bucket. Ensure the `gcloud` CLI is authenticated, then:

```bash
pnpm run tf:init
pnpm run tf:apply
```

> If you need Terraform to claim an existing manually-created bucket, import it first:
>
> ```bash
> terraform -chdir=terraform/ import google_storage_bucket.cv-uploads <BUCKET_NAME>
> ```

### General Setup

1. Install dependencies across all packages and applications in the monorepo

```bash
pnpm install
```

2. Create a copy of the environment file and populate it

```bash
cp .env.local.example .env.local
```

| Variable           | Description                 | Where to find it                  |
| ------------------ | --------------------------- | --------------------------------- |
| `GCP_PROJECT_ID`   | GCP project ID              | `project_id` in the SA key JSON   |
| `GCP_BUCKET_NAME`  | Name of the GCS bucket      | Set in `terraform/` config        |
| `GCP_CLIENT_EMAIL` | Service account email       | `client_email` in the SA key JSON |
| `GCP_PRIVATE_KEY`  | Service account private key | `private_key` in the SA key JSON  |

All four variables are **required**. The app validates them at startup with Zod and will fail with a descriptive error if any are missing or empty.

> **Note on `GCP_PRIVATE_KEY`**: The private key contains literal `\n` newline escape sequences in the JSON file. Copy the value as-is (including the `-----BEGIN/END PRIVATE KEY-----` markers and `\n` sequences) into `.env.local`. Next.js will handle the escaping correctly. Ensure it's wrapped in quotes.

3. Run the application

```bash
pnpm dev
```

## Libraries Used

| Library                                                                | Purpose                                                   |
| ---------------------------------------------------------------------- | --------------------------------------------------------- |
| [Next.js](https://nextjs.org/)                                         | Full-stack React framework                                |
| [Chakra UI](https://chakra-ui.com/)                                    | Component library and design system                       |
| [react-hook-form](https://react-hook-form.com/)                        | Performant, uncontrolled form state management            |
| [Zod](https://zod.dev/)                                                | Schema validation for forms, env vars, and API boundaries |
| [@google-cloud/storage](https://googleapis.dev/nodejs/storage/latest/) | Client to generate presigned URLs and delete bucket files |

---

## Next.js Patterns

This codebase is intended as a practical reference for several Next.js App Router idioms:

### Server Components for Data Fetching at Page Load

Async server components fetch data directly — no `useEffect`, no loading skeletons in JavaScript, no client/server round trips for initial data. The dashboard page wraps its data-fetching server component in a `<Suspense>` boundary so the shell renders immediately and the table streams in once data is ready.

#### Streaming with Suspense

```tsx
<Suspense fallback={<Spinner />}>
  <ApplicationsTableServer /> {/* async server component */}
</Suspense>
```

The page shell, heading, and chrome are delivered to the browser immediately. The table content streams in as soon as the async fetch resolves — no full-page loading state required.

### Server Actions for for User-Triggered Mutations

Create and delete operations are implemented as [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations). They run on the server, revalidate the relevant path with `revalidatePath('/')`, and are passed **down as props** from server components to the client components that invoke them — keeping the server/client boundary explicit and testable.

```tsx
// Server component (page.tsx)
<ApplicationsListView deleteApplication={deleteApplication} />;

// Client component receives the action as a typed prop
type Props = { deleteApplication: (id: string) => Promise<void> };
```

### API Routes for User-Triggered Data Fetching

Presigned URL generation happens **after** page load, triggered by user interaction. This is modelled as API Route Handlers rather than server actions, since the client needs to fire them imperatively (on file select, on download button click) rather than as form submissions. Server actions are also mainly attributed to handling mutations and only use POST requests.

- `POST /api/presigned-url` — generates an upload URL
- `GET /api/presigned-url/[applicationId]` — generates a download URL
