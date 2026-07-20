import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

async function getAccessTokenOrFail() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

export async function GET(request: NextRequest) {
  const accessToken = await getAccessTokenOrFail();

  if (!accessToken) {
    return NextResponse.json(
      { message: "Authentication token is missing." },
      { status: 401 },
    );
  }

  try {
    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/tasks${request.nextUrl.search}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the backend server." },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  const accessToken = await getAccessTokenOrFail();

  if (!accessToken) {
    return NextResponse.json(
      { message: "Authentication token is missing." },
      { status: 401 },
    );
  }

  const body = await request.json();

  try {
    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      },
    );

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the backend server." },
      { status: 502 },
    );
  }
}
