'use client';

import { useState } from 'react';
import { Box, Button, Card, Flex, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { type Application } from '@/constants';

export type ViewApplicationProps = {
  application: Application;
};

export const ViewApplication = ({ application }: ViewApplicationProps) => {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'medium',
  });

  const [isFetchingPresignedURL, setIsFetchingPresignedURL] = useState(false);

  const onDownloadCVClick = async () => {
    setIsFetchingPresignedURL(true);

    const presignedResponse = (await (
      await fetch(`/api/presigned-url/${application.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    ).json()) as { downloadURL: string; filename: string };

    const anchorElement = document.createElement('a');
    anchorElement.href = presignedResponse.downloadURL;
    anchorElement.rel = 'noopener';
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);

    setIsFetchingPresignedURL(false);
  };

  return (
    <>
      <Flex alignItems="center" direction="row" justifyContent="space-between" gap="2" mb={10}>
        <Heading as="h1" size="xl">
          View Application
        </Heading>

        <Button asChild>
          <Link href="/" prefetch={false}>
            Back to Dashboard
          </Link>
        </Button>
      </Flex>
      <Card.Root size="md">
        <Card.Header>
          <Heading mb={1} size="md">
            {application.name}
          </Heading>
          <Text fontSize="xs">Received: {dateFormatter.format(new Date(application.received))}</Text>
        </Card.Header>

        <Card.Body>
          {application.coverNote && (
            <Box>
              <Text asChild>
                <b>Cover Note:</b>
              </Text>
              <br />
              <Text>{application.coverNote}</Text>
            </Box>
          )}
        </Card.Body>

        <Card.Footer>
          <Button colorPalette="teal" loading={isFetchingPresignedURL} onClick={onDownloadCVClick} variant="solid">
            Download CV
          </Button>
        </Card.Footer>
      </Card.Root>
    </>
  );
};
