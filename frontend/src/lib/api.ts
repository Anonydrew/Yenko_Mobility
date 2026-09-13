export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly fields: Record<string, string> = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  form?: FormData;
  signal?: AbortSignal;
};

/** Calls the PHP API on the same origin. Throws ApiError with the server's message and field errors. */
export async function api<T>(path: string, { method, body, form, signal }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' };
  let payload: BodyInit | undefined;
  if (form) {
    payload = form;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method: method ?? (payload ? 'POST' : 'GET'),
      headers,
      body: payload,
      credentials: 'same-origin',
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(0, "We couldn't reach the server. Check your connection and try again.");
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  let json: { error?: { message?: string; fields?: Record<string, string> } } | null = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // Non-JSON response (e.g. the API server is down behind the dev proxy).
  }

  if (!response.ok) {
    throw new ApiError(response.status, json?.error?.message ?? 'Something went wrong. Please try again.', json?.error?.fields ?? {});
  }

  return json as T;
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}
