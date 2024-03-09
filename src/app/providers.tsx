'use client';

import { Provider as ChakraProvider } from '@/components/ui/provider';

export const Providers = ({ children }: React.PropsWithChildren) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};
