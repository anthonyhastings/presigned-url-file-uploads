// No "use client" directive — PageShell is a SERVER component.
//
// It contains no state, event handlers, or browser APIs, so there is no
// reason to ship it to the client. It renders to plain HTML on the server.
//
// Importantly, it can still receive client components via the `action` and
// `children` props. Those are composed by the server-component caller (the
// page), not imported here, so the client/server boundary is never crossed
// inside this file.

import { Flex, Heading } from '@chakra-ui/react';

type PageShellProps = {
  heading: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export const PageShell = ({ heading, action, children }: PageShellProps) => (
  <>
    <Flex alignItems="center" direction="row" justifyContent="space-between" gap="2" mb={10}>
      <Heading as="h1" size="xl">
        {heading}
      </Heading>
      {action}
    </Flex>
    {children}
  </>
);
