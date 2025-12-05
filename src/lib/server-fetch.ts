import { cookies, headers } from 'next/headers';

/**
 * Server-side fetch helper for making requests to local API routes
 * Automatically includes cookies from the current request context
 */
export class ServerFetchHelper {
  /**
   * Get base URL for local API calls
   */
  private static async getBaseUrl(): Promise<string> {
    try {
      // Try to get host from current request headers
      const headersList = await headers();
      const host = headersList.get('host');

      if (host) {
        const protocol =
          process.env.NODE_ENV === 'production' ? 'https' : 'http';
        return `${protocol}://${host}`;
      }
    } catch (error) {
      console.warn('Failed to get host from headers:', error);
    }

    // Fallback to environment variable or localhost
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL;
    }

    // Final fallback
    return 'http://localhost:3000';
  }

  /**
   * Handle backend response
   */
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: unknown = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw { status: response.status, data: errorData };
    }
    return response.json();
  }

  /**
   * Make GET request to local API
   */
  static async get<T>(
    endpoint: string,
    queryParams?: URLSearchParams,
    options?: {
      tags?: string[];
      cache?: RequestCache;
    }
  ): Promise<T> {
    const baseUrl = await this.getBaseUrl();
    const apiUrl = `${baseUrl}${endpoint}`;

    const url = `${apiUrl}${queryParams?.toString() ? `?${queryParams.toString()}` : ''}`;

    // Get cookies from the current request context
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    try {
      const fetchOptions: RequestInit = {
        method: 'GET',
        headers: {
          Cookie: cookieHeader,
        },
      };

      // Configure caching based on options
      if (options?.cache === 'no-store') {
        fetchOptions.cache = 'no-store';
      } else {
        fetchOptions.next = {
          revalidate: 180,
          ...(options?.tags && { tags: options.tags }),
        };
      }

      const response = await fetch(url, fetchOptions);
      return this.handleResponse<T>(response);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error) throw error;
      throw {
        status: 500,
        data: {
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Make POST request to local API
   */
  static async post<T>(
    endpoint: string,
    body: unknown,
    queryParams?: URLSearchParams
  ): Promise<T> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}${endpoint}${queryParams?.toString() ? `?${queryParams.toString()}` : ''}`;

    // Get cookies from the current request context
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        body: JSON.stringify(body),
      });

      return this.handleResponse<T>(response);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error) throw error;
      throw {
        status: 500,
        data: {
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Make PUT request to local API
   */
  static async put<T>(
    endpoint: string,
    body: unknown,
    queryParams?: URLSearchParams
  ): Promise<T> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}${endpoint}${queryParams?.toString() ? `?${queryParams.toString()}` : ''}`;

    // Get cookies from the current request context
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        body: JSON.stringify(body),
      });

      return this.handleResponse<T>(response);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error) throw error;
      throw {
        status: 500,
        data: {
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Make DELETE request to local API
   */
  static async delete<T>(
    endpoint: string,
    queryParams?: URLSearchParams
  ): Promise<T> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}${endpoint}${queryParams?.toString() ? `?${queryParams.toString()}` : ''}`;

    // Get cookies from the current request context
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Cookie: cookieHeader,
        },
      });

      return this.handleResponse<T>(response);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error) throw error;
      throw {
        status: 500,
        data: {
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Make PATCH request to local API
   */
  static async patch<T>(
    endpoint: string,
    body: unknown,
    queryParams?: URLSearchParams
  ): Promise<T> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}${endpoint}${queryParams?.toString() ? `?${queryParams.toString()}` : ''}`;

    // Get cookies from the current request context
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        body: JSON.stringify(body),
      });

      return this.handleResponse<T>(response);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error) throw error;
      throw {
        status: 500,
        data: {
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }
}
