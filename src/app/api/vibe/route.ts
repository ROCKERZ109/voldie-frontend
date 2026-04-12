import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mood } = body;

    // Validation (Matching FastAPI's 422 Unprocessable Entity logic)
    if (!mood) {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 });
    }

    const BACKEND_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

    // Proxy request to FastAPI
    console.log(`${BACKEND_URL}/api/vibe`);
    console.log(`Request Body: ${JSON.stringify({ mood })}`);
    const response = await fetch(`${BACKEND_URL}/api/vibe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || "Failed to fetch vibe from backend");
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Vibe API Proxy Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
