export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Hit this at /api/extract in your browser
      return res.status(200).json({ ok: true, ping: "pong" });
    }

    if (req.method === "POST") {
      // We’re not parsing yet—just proving POST works.
      // In pages router, Next parses multipart only if a body parser is custom;
      // we’ll keep it simple and just return a stub.
      return res.status(200).json({
        ok: true,
        note: "POST reached (stub, pages router)"
      });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
}
