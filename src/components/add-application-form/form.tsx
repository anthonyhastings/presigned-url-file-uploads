'use client';

import { useState } from 'react';
import { LuPaperclip } from 'react-icons/lu';
import { Button, Field, Input, Stack, Tag, Textarea } from '@chakra-ui/react';
import { Controller, FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddCVFileInput, type AddCVFileInputProps } from './file-input';
import { type CVFormValues, CVSchema } from './schema';

export type AddApplicationFormProps = {
  isSubmitting?: boolean;
  onFormSubmit: SubmitHandler<CVFormValues>;
};

export const AddApplicationForm = ({ isSubmitting = false, onFormSubmit }: AddApplicationFormProps) => {
  const [fileReference, setFileReference] = useState<File | null>(null);

  const methods = useForm<CVFormValues>({
    defaultValues: { coverNote: '', fileId: '', fullName: '' },
    mode: 'onTouched',
    resolver: zodResolver(CVSchema),
  });

  const onChangeFileClick = () => {
    methods.resetField('fileId', { keepError: false, keepTouched: false });
  };

  const onFileSubmitted = (({ fileReference, remoteFilename }) => {
    setFileReference(fileReference);
    methods.setValue('fileId', remoteFilename, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  }) satisfies AddCVFileInputProps['onFileSubmitted'];

  return (
    <FormProvider {...methods}>
      <Stack asChild>
        <form noValidate onSubmit={methods.handleSubmit(onFormSubmit)}>
          <Controller
            control={methods.control}
            name="fullName"
            render={({ field: { ...fieldProps }, fieldState: { invalid, error } }) => (
              <Field.Root invalid={invalid} required>
                <Field.Label>Full Name:</Field.Label>
                <Input {...fieldProps} disabled={isSubmitting} type="text" />
                <Field.ErrorText>{error && error.message}</Field.ErrorText>
              </Field.Root>
            )}
          />
          <Controller
            control={methods.control}
            name="fileId"
            render={({ field: { value } }) => (
              <>
                {value ? (
                  <Stack direction="row" justify="space-between" my={6}>
                    {fileReference && (
                      <Tag.Root size="lg" variant="solid" colorPalette="teal">
                        <Tag.StartElement asChild>
                          <LuPaperclip />
                        </Tag.StartElement>
                        <Tag.Label>CV File: {fileReference.name}</Tag.Label>
                      </Tag.Root>
                    )}
                    <Button colorPalette="teal" disabled={isSubmitting} onClick={onChangeFileClick}>
                      Change File
                    </Button>
                  </Stack>
                ) : (
                  <AddCVFileInput fileReference={fileReference} onFileSubmitted={onFileSubmitted} />
                )}
              </>
            )}
          />
          <Controller
            control={methods.control}
            name="coverNote"
            render={({ field: { ...fieldProps }, fieldState: { invalid, error } }) => (
              <Field.Root invalid={invalid}>
                <Field.Label>Cover Note:</Field.Label>
                <Textarea {...fieldProps} disabled={isSubmitting} />
                <Field.ErrorText>{error && error.message}</Field.ErrorText>
              </Field.Root>
            )}
          />
          <Button disabled={!methods.formState.isValid} loading={isSubmitting} type="submit">
            Submit Application
          </Button>
        </form>
      </Stack>
    </FormProvider>
  );
};
