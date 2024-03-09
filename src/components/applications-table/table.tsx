'use client';

import { LuEye, LuTrash2 } from 'react-icons/lu';
import { Box, ButtonGroup, IconButton, Progress, Table } from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';

type ApplicationsTableRow = {
  id: string;
  name: string;
  received: string;
};

export type ApplicationsTableProps = {
  isDataLoading: boolean;
  data: ApplicationsTableRow[];
  onRowDeleteClick: (row: ApplicationsTableRow) => void;
  onRowViewClick: (row: ApplicationsTableRow) => void;
};

export const ApplicationsTable = ({
  data,
  isDataLoading,
  onRowDeleteClick,
  onRowViewClick,
}: ApplicationsTableProps) => {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'medium',
  });

  return (
    <>
      <Box height={1}>
        {isDataLoading && (
          <Progress.Root size="xs" value={null}>
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
        )}
      </Box>
      <Table.ScrollArea>
        <Table.Root striped>
          <Table.Caption>
            Timezone of dates shown in: {new Intl.DateTimeFormat().resolvedOptions().timeZone}
          </Table.Caption>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Applicant&lsquo;s Name</Table.ColumnHeader>
              <Table.ColumnHeader>Application Received</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((row) => (
              <Table.Row key={row.id}>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{dateFormatter.format(new Date(row.received))}</Table.Cell>
                <Table.Cell>
                  <ButtonGroup>
                    <Tooltip content="View record">
                      <IconButton aria-label="View record" onClick={() => onRowViewClick(row)}>
                        <LuEye />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Delete record">
                      <IconButton aria-label="Delete record" onClick={() => onRowDeleteClick(row)}>
                        <LuTrash2 />
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </>
  );
};
