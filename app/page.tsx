"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to parse");
      setResult(json);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Rider → Advance Form (Test)</h1>
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-xl p-4 shadow space-y-4"
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full"
          />
          <button
            type="submit"
            disabled={!file || loading}
            className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
          >
            {loading ? "Parsing…" : "Upload & Extract"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
            {error}
          </div>
        )}
        {result && (
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-xl font-semibold mb-2">Parsed Result</h2>
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
