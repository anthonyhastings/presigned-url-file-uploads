import { nanoid } from 'nanoid';
import { generatePresignedURLForUpload } from '@/lib/storage';

export async function POST() {
  const filenameInBucket = `${nanoid()}.pdf`;

  return Response.json({
    filename: filenameInBucket,
    uploadURL: await generatePresignedURLForUpload(filenameInBucket),
  });
}
