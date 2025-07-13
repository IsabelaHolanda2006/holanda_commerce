import 'dotenv/config';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

interface FetchResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
}

export default async function UseFetching<T = unknown>(
  url: string, 
  options: FetchOptions = {}
): Promise<FetchResponse<T>> {
  const { method = 'GET', body = null, headers = {} } = options;

  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    
    const baseUrl = isLocalhost ? 'http://localhost:8000/api' : `${process.env.API_URL}/api`;
    const fullUrl = `${baseUrl}${url}`;
    
      const requestHeaders: Record<string, string> = {
      ...headers,
    };
    
    if (body !== null && body !== undefined) {
      requestHeaders['Content-Type'] = 'application/json';
    }
    
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };
    
    if (method !== 'GET' && method !== 'DELETE' && body !== null) {
      requestOptions.body = JSON.stringify(body);
    }
    
    const response = await fetch(fullUrl, requestOptions);
    
    if (!response.ok) {
      let errorMessage = 'Request failed';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      return {
        data: null,
        error: errorMessage,
        status: response.status,
      };
    }
    
    let data: T | null = null;
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text() as unknown as T;
      }
    } catch {
      return {
        data: null,
        error: 'Failed to parse response data',
        status: response.status,
      };
    }
    
    return {
      data,
      error: null,
      status: response.status,
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    
    return {
      data: null,
      error: errorMessage,
      status: 0,
    };
  }
}