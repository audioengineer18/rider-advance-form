// app/api/extract/route.ts
import { NextResponse } from "next/server";
export const runtime = "nodejs";

// Visit this in your browser:  /api/extract
export async function GET() {
  return NextResponse.json({ ok: true, ping: "pong" });
}

// Upload form will call this
export async function POST(_req: Request) {
  return NextResponse.json({ ok: true, note: "POST reached (stub)" });
}
