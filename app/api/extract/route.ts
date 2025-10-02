import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ ok: false, error: "No file uploaded" }, { status: 400 });
  }

  // Stubbed JSON until we wire real parsing
  return NextResponse.json({
    ok: true,
    artist: "Colton Dixon",
    contacts: [
      { role: "Management", name: "Jennifer Fleming", email: "jennifer@qmanagementgroup.com", phone: "615-599-8884" },
      { role: "Tour Manager", name: "Blake McAllister", email: "blake@mcallisterproductions.com", phone: "770-316-8230" },
      { role: "Publicity", name: "Velvet Kelm", email: "velvet@themcollective.com", phone: "(615) 591-7989" },
      { role: "Booking", name: "Platform Artists", email: "", phone: "615-477-0786" }
    ],
    schedule: { headliner_loadin_minutes: 180, support_loadin_minutes: 90, soundcheck_required: true },
    production: {
      stage_min: "40’ x 40’",
      power: "200A single-phase disconnect or generator",
      consoles: "DiGiCo SD12 / Quantum 225 (FOH + Mon)",
      lighting: "grandMA3",
      pa: "Pro line-array (d&b / L’Acoustics / JBL VTX / Meyer)",
      led: "16x9 center, SDI @ SL",
      cryo: "6 x 50lb CO2 siphoned tanks"
    },
    hospitality: {
      rooms: "5 double-occupancy (Marriott/Hampton/Holiday)",
      early_check_in: "Driver 8:45am",
      allergy: "Mushroom",
      post_show_buyout: "$150"
    }
  });
}
