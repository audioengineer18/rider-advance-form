import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, ping: "pong" });
}

export async function POST() {
  return NextResponse.json({ ok: true, note: "POST reached (stub)" });
}
