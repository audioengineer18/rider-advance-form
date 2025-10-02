import pdfParse from "pdf-parse";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }
  const { url, name } = req.body || {};
  if (!url) return res.status(400).json({ ok: false, error: "Missing url" });

  try {
    const resp = await fetch(url);
    if (!resp.ok) return res.status(400).json({ ok: false, error: `Fetch blob failed: ${resp.status}` });
    const ab = await resp.arrayBuffer();
    const buf = Buffer.from(ab);

    let text = "";
    if ((name || url).toLowerCase().includes(".pdf")) {
      try {
        const data = await pdfParse(buf);
        text = data.text || "";
      } catch { /* ignore parse errors */ }
    }

    // super-simple demo extraction you can expand later
    const find = (re) => (text.match(re)?.[1] || "").trim();
    const artist =
      /COLTON\s*DIXON/i.test(text) ? "Colton Dixon" :
      find(/Artist[:\s]+([^\n]+)/i) || "Unknown";

    const contacts = [];
    if (/Jennifer Fleming/i.test(text)) contacts.push({ role: "Management", name: "Jennifer Fleming" });
    if (/Blake McAllister/i.test(text)) contacts.push({ role: "Tour Manager", name: "Blake McAllister" });
    if (/Velvet Kelm/i.test(text)) contacts.push({ role: "Publicity", name: "Velvet Kelm" });
    if (/Platform Artists/i.test(text)) contacts.push({ role: "Booking", name: "Platform Artists" });

    return res.status(200).json({
      ok: true,
      received: { name: name || "(unknown)", size: buf.length, url },
      artist,
      contacts,
      sampleText: text ? text.slice(0, 1000) : "(no text or not a PDF)"
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
}
