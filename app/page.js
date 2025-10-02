"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/extract", { method: "POST", body: fd });
      const raw = await res.text();

      setResult({ status: res.status, statusText: res.statusText, raw });

      try {
        const json = JSON.parse(raw);
        if (!res.ok || json.ok === false) {
          setError(json.error || `HTTP ${res.status} ${res.statusText}`);
        }
      } catch {
        // raw wasn't JSON; already displayed
      }
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Rider → Advance Form (Test)</h1>

        <form onSubmit={onSubmit} style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", marginTop: 16 }}>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: "block", width: "100%", marginBottom: 12 }}
          />
          <button
            type="submit"
            disabled={!file || loading}
            style={{ padding: "10px 16px", borderRadius: 8, background: "#000", color: "#fff", opacity: !file || loading ? 0.6 : 1 }}
          >
            {loading ? "Parsing…" : "Upload & Extract"}
          </button>
        </form>

        {error && (
          <div style={{ background: "#fdecec", border: "1px solid #f5c2c7", color: "#b42318", padding: 12, borderRadius: 8, marginTop: 16 }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", marginTop: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Server Response</h2>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
