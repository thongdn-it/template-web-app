import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

export const QueryProvider = ({
  children,
  config,
}: Readonly<{
  children: React.ReactNode;
  config?: QueryClientConfig;
}>) => {
  const [queryClient] = useState(() => new QueryClient(config));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
