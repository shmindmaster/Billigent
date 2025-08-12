import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, FileText, Filter, RefreshCw, Search, Table } from 'lucide-react';

// Simple fetcher
async function api<T>(path: string): Promise<T> {
  const res = await fetch(`/api/explorer/${path}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

interface ManifestItem {
  path: string;
  size: number;
  lastModified: string | null;
  contentType: string | null;
}

export default function DataExplorer() {
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<ManifestItem | null>(null);
  const [preview, setPreview] = useState<{ contentType: string; sample: string | null } | null>(null);
  
  const { data, isLoading, refetch, isFetching } = useQuery<ManifestItem[]>({
    queryKey: ['explorer-manifest'],
    queryFn: () => api<ManifestItem[]>('manifest'),
    staleTime: 60 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    const items = data || [];
    if (!q.trim()) return items;
    const t = q.toLowerCase();
    return items.filter(i => i.path.toLowerCase().includes(t));
  }, [data, q]);

  useEffect(() => {
    if (!selected) return;
    (async () => {
      try {
        const r = await fetch(`/api/explorer/preview?path=${encodeURIComponent(selected.path)}`);
        if (r.ok) {
          const j = await r.json();
          setPreview(j);
        } else {
          setPreview(null);
        }
      } catch {
        setPreview(null);
      }
    })();
  }, [selected]);

  const isFolderLike = (p: string) => !/\.[^/.]+$/.test(p);

  const handleDownload = async (item: ManifestItem) => {
    if (isFolderLike(item.path)) return; // no download for folders
    const j = await api<{ url: string; ttlSeconds: number }>(`file?path=${encodeURIComponent(item.path)}`);
    window.open(j.url, '_blank');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Data Explorer</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-3 py-2 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Refresh data"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter by path…"
            className="w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by path"
          />
        </div>
        <div className="hidden md:flex items-center text-sm text-gray-500" aria-hidden="true">
          <Filter className="w-4 h-4 mr-1" /> {filtered?.length || 0} items
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-gray-500">Loading manifest…</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* List */}
          <div className="lg:col-span-2 border rounded-md overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 text-xs font-semibold px-3 py-2">
              <div className="col-span-7">Path</div>
              <div className="col-span-2 text-right">Size</div>
              <div className="col-span-3">Modified</div>
            </div>
            <ul role="list" className="divide-y max-h-[60vh] overflow-auto">
              {filtered.map((item) => (
                <li key={item.path} className={`grid grid-cols-12 items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${selected?.path === item.path ? 'bg-blue-50' : ''}`}
                    tabIndex={0}
                    onClick={() => setSelected(item)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelected(item); }}
                    aria-selected={selected?.path === item.path}
                    role="listitem"
                >
                  <div className="col-span-7 truncate" title={item.path}><FileText className="inline w-4 h-4 mr-2 text-gray-400" />{item.path}</div>
                  <div className="col-span-2 text-right tabular-nums">{Intl.NumberFormat().format(item.size)}</div>
                  <div className="col-span-3 text-xs text-gray-500">{item.lastModified ? new Date(item.lastModified).toLocaleString() : '-'}</div>
                </li>
              ))}
              {!filtered.length && (
                <li className="px-3 py-8 text-center text-sm text-gray-500">No results</li>
              )}
            </ul>
          </div>

          {/* Details */}
          <div className="border rounded-md p-3">
            <h2 className="text-sm font-semibold mb-2 flex items-center"><Table className="w-4 h-4 mr-2" /> Details</h2>
            {selected ? (
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Path</div>
                  <div className="text-sm break-all">{selected.path}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">Size</div>
                    <div className="tabular-nums">{Intl.NumberFormat().format(selected.size)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Modified</div>
                    <div>{selected.lastModified ? new Date(selected.lastModified).toLocaleString() : '-'}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Content Type</div>
                  <div className="text-sm">{selected.contentType || 'unknown'}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(selected)}
                    disabled={isFolderLike(selected.path)}
                    aria-disabled={isFolderLike(selected.path)}
                    className="inline-flex items-center px-3 py-2 rounded-md text-sm bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download
                  </button>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Preview</div>
                  {!preview && <div className="text-sm text-gray-500">Select a JSON/CSV to preview first lines.</div>}
                  {preview && (
                    preview.sample ? (
                      <pre className="bg-black text-green-200 text-xs p-2 rounded max-h-64 overflow-auto" aria-label="File preview"><code>{preview.sample}</code></pre>
                    ) : (
                      <div className="text-sm text-gray-500">Preview not available for this type.</div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Select a dataset to see details and preview.</div>
            )}
          </div>
        </div>
      )}

      {isFetching && <div className="mt-2 text-xs text-gray-500">Refreshing…</div>}
    </div>
  );
}
