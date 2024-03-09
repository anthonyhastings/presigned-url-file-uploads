'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, Input, Stack, Field } from '@chakra-ui/react';
import { uploadFile } from '@/utils';
import { type CVFormValues, CVFileSchema } from './schema';

export type AddCVFileInputProps = {
  fileReference?: File | null;
  onFileSubmitted: ({ fileReference, remoteFilename }: { fileReference: File; remoteFilename: string }) => void;
};

export const AddCVFileInput = ({ fileReference, onFileSubmitted }: AddCVFileInputProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const { formState, setError } = useFormContext<CVFormValues>();

  const onUploadFileClick = async () => {
    const userFile = fileInputRef.current?.files?.[0];

    const validation = CVFileSchema.safeParse({ cv: userFile });
    if (validation.success === false) {
      setError('fileId', { type: 'manual', message: validation.error.issues[0]?.message ?? 'Invalid file' });
      return;
    }

    setIsUploading(true);

    try {
      const uploadResponse = await uploadFile(userFile!);

      setIsUploading(false);

      onFileSubmitted({
        fileReference: userFile!,
        remoteFilename: uploadResponse.remoteFilename,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Side-effect that sets the file input value to a previously saved
  // file reference then from a past upload
  useEffect(() => {
    if (!fileReference || !fileInputRef.current) return;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(fileReference);
    fileInputRef.current.files = dataTransfer.files;
  }, [fileReference]);

  return (
    <Field.Root invalid={Boolean(formState.errors.fileId)} required>
      <Field.Label>CV File (.pdf):</Field.Label>
      <Stack direction="row" gap={6}>
        <Input
          accept="application/pdf"
          type="file"
          ref={(el) => {
            fileInputRef.current = el;
          }}
        />
        <Button loading={isUploading} onClick={onUploadFileClick} type="button">
          Upload File
        </Button>
      </Stack>
      <Field.ErrorText>{formState.errors.fileId?.message}</Field.ErrorText>
    </Field.Root>
  );
};
