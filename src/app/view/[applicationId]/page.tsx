import { notFound } from 'next/navigation';
import { getApplications } from '@/constants';
import { waitFor } from '@/utils';
import { ViewApplication } from '@/views/view-application';

const fetchApplicationById = async (applicationId: string) => {
  console.log('SSR::fetchApplicationById', applicationId);

  await waitFor(500);

  return getApplications().find((application) => application.id === applicationId);
};

const ViewApplicationPage = async ({ params }: { params: Promise<{ applicationId: string }> }) => {
  const { applicationId } = await params;

  const targetApplication = await fetchApplicationById(applicationId);

  if (!targetApplication) notFound();

  return <ViewApplication application={targetApplication} />;
};

export default ViewApplicationPage;
