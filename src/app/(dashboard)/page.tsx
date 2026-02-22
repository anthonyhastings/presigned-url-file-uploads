import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Flex, Spinner } from '@chakra-ui/react';
import { getApplications } from '@/constants';
import { waitFor } from '@/utils';
import { deleteApplication } from '../actions';
import { PageShell } from '@/components/page-shell';
import { ApplicationsList, type ApplicationsListProps } from '@/views/applications-list';

export const metadata: Metadata = {
  title: 'Applications',
};

const fetchApplications = async (): Promise<ApplicationsListProps['applications']> => {
  const currentApplications = getApplications();
  console.log('SSR::fetchApplications', currentApplications);
  await waitFor(500);
  return currentApplications;
};

// SERVER component — async so it can await data on the server.
//
// This component lives inside the <Suspense> boundary below. That placement
// is what makes streaming work: Next.js sees an async component inside a
// Suspense boundary and knows to send the page shell to the browser first,
// then stream this component's HTML in separately once the await resolves.
//
// This is intentionally NOT exported — it is only composed by
// ApplicationsListPage (a server component) and never imported by a client
// component. Importing a server component into a client component would pull
// it into the client bundle and break the boundary.
const ApplicationsTableServer = async () => {
  const data = await fetchApplications();

  // ApplicationsList is a CLIENT component, rendered here from a server
  // component — this direction is always fine. Server components can render
  // client components; the restriction only applies the other way around.
  return <ApplicationsList applications={data} deleteApplicationAction={deleteApplication} />;
};

// No longer async — this page renders its shell immediately without waiting
// for any data. The slow work is delegated to ApplicationsTableServer, which
// sits inside the Suspense boundary and streams in separately.
const ApplicationsListPage = () => {
  return (
    // PageShell is a SERVER component (no "use client"). The `action` prop
    // accepts any ReactNode, so we can pass a Button from the server level.
    // Button is a Chakra UI component that handles its own client boundary
    // internally — we do not need "use client" here to use it.
    <PageShell
      heading="Applications"
      action={
        <Button asChild>
          <Link href="/add" prefetch={false}>
            Add Application
          </Link>
        </Button>
      }
    >
      {/* Suspense boundary — the fallback spinner is shown immediately while
          ApplicationsTableServer is still awaiting its data on the server.
          Once the server finishes, React streams the resolved HTML to the
          browser and swaps out the spinner automatically. */}
      <Suspense
        fallback={
          <Flex justifyContent="center" mt={10}>
            <Spinner />
          </Flex>
        }
      >
        {/* SERVER component inside the boundary. Its async fetch is what
            triggers the suspension — nothing client-side is involved. */}
        <ApplicationsTableServer />
      </Suspense>
    </PageShell>
  );
};

export default ApplicationsListPage;
