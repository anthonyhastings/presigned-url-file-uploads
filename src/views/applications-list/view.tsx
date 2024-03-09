'use client';

// CLIENT component — "use client" is required here because this component uses:
//   - useState  (isDataLoading flag while a delete is in flight)
//   - useRouter (programmatic navigation when a row is clicked)

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApplicationsTable, type ApplicationsTableProps } from '@/components/applications-table';

export type ApplicationsListProps = {
  applications: ApplicationsTableProps['data'];
  deleteApplicationAction: (id: string) => Promise<void>;
};

export const ApplicationsList = ({ applications, deleteApplicationAction }: ApplicationsListProps) => {
  const router = useRouter();

  const [isDataLoading, setIsDataLoading] = useState(false);

  const handleDeleteApplication = async (id: string) => {
    setIsDataLoading(true);
    await deleteApplicationAction(id);
    setIsDataLoading(false);
  };

  return (
    <ApplicationsTable
      data={applications}
      isDataLoading={isDataLoading}
      onRowDeleteClick={(row) => handleDeleteApplication(row.id)}
      onRowViewClick={(row) => router.push(`/view/${row.id}`)}
    />
  );
};
