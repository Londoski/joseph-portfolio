import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function requireAdmin() {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) return null;

    const cookieStore = await cookies();
    const raw =
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value;

    if (!raw) return null;

    const decoded = await decode({ token: raw, secret });
    if (!decoded) return null;

    return { user: decoded };
  } catch (err) {
    console.error("requireAdmin error:", err);
    return null;
  }
}