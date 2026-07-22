import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

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
      `${process.env.BACKEND_URL}/api/tasks/${id}/owner`,
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
