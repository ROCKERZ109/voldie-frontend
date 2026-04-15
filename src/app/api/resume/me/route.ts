import { NextResponse } from "next/server";

export async function GET() {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const backendRes = await fetch(`${BACKEND_URL}/api/resume/me`, { cache: 'no-store' });
    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}
