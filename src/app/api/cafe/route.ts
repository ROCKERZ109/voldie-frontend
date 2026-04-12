import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const BACKEND_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

    // Proxy request to FastAPI
    const response = await fetch(`${BACKEND_URL}/api/cafe`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store' // Don't cache, we want fresh recommendations
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to fetch cafe from backend");
    }

    const data = await response.json();
    console.log("Cafe API Proxy Success:", data);
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Cafe API Proxy Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
