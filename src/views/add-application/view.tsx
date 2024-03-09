'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Flex, Heading } from '@chakra-ui/react';
import { AddApplicationForm, type AddApplicationFormProps, type CVFormValues } from '@/components/add-application-form';
import { toaster } from '@/components/ui/toaster';

export type AddApplicationProps = {
  createApplication: (formValues: CVFormValues) => Promise<void>;
};

export const AddApplication = ({ createApplication }: AddApplicationProps) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const onFormSubmit = ((formValues) => {
    startTransition(async () => {
      await createApplication(formValues);

      toaster.create({
        closable: true,
        description: 'Your application has been successfully submitted.',
        duration: 5000,
        title: 'Application submitted',
        type: 'success',
      });

      router.push('/');
    });
  }) satisfies AddApplicationFormProps['onFormSubmit'];

  return (
    <>
      <Flex alignItems="center" direction="row" justifyContent="space-between" gap="2" mb={10}>
        <Heading as="h1" size="xl">
          Add Application
        </Heading>
        <Button asChild>
          <Link href="/" prefetch={false}>
            Back to Dashboard
          </Link>
        </Button>
      </Flex>
      <AddApplicationForm isSubmitting={isPending} onFormSubmit={onFormSubmit} />
    </>
  );
};
