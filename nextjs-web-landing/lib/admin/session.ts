export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 12,
};

export function emailFromAdminToken(token: string): string | null {
  const part = token.split(".")[1];
  if (!part) return null;
  try {
    const json = Buffer.from(part, "base64url").toString("utf8");
    const payload = JSON.parse(json) as { email?: unknown; userType?: unknown };
    if (payload.userType !== "ADMIN" || typeof payload.email !== "string") return null;
    return payload.email;
  } catch {
    return null;
  }
}
