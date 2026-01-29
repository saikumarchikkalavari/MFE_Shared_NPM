/**
 * Creates a mock API call that simulates network delay
 * @param mockData - The data to return
 * @param options - Configuration options
 * @returns Promise that resolves with mock data after delay
 */
export const createMockApi = <T>(
  mockData: T,
  options?: {
    delay?: number;
    error?: boolean;
    errorMessage?: string;
  }
): Promise<T> => {
  const delay = options?.delay ?? 500;
  const shouldError = options?.error ?? false;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldError) {
        reject(new Error(options?.errorMessage || "Mock API Error"));
      } else {
        resolve(mockData);
      }
    }, delay);
  });
};

/**
 * Creates a mock paginated API response
 * @param items - Array of items to paginate
 * @param page - Current page number (1-based)
 * @param pageSize - Number of items per page
 * @param options - Configuration options
 * @returns Promise with paginated response
 */
export const createMockPaginatedApi = <T>(
  items: T[],
  page: number = 1,
  pageSize: number = 10,
  options?: { delay?: number }
) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);

  return createMockApi(
    {
      items: paginatedItems,
      total: items.length,
      page,
      pageSize,
      totalPages: Math.ceil(items.length / pageSize),
    },
    options
  );
};
