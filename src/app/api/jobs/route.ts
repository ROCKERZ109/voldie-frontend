import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Defaulting query_type to "backend" as per your FastAPI schema
    const { mood, query_type = "backend", custom_query } = body;

    if (!mood) {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 });
    }

    const BACKEND_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

    const response = await fetch(`${BACKEND_URL}/api/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, query_type, custom_query }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || "FastAPI Hunt Failed");
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Jobs API Proxy Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
