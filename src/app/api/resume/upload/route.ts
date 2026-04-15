import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // PDF file FormData ke form mein aati hai
    const formData = await req.formData();

    const BACKEND_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

    // Same FormData hum exactly FastAPI ko forward kar denge
    const backendRes = await fetch(`${BACKEND_URL}/api/resume/upload`, {
      method: "POST",
    
      body: formData,
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Next.js API Error (PDF Upload):", error);
    return NextResponse.json(
      { error: "Failed to upload the PDF to the engine." },
      { status: 500 }
    );
  }
}
