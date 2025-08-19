import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.GROQ_API_KEY || "";
  return NextResponse.json({
    hasGroq: Boolean(key),
    keyPreview: key ? `${key.slice(0, 5)}…${key.slice(-2)}` : null,
  });
}


