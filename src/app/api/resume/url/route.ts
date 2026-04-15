import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    
    const BACKEND_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

    const backendRes = await fetch(`${BACKEND_URL}/api/resume/url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    // Agar FastAPI fati, toh error aage bhej do
    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Next.js API Error (URL Sync):", error);
    return NextResponse.json(
      { error: "Failed to connect to the Intelligence Engine." },
      { status: 500 }
    );
  }
}
