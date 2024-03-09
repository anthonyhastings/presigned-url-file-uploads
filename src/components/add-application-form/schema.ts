import { z } from 'zod';

export type CVFormValues = z.infer<typeof CVSchema>;

const ACCEPTED_MIME_TYPES = ['application/pdf'] as const;

const MAX_FILE_SIZE_IN_MB = 1;

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return Number(result.toFixed(decimalsNum));
};

export const CVFileSchema = z.object({
  cv: z
    .custom<File>((file) => {
      return file instanceof File;
    }, 'Please attach your CV to upload')
    .refine((file) => {
      return ACCEPTED_MIME_TYPES.includes(file.type);
    }, 'File type is not supported')
    .refine((file) => {
      return sizeInMB(file.size) <= MAX_FILE_SIZE_IN_MB;
    }, `The maximum file size is ${MAX_FILE_SIZE_IN_MB}MB`),
});

export const CVSchema = z.object({
  coverNote: z.string().trim().optional(),
  fileId: z.string({ required_error: 'Please upload your CV' }).trim().min(1, { message: 'Please upload your CV' }),
  fullName: z
    .string({ required_error: 'Please supply your full name' })
    .trim()
    .min(1, { message: 'Please supply your full name' }),
});
