'use server';

import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';
import { getApplications, updateApplications } from '@/constants';
import { deleteFileFromStorage } from '@/lib/storage';
import { waitFor } from '@/utils';

export const deleteApplication = async (id: string) => {
  console.log('SSR::deleteApplication', id);

  await waitFor(1000);

  const applications = getApplications();

  const targetApplication = applications.find((application) => application.id === id)!;

  await deleteFileFromStorage(targetApplication.fileId);

  updateApplications(applications.filter((application) => application.id !== id));

  revalidatePath('/');
};

export const createApplication = async (input: { fullName: string; fileId: string; coverNote?: string }) => {
  console.log('SSR::createApplication', input);

  await waitFor(1000);

  updateApplications([
    ...getApplications(),
    {
      coverNote: input.coverNote,
      id: nanoid(),
      fileId: input.fileId,
      name: input.fullName,
      received: new Date().toISOString(),
    },
  ]);

  revalidatePath('/');
};
