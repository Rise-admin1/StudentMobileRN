import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";
import { ADMIN_COOKIE } from "@/lib/admin/proxy";
import { adminCookieOptions, emailFromAdminToken } from "@/lib/admin/session";

function clearCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, "", { ...adminCookieOptions, maxAge: 0 });
  return response;
}

export async function POST(request: NextRequest) {
  let email = "";
  let password = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email.trim() : "";
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${API_BASE_URL}/api/auth/super-admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return NextResponse.json({ message: "Could not reach the admin service" }, { status: 503 });
  }

  const data = (await upstream.json().catch(() => ({}))) as {
    message?: unknown;
    token?: unknown;
    userType?: unknown;
    email?: unknown;
    userName?: unknown;
  };

  if (!upstream.ok || data.userType !== "ADMIN" || typeof data.token !== "string") {
    const message = typeof data.message === "string" ? data.message : "Invalid email or password";
    return NextResponse.json({ message }, { status: upstream.ok ? 403 : upstream.status || 400 });
  }

  const response = NextResponse.json({
    authenticated: true,
    email: typeof data.email === "string" ? data.email : email,
    userName: typeof data.userName === "string" ? data.userName : null,
  });
  response.cookies.set(ADMIN_COOKIE, data.token, adminCookieOptions);
  return response;
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${API_BASE_URL}/api/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return NextResponse.json({ message: "Could not reach the admin service" }, { status: 503 });
  }

  if (upstream.status === 401 || upstream.status === 403) {
    return clearCookie(NextResponse.json({ authenticated: false }, { status: 401 }));
  }

  if (!upstream.ok) {
    return NextResponse.json({ message: "Could not reach the admin service" }, { status: 503 });
  }

  return NextResponse.json({
    authenticated: true,
    email: emailFromAdminToken(token),
  });
}

export async function DELETE() {
  return clearCookie(NextResponse.json({ authenticated: false }));
}
