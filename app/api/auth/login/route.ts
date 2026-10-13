import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Functional mockup: accept credentials, set cookie
    const cookieStore = await cookies();
    const sessionUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 8),
      email: email.trim(),
      name: email.split("@")[0] || "Pendengar Aura"
    };

    cookieStore.set("aura_session", JSON.stringify(sessionUser), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return NextResponse.json({ success: true, user: sessionUser });
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
