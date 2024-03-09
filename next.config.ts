import { type NextConfig } from 'next';
import { z } from 'zod';

export type EnvConfig = z.infer<typeof envSchema>;

export const envSchema = z.object({
  GCP_BUCKET_NAME: z.string().trim().min(1),
  GCP_CLIENT_EMAIL: z.string().trim().min(1),
  GCP_PRIVATE_KEY: z.string().trim().min(1),
  GCP_PROJECT_ID: z.string().trim().min(1),
});

try {
  envSchema.parse(process.env);
} catch (err) {
  if (err instanceof z.ZodError) {
    console.log(z.prettifyError(err));
    throw new Error('Invalid environment variables');
  }
  throw err;
}

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  poweredByHeader: false,
};

export default nextConfig;
