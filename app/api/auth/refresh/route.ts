import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "Invalid or expired refresh token." },
      { status: 401 },
    );
  }

  try {
    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      },
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    cookieStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    return NextResponse.json({ message: "Access token refreshed" });
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to reach the backend server." },
      { status: 502 },
    );
  }
}
