import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (refreshToken) {
    try {
      await fetch(`${process.env.BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.log(error);
    }
  }

  cookieStore.delete("accessToken");
  cookieStore.delete({ name: "refreshToken", path: "/api/auth" });

  return NextResponse.json({ message: "Logged out successfully" });
}
