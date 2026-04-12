import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, action, job_url, reason } = body;

    const BACKEND_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

    // Proxy request to FastAPI
    const response = await fetch(`${BACKEND_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, action, job_url, reason }),
    });

    if (!response.ok) {
      throw new Error("Failed to log feedback in backend");
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Feedback API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
