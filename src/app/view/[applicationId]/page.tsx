import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getApplications } from '@/constants';
import { waitFor } from '@/utils';
import { ViewApplication } from '@/views/view-application';

type PageProps = {
  params: Promise<{ applicationId: string }>;
};

export const generateMetadata = async ({ params }: PageProps) => {
  const { applicationId } = await params;

  const targetApplication = await fetchApplicationById(applicationId);

  return { title: targetApplication ? `${targetApplication.name} — Application` : 'Application' } satisfies Metadata;
};

const fetchApplicationById = async (applicationId: string) => {
  console.log('SSR::fetchApplicationById', applicationId);

  await waitFor(500);

  return getApplications().find((application) => application.id === applicationId);
};

const ViewApplicationPage = async ({ params }: PageProps) => {
  const { applicationId } = await params;

  const targetApplication = await fetchApplicationById(applicationId);

  if (!targetApplication) notFound();

  return <ViewApplication application={targetApplication} />;
};

export default ViewApplicationPage;
