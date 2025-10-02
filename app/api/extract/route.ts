// app/api/extract/route.ts
import { NextResponse } from "next/server";

// Use Node runtime (handles multipart/form-data reliably)
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "No file uploaded (expected a File in 'file')" },
        { status: 400 }
      );
    }

    // We’re not parsing yet—just proving round-trip works.
    const buf = await file.arrayBuffer();
    const size = buf.byteLength;

    return NextResponse.json({
      ok: true,
      received: { name: file.name, size },

      // --- Stubbed extraction so the UI shows a nice result ---
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
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}
