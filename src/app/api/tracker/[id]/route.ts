import { NextResponse } from 'next/server';

export async function PATCH(request: Request, props: { params: Promise<{ id?: string, }> }) {
  try {
    const body = await request.json();
    const BACKEND_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

    const params = await props.params;

    const extractedId = params.id;

    console.log("Next.js API received ID:", extractedId);
    // params.id URL se aayega
    const response = await fetch(`${BACKEND_URL}/api/tracker/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: body.status }),
    });

    if (!response.ok) throw new Error("Status update failed");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Tracker PATCH API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(request: Request, props: { params: Promise<{ id?: string, }> }) {
  try {
    const BACKEND_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

    const params = await props.params;

    const extractedId = params.id;

    console.log("Next.js API received ID:", extractedId);
    // params.id URL se aayega
    const response = await fetch(`${BACKEND_URL}/api/tracker/${params.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error("Job deletion failed");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Tracker DELETE API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
