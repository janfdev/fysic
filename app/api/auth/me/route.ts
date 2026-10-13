import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("aura_session");
    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false, user: null });
    }
    const user = JSON.parse(sessionCookie.value);
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("aura_session");
  return NextResponse.json({ success: true });
}
