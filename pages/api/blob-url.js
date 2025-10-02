import { createUploadUrl } from "@vercel/blob";
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }
  const { filename, contentType } = req.query || {};
  if (!filename || !contentType) {
    return res.status(400).json({ ok: false, error: "Missing filename or contentType" });
  }
  try {
    const { url } = await createUploadUrl({
      access: "public",
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    return res.status(200).json({ ok: true, uploadUrl: url });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Blob URL error" });
  }
}
