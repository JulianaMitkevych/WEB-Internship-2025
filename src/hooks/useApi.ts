import { useCallback, useState } from 'react';
import { useStorage } from '@/hooks/useStorage';
import { useRouter } from 'next/navigation';

type TApiResponse<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

type TApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
};

export function useApi<T = unknown>() {
  const router = useRouter();
  const [, setStore] = useStorage();
  const [state, setState] = useState<TApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const request = useCallback(
    async <R = T>(url: string, options: TApiOptions = {}, route?: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const doFetch = async (): Promise<Response> => {
        const config: RequestInit = {
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          credentials: 'include',
        };

        if (options.body && options.method !== 'GET') {
          config.body = JSON.stringify(options.body);
        }

        return fetch(url, config);
      };

      const parseResponse = async (response: Response) => {
        const contentType = response.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
          return await response.json().catch(() => ({}));
        }
        return await response.text().catch(() => '');
      };

      try {
        setStore((prevState) => ({
          ...prevState,
          isLoading: true,
        }));

        let response = await doFetch();

        if (response.status === 401) {
          const refreshRes = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });

          if (!refreshRes.ok) {
            throw { status: 401, message: 'Unauthorized', data: null };
          }

          response = await doFetch();
        }

        const responseData = await parseResponse(response);

        if (!response.ok) {
          const errorMessage =
            responseData?.message || response.statusText || 'Unknown error';

          const errorResponse = {
            status: response.status,
            message: errorMessage,
            url: response.url,
            data: responseData,
          };

          setState({ data: null, error: errorMessage, loading: false });

          if (errorResponse.status === 401) {
            try {
              const refreshRes = await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include',
              });

              if (refreshRes.ok) {
                const retryRes = await doFetch();
                const retryData = await parseResponse(retryRes);

                if (!retryRes.ok) {
                  throw {
                    status: retryRes.status,
                    message: retryData?.message || retryRes.statusText,
                    url: retryRes.url,
                    data: retryData,
                  };
                }

                setState({ data: retryData as T, error: null, loading: false });
                if (route) router.push(route);
                return retryData as R;
              }
            } catch {
              throw { status: 401, message: 'Unauthorized', data: null };
            }
          }

          throw errorResponse;
        }

        setState({ data: responseData as T, error: null, loading: false });

        if (route) {
          router.push(route);
        }

        return responseData as R;
      } catch (error: unknown) {
        if (
          error &&
          typeof error === 'object' &&
          'status' in error &&
          (error as { status: number }).status === 401
        ) {
          try {
            const refreshRes = await fetch('/api/auth/refresh', {
              method: 'POST',
              credentials: 'include',
            });

            if (refreshRes.ok) {
              const retryRes = await doFetch();
              const retryData = await parseResponse(retryRes);

              if (!retryRes.ok) {
                throw {
                  status: retryRes.status,
                  message: retryData?.message || retryRes.statusText,
                  url: retryRes.url,
                  data: retryData,
                };
              }

              setState({ data: retryData as T, error: null, loading: false });
              if (route) router.push(route);
              return retryData as R;
            }
          } catch {
            throw { status: 401, message: 'Unauthorized', data: null };
          }
        }

        const errorMessage =
          (error && typeof error === 'object' && 'message' in error
            ? (error as { message: string }).message
            : null) ||
          (error instanceof Error ? error.message : 'Network error');

        setState({ data: null, error: errorMessage, loading: false });
        throw error;
      } finally {
        setStore((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }
    },
    [router, setStore]
  );

  const get = useCallback(
    (url: string, headers?: Record<string, string>, route?: string) =>
      request<T>(url, { method: 'GET', headers }, route),
    [request]
  );

  const post = useCallback(
    (
      url: string,
      body?: unknown,
      headers?: Record<string, string>,
      route?: string
    ) => request<T>(url, { method: 'POST', body, headers }, route),
    [request]
  );

  const put = useCallback(
    (
      url: string,
      body?: unknown,
      headers?: Record<string, string>,
      route?: string
    ) => request<T>(url, { method: 'PUT', body, headers }, route),
    [request]
  );

  const del = useCallback(
    (
      url: string,
      body?: unknown,
      headers?: Record<string, string>,
      route?: string
    ) => request<T>(url, { method: 'DELETE', body, headers }, route),
    [request]
  );

  const patch = useCallback(
    (
      url: string,
      body?: unknown,
      headers?: Record<string, string>,
      route?: string
    ) => request<T>(url, { method: 'PATCH', body, headers }, route),
    [request]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false });
  }, []);

  const download = useCallback(
    async (url: string, headers?: Record<string, string>) => {
      setStore((prev) => ({ ...prev, isLoading: true }));
      try {
        const res = await fetch(url, { method: 'GET', headers });
        if (!res.ok) throw new Error('Failed to download');
        return await res.blob();
      } catch (error) {
        throw error;
      } finally {
        setStore((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [setStore]
  );

  return {
    ...state,
    request,
    get,
    post,
    put,
    del,
    patch,
    reset,
    download,
  };
}
