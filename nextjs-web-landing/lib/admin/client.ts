import { API_BASE_URL } from "@/lib/constants";
import { clearAdminSession, getAdminToken } from "@/lib/admin/token";

export class AdminRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  const token = getAdminToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const apiPath = path.startsWith("/api/") ? path : `/api${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(`${API_BASE_URL}${apiPath}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as { message?: unknown };
  if (response.status === 401) {
    clearAdminSession();
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  }
  if (!response.ok) {
    const message = typeof data.message === "string" ? data.message : "Request failed";
    throw new AdminRequestError(message, response.status);
  }
  return data as T;
}
