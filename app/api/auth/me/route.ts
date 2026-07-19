import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: "Authentication token is missing." },
      { status: 401 },
    );
  }

  try {
    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/auth/me`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    const data = await backendResponse.json();

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to reach the backend server." },
      { status: 502 },
    );
  }
}
