import { API_BASE_URL } from "@/lib/constants";

export const ADMIN_COOKIE = "ca_admin_session";

const ID = /^[a-zA-Z0-9_-]{8,40}$/;
const LIST_SEGMENTS = new Set([
  "stats",
  "teachers",
  "organizations",
  "parents",
  "purchases",
  "refund-requests",
  "deletion-requests",
]);
const QUERY_KEYS = new Set(["page", "pageSize", "q", "status"]);

export function isAllowedAdminProxy(method: string, segments: string[]): boolean {
  if (
    segments.length === 0 ||
    segments.length > 4 ||
    segments.some((segment) => segment.includes("..") || segment.includes("/") || segment.includes("\\"))
  ) {
    return false;
  }

  const [root, a, b, c] = segments;

  if (root === "admin") {
    if (segments.length === 2 && LIST_SEGMENTS.has(a)) {
      return method === "GET";
    }
    if (
      segments.length === 4 &&
      a === "refund-requests" &&
      ID.test(b) &&
      (c === "accept" || c === "decline")
    ) {
      return method === "POST";
    }
    if (segments.length === 4 && a === "deletion-requests" && ID.test(b) && c === "approve") {
      return method === "POST";
    }
    return false;
  }

  if (root === "subjects") {
    if (segments.length === 2 && a === "verify") {
      return method === "GET";
    }
    if (segments.length === 3 && (a === "verify" || a === "reject") && ID.test(b)) {
      return method === "PUT";
    }
    if (segments.length === 2 && ID.test(a)) {
      return method === "GET";
    }
  }

  return false;
}

export function adminUpstreamUrl(segments: string[], searchParams: URLSearchParams): string {
  const url = new URL(`${API_BASE_URL}/api/${segments.map(encodeURIComponent).join("/")}`);
  for (const [key, value] of searchParams.entries()) {
    if (QUERY_KEYS.has(key)) {
      url.searchParams.append(key, value);
    }
  }
  return url.toString();
}
