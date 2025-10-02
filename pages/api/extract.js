import formidable from "formidable";
import fs from "node:fs";
import pdfParse from "pdf-parse";

export const config = {
  api: { bodyParser: false }, // important: let formidable handle multipart/form-data
};

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      return res.status(200).json({ ok: true, ping: "pong" });
    }

    if (req.method !== "POST") {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    // Parse the upload
    const { fields, files } = await new Promise((resolve, reject) => {
      const form = formidable({ multiples: false, keepExtensions: true });
      form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
    });

    const uploaded = files.file; // the <input name="file">
    if (!uploaded) {
      return res.status(400).json({ ok: false, error: "No file uploaded. Use field name 'file'." });
    }

    const filePath = Array.isArray(uploaded) ? uploaded[0].filepath : uploaded.filepath;
    const originalName = Array.isArray(uploaded) ? uploaded[0].originalFilename : uploaded.originalFilename;
    const buf = await fs.promises.readFile(filePath);

    // Try PDF text (if it’s a PDF)
    let text = "";
    if (originalName?.toLowerCase().endsWith(".pdf")) {
      try {
        const parsed = await pdfParse(buf);
        text = parsed.text || "";
      } catch (e) {
        // If pdf parsing fails, still return the basics
        text = "";
      }
    }

    // Very simple demo extraction (you can improve these later)
    const find = (re) => (text.match(re)?.[1] || "").trim();
    const artist =
      find(/COLTON\s*DIXON/i) ? "Colton Dixon" :
      find(/Artist[:\s]+([^\n]+)/i) || "Unknown";

    const contacts = [];
    if (/Jennifer Fleming/i.test(text)) {
      contacts.push({ role: "Management", name: "Jennifer Fleming", email: "jennifer@qmanagementgroup.com", phone: "615-599-8884" });
    }
    if (/Blake McAllister/i.test(text)) {
      contacts.push({ role: "Tour Manager", name: "Blake McAllister", email: "blake@mcallisterproductions.com", phone: "770-316-8230" });
    }
    if (/Velvet Kelm/i.test(text)) {
      contacts.push({ role: "Publicity", name: "Velvet Kelm", email: "velvet@themcollective.com", phone: "(615) 591-7989" });
    }
    if (/Platform Artists/i.test(text)) {
      contacts.push({ role: "Booking", name: "Platform Artists", email: "", phone: "615-477-0786" });
    }

    // Return JSON
    return res.status(200).json({
      ok: true,
      received: { name: originalName, size: buf.length },
      artist,
      contacts,
      // include first 1000 chars of text for sanity:
      sampleText: text ? text.slice(0, 1000) : "(no text or not a PDF)",
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
}
