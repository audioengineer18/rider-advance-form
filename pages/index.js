export default function Home() {
  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
          Rider → Advance Form (Test, Pages Router)
        </h1>

        <p>First, test the API in your browser: <a href="/api/extract">/api/extract</a></p>
        <p style={{ marginBottom: 16 }}>Then use the form below to POST.</p>

        <form id="uploadForm" style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <input type="file" id="fileInput" accept="application/pdf" style={{ display: "block", width: "100%", marginBottom: 12 }} />
          <button type="button" id="btn" style={{ padding: "10px 16px", borderRadius: 8, background: "#000", color: "#fff" }}>
            Upload & Extract
          </button>
        </form>

        <pre id="out" style={{ marginTop: 16, background: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", whiteSpace: "pre-wrap" }}></pre>

       <script
  dangerouslySetInnerHTML={{
    __html: `
      const btn = document.getElementById('btn');
      const out = document.getElementById('out');
      const fileInput = document.getElementById('fileInput');

      const log = (obj) => out.textContent = JSON.stringify(obj, null, 2);

      btn.addEventListener('click', async () => {
        out.textContent = '';
        const f = fileInput.files[0];
        if (!f) return log({ error: "Choose a PDF first." });

        try {
          const safeName = (f.name || "upload.pdf").replace(/[^\\w.\\- ]+/g, "_");
          const ct = f.type || "application/pdf";

          // 1) Ask server for a one-time upload URL
          const urlMaker = new URL('/api/blob-url', window.location.origin);
          urlMaker.searchParams.set('filename', safeName);
          urlMaker.searchParams.set('contentType', ct);

          const pre = await fetch(urlMaker.toString(), { method: 'POST' });
          const preJson = await pre.json();
          if (!pre.ok || !preJson?.ok) return log({ step: "createUploadUrl", error: preJson?.error || pre.statusText });

          // 2) Upload directly to Blob (bypasses function size limits)
          const up = await fetch(preJson.uploadUrl, {
            method: 'POST',
            headers: { 'content-type': ct },
            body: f
          });
          if (!up.ok) return log({ step: "blob upload", status: up.status, text: await up.text() });
          const blobInfo = await up.json(); // { url, ... }

          // 3) Ask server to fetch blob and parse
          const ex = await fetch('/api/extract-from-url', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ url: blobInfo.url, name: safeName })
          });
          const exJson = await ex.json();
          return log({ status: ex.status, ...exJson });
        } catch (e) {
          return log({ clientError: e?.message || String(e) });
        }
      });
    `
  }}
/>
