import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ ok: false, error: "No file uploaded" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    artist: "Colton Dixon",
    contacts: [
      { role: "Management", name: "Jennifer Fleming", email: "jennifer@qmanagementgroup.com", phone: "615-599-8884" },
      { role: "Tour Manager", name: "Blake McAllister", email: "blake@mcallisterproductions.com", phone: "770-316-8230" },
      { role: "Publicity", name: "Velvet Kelm", email: "velvet@themcollective.com", phone: "(615) 591-7989" },
      { role: "Booking", name: "Platform Artists", email: "", phone: "615-477-0786" }
    ]
  });
}
