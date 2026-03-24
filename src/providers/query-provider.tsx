"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

/**
 * Provider for TanStack Query (React Query)
 * Maintains state and configuration for API requests across the application.
 */
export default function QueryProvider({ children }: { children: ReactNode }) {
  // Use useState to ensure a single QueryClient instance is created per session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1, // Retry once to handle temporary network fluctuations
            refetchOnWindowFocus: false, // Prevent unexpected refetches during navigation
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
