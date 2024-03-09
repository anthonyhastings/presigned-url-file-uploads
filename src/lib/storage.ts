import { Storage } from '@google-cloud/storage';

const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;

let storageInstance: Storage | null = null;

export const getStorage = () => {
  if (!storageInstance) {
    storageInstance = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY,
      },
    });
  }

  return storageInstance;
};

export const deleteFileFromStorage = async (filenameInBucket: string) => {
  const storage = getStorage();

  await storage.bucket(process.env.GCP_BUCKET_NAME!).file(filenameInBucket).delete();
};

export const generatePresignedURLForUpload = async (
  filenameInBucket: string,
  validForInMs: number = FIFTEEN_MINUTES_IN_MS,
) => {
  const storage = getStorage();

  const [url] = await storage
    .bucket(process.env.GCP_BUCKET_NAME!)
    .file(filenameInBucket)
    .getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + validForInMs,
      contentType: 'application/octet-stream',
    });

  return url;
};

export const generatePresignedURLForDownload = async (
  filenameInBucket: string,
  validForInMs: number = FIFTEEN_MINUTES_IN_MS,
) => {
  const storage = getStorage();

  const [url] = await storage
    .bucket(process.env.GCP_BUCKET_NAME!)
    .file(filenameInBucket)
    .getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + validForInMs,
    });

  return url;
};
