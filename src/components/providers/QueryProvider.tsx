import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";

export const QueryProvider = ({
  children,
  config,
}: Readonly<{
  children: React.ReactNode;
  config?: QueryClientConfig;
}>) => {
  const queryClient = new QueryClient(config);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
