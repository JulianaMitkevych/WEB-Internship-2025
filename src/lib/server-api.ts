import { cookies } from 'next/headers';

/**
 * Server-side API helper that automatically gets auth token from cookies
 * This should only be used in server components and API routes
 */
export class ServerApiHelper {
  private static baseURL = process.env.BACKEND_API_URL;

  /**
   * Get auth token from cookies
   */
  private static async getAuthToken(): Promise<string | undefined> {
    try {
      const cookieStore = await cookies();
      return cookieStore.get('authToken')?.value;
    } catch (error) {
      console.error('Failed to get auth token from cookies:', error);
      return undefined;
    }
  }

  /**
   * Handle backend response
   */
  private static async handleResponse<T>(response: Response): Promise<T> {
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      data = {
        message: response.statusText || 'Unknown error',
        error: response.statusText,
        statusCode: response.status,
      };
    }

    if (!response.ok) {
      const errorData =
        data && typeof data === 'object' && 'statusCode' in data
          ? data
          : {
              message:
                (data && typeof data === 'object' && 'message' in data
                  ? (data as { message: string }).message
                  : null) || response.statusText,
              error:
                (data && typeof data === 'object' && 'error' in data
                  ? (data as { error: string }).error
                  : null) || response.statusText,
              statusCode: response.status,
            };
      throw { status: response.status, data: errorData };
    }

    return data as T;
  }

  /**
   * Make authenticated request to external backend
   */
  private static async makeRequest<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      body?: unknown;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const authToken = await this.getAuthToken();

    if (!authToken) {
      throw {
        status: 401,
        data: {
          message: 'Authentication token not found',
          error: 'Unauthorized',
          statusCode: 401,
        },
      };
    }

    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
      ...options.headers,
    };

    const config: RequestInit = {
      method: options.method || 'GET',
      headers,
    };

    if (options.body && options.method !== 'GET') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      return this.handleResponse<T>(response);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error) throw error;
      throw {
        status: 500,
        data: {
          message: error instanceof Error ? error.message : 'Unknown error',
          error: 'Internal Server Error',
          statusCode: 500,
        },
      };
    }
  }

  /**
   * GET request
   */
  static async get<T>(
    endpoint: string,
    queryParams?: URLSearchParams
  ): Promise<T> {
    const url = `${endpoint}${queryParams?.toString() ? `?${queryParams.toString()}` : ''}`;

    return this.makeRequest<T>(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  static async post<T>(
    endpoint: string,
    body: unknown,
    queryParams?: URLSearchParams
  ): Promise<T> {
    const url = `${endpoint}${queryParams?.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<T>(url, { method: 'POST', body });
  }

  /**
   * POST request without authentication (for login, registration, etc.)
   */
  static async postWithoutAuth<T>(
    endpoint: string,
    body: unknown,
    queryParams?: URLSearchParams,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}${queryParams?.toString() ? `?${queryParams.toString()}` : ''}`;

    const headers: Record<string, string> = {
      ...customHeaders,
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    };

    try {
      const response = await fetch(url, config);
      return this.handleResponse<T>(response);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error) throw error;
      throw {
        status: 500,
        data: {
          message: error instanceof Error ? error.message : 'Unknown error',
          error: 'Internal Server Error',
          statusCode: 500,
        },
      };
    }
  }

  /**
   * PUT request
   */
  static async put<T>(
    endpoint: string,
    body: unknown,
    queryParams?: URLSearchParams
  ): Promise<T> {
    const url = `${endpoint}${queryParams?.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<T>(url, { method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  static async delete<T>(
    endpoint: string,
    body?: unknown,
    queryParams?: URLSearchParams
  ): Promise<T> {
    const url = `${endpoint}${queryParams?.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<T>(url, { method: 'DELETE', body });
  }

  /**
   * PATCH request
   */
  static async patch<T>(
    endpoint: string,
    body?: unknown,
    queryParams?: URLSearchParams
  ): Promise<T> {
    const url = `${endpoint}${queryParams?.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<T>(url, { method: 'PATCH', body });
  }
}
