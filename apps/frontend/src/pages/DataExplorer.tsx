import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

type Entry = { path: string; size: number; lastModified: string | null; contentType: string | null };

async function fetchManifest(): Promise<Entry[]> {
  const r = await fetch('/api/explorer/manifest');
  if (!r.ok) throw new Error('Manifest fetch failed');
  return r.json();
}
async function fetchSAS(path: string) {
  const r = await fetch(`/api/explorer/file?path=${encodeURIComponent(path)}`);
  if (!r.ok) throw new Error('SAS fetch failed');
  return r.json() as Promise<{ url: string; ttlSeconds: number }>;
}
async function fetchPreview(path: string) {
  const r = await fetch(`/api/explorer/preview?path=${encodeURIComponent(path)}`);
  if (!r.ok) return null;
  return r.json();
}

export default function DataExplorer() {
  const { data, isLoading, error } = useQuery({ queryKey: ['explorer-manifest'], queryFn: fetchManifest, staleTime: 60*60*1000 });
  const [selected, setSelected] = useState<Entry | null>(null);
  const [preview, setPreview] = useState<{contentType:string; sample:string|null} | null>(null);
  const [sas, setSas] = useState<string>("");

  const rows = useMemo(() => (data ?? []).sort((a,b)=>a.path.localeCompare(b.path)), [data]);

  async function onSelect(e: Entry) {
    setSelected(e);
    setPreview(null);
    setSas("");
    const p = await fetchPreview(e.path);
    if (p) setPreview(p);
    const s = await fetchSAS(e.path);
    setSas(s.url);
  }

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Data Explorer</h1>
        <p className="text-sm text-muted-foreground">Browse <code>/data/silver</code> and <code>/data/gold</code> (read-only; preview small samples).</p>
      </header>

      {isLoading && <div>Loading manifest…</div>}
      {error && <div className="text-red-600">Failed to load manifest</div>}

      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-5 border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted"><tr>
              <th className="text-left p-2">Path</th><th className="text-right p-2">Size</th><th className="text-left p-2">Updated</th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.path} className={`cursor-pointer hover:bg-muted ${selected?.path===r.path?'bg-muted':''}`} onClick={()=>onSelect(r)}>
                  <td className="p-2 font-mono">{r.path}</td>
                  <td className="p-2 text-right">{formatBytes(r.size)}</td>
                  <td className="p-2">{r.lastModified ? new Date(r.lastModified).toLocaleString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>

        <section className="col-span-7 space-y-4">
          {!selected && <div className="text-sm text-muted-foreground">Select a file to preview.</div>}

          {selected && (
            <>
              <div className="rounded-lg border p-3 bg-card">
                <div className="text-sm"><span className="font-medium">Selected:</span> <code>{selected.path}</code></div>
                {sas && (
                  <div className="mt-2">
                    <a className="text-primary underline" href={sas} target="_blank" rel="noreferrer">Open with SAS (5 min)</a>
                  </div>
                )}
              </div>

              <div className="rounded-lg border p-3 bg-card">
                <div className="font-medium mb-2">Preview</div>
                {!preview && <div className="text-sm text-muted-foreground">No preview available for this type. Use SAS link above to download.</div>}
                {preview?.contentType === 'csv' && (
                  <pre className="text-xs overflow-auto max-h-96 whitespace-pre-wrap">{preview.sample}</pre>
                )}
                {preview?.contentType === 'json' && (
                  <pre className="text-xs overflow-auto max-h-96">{preview.sample}</pre>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function formatBytes(n: number) {
  if (n === 0) return "0 B";
  const units = ["B","KB","MB","GB","TB"]; const i = Math.floor(Math.log(n)/Math.log(1024));
  return `${(n/Math.pow(1024,i)).toFixed(1)} ${units[i]}`;
}


