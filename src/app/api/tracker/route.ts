import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const jobData = await request.json();

    const BACKEND_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

    // Proxy request to FastAPI to save in DB
    const response = await fetch(`${BACKEND_URL}/api/tracker/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      throw new Error("Failed to save to backend DB");
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Tracker API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



// Add this below your existing POST function
export async function GET() {
  try {
    const BACKEND_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

    const response = await fetch(`${BACKEND_URL}/api/tracker`, {
      cache: 'no-store' // Always fetch fresh data for the board
    });

    if (!response.ok) throw new Error("Failed to fetch jobs from DB");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Tracker GET API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
