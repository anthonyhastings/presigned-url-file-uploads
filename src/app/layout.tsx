import { type Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Container } from '@chakra-ui/react';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Presigned URL - File Uploads',
  description: 'Demonstrating how to handle file uploads via Presigned URLs',
  openGraph: {
    title: 'Presigned URL - File Uploads',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={inter.variable} lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Container maxW="900px" p={4}>
            {children}
          </Container>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
