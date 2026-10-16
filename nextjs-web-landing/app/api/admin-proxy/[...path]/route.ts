import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminUpstreamUrl, isAllowedAdminProxy } from "@/lib/admin/proxy";

const MAX_BODY = 8000;

async function handle(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  if (!isAllowedAdminProxy(request.method, path)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Login required" }, { status: 401 });
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  let body: string | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.text();
    if (body.length > MAX_BODY) {
      return NextResponse.json({ message: "Request is too large" }, { status: 413 });
    }
    if (body) {
      headers["Content-Type"] = "application/json";
    }
  }

  let upstream: Response;
  try {
    upstream = await fetch(adminUpstreamUrl(path, request.nextUrl.searchParams), {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return NextResponse.json({ message: "Could not reach the admin service" }, { status: 503 });
  }

  if (upstream.status >= 300 && upstream.status < 400) {
    return NextResponse.json({ message: "Unexpected response from the admin service" }, { status: 502 });
  }

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
