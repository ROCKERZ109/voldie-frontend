import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, raw_text } = body;

    // Ab dono mein se koi ek hona zaroori hai
    if (!url && !raw_text) {
      return NextResponse.json({ error: "Provide a URL or Raw Text" }, { status: 400 });
    }

    const BACKEND_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

    const response = await fetch(`${BACKEND_URL}/api/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, raw_text }), // Pass both
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      throw new Error("Extraction failed on python backend");
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Extractor API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
