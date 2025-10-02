import { NextResponse } from "next/server";
export const runtime = "nodejs";

// Visit this in your browser:  /api/extract
export async function GET() {
  return NextResponse.json({ ok: true, ping: "pong" });
}

// The upload form POSTs here
export async function POST(_req: Request) {
  return NextResponse.json({ ok: true, note: "POST reached (stub)" });
}
