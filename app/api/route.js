import { NextResponse } from "next/server";
export const runtime = "nodejs";

// Test in your browser:  /api/extract
export async function GET() {
  return NextResponse.json({ ok: true, ping: "pong" });
}

// Called by the form. No file handling yet.
export async function POST() {
  return NextResponse.json({ ok: true, note: "POST reached (stub)" });
}
