export class AdminRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers,
    cache: "no-store",
    credentials: "same-origin",
  });

  const data = (await response.json().catch(() => ({}))) as { message?: unknown };
  if (!response.ok) {
    const message = typeof data.message === "string" ? data.message : "Request failed";
    throw new AdminRequestError(message, response.status);
  }
  return data as T;
}
