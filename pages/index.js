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
              btn.addEventListener('click', async () => {
                out.textContent = '';
                const f = fileInput.files[0];
                const fd = new FormData();
                if (f) {
                  const safeName = f.name ? f.name.replace(/[^\w.\\- ]+/g, "_") : "upload.pdf";
                  fd.append('file', f, safeName);
                }
                try {
                  const res = await fetch('/api/extract', { method: 'POST', body: fd });
                  const raw = await res.text();
                  out.textContent = JSON.stringify({ status: res.status, statusText: res.statusText, raw }, null, 2);
                } catch (e) {
                  out.textContent = 'Client error: ' + (e?.message || e);
                }
              });
            `
          }}
        />
      </div>
    </main>
  );
}
