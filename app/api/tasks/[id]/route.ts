import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json(
      { message: "Authentication token is missing." },
      { status: 401 },
    );
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/tasks/${id}`,
      {
        method: "PATCH",
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json(
      { message: "Authentication token is missing." },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/tasks/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
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
