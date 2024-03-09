import { notFound } from 'next/navigation';
import { getApplications } from '@/constants';
import { generatePresignedURLForDownload } from '@/lib/storage';
import { waitFor } from '@/utils';

export async function GET(_: Request, { params }: { params: Promise<{ applicationId: string }> }) {
  const { applicationId } = await params;
  console.log('SSR::GET /api/presigned-url/[applicationId]', applicationId);

  await waitFor(500);

  const targetApplication = getApplications().find((application) => application.id === applicationId);
  if (!targetApplication) notFound();

  return Response.json({
    downloadURL: await generatePresignedURLForDownload(targetApplication.fileId),
    filename: targetApplication.fileId,
  });
}
