import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Nama, email, dan password wajib diisi" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 8),
      email: email.trim(),
      name: name.trim()
    };

    cookieStore.set("aura_session", JSON.stringify(sessionUser), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return NextResponse.json({ success: true, user: sessionUser });
  } catch (error) {
    return NextResponse.json({ error: "Registrasi gagal" }, { status: 500 });
  }
}
