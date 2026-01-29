import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000, // Data fresh for 10 seconds
      gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
      refetchOnWindowFocus: true, // Refetch when user returns to tab
      refetchInterval: 30000, // Auto-refresh every 30 seconds
      retry: 2, // Retry failed requests twice
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});
