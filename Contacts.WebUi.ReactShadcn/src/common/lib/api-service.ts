import axios, { type AxiosRequestConfig } from 'axios';

type RequestOptions = {
  headers?: AxiosRequestConfig['headers'];
  params?: AxiosRequestConfig['params'];
  signal?: AbortSignal;
};

export const apiService = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>('GET', path, undefined, options);
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('POST', path, body, options);
  },

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('PUT', path, body, options);
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>('DELETE', path, undefined, options);
  },
} as const;

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const response = await http.request<T>({
    method,
    url: path,
    data: body,
    headers: options?.headers,
    params: options?.params,
    signal: options?.signal,
  });

  return response.data;
}
