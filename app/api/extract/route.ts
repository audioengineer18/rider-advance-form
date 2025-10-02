// app/api/extract/route.ts
import { NextResponse } from "next/server";

// Use Node runtime for predictable form handling
export const runtime = "nodejs";

export async function POST(_req: Request) {
  // Don’t parse the form yet—just prove round trip works
  return NextResponse.json({
    ok: true,
    received: "stubbed",
    note: "If you see this in the UI, the POST round-trip is working."
  });
}
