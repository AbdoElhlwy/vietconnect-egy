"use client";

import { useEffect, useMemo, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";

type Result = { category: string; id: string; title: string; subtitle: string };

const CATEGORY_LABELS: Record<string, string> = {
  services: "الخدمات",
  news: "الأخبار",
  directory: "الدليل",
  universities: "الجامعات",
  companies: "الشركات",
  faq: "الأسئلة الشائعة",
  events: "الفعاليات"
};

const RECENT_KEY = "vietconnect_recent_searches";

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-vn-gold/40 text-diplomatic-navy rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) setRecent(JSON.parse(stored));
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (debounced.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debounced)}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(data.results ?? []);
        setRecent((prev) => {
          const next = [debounced, ...prev.filter((r) => r !== debounced)].slice(0, 6);
          try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
          return next;
        });
      })
      .finally(() => setLoading(false));
  }, [debounced]);

  const grouped = useMemo(() => {
    const map = new Map<string, Result[]>();
    for (const r of results) {
      if (!map.has(r.category)) map.set(r.category, []);
      map.get(r.category)!.push(r);
    }
    return map;
  }, [results]);

  return (
    <div>
      <div className="relative">
        <SearchIcon size={18} className="absolute top-1/2 -translate-y-1/2 start-3 text-diplomatic-navy/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث..."
          className="w-full rounded-full border border-diplomatic-slate/30 ps-10 pe-10 py-2.5 text-sm"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute top-1/2 -translate-y-1/2 end-3 text-diplomatic-navy/40" aria-label="Clear">
            <X size={16} />
          </button>
        )}
      </div>

      {!debounced && recent.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-diplomatic-navy/50">عمليات بحث سابقة:</span>
          {recent.map((r) => (
            <button key={r} onClick={() => setQuery(r)} className="text-xs rounded-full bg-diplomatic-fog px-3 py-1 text-diplomatic-navy">
              {r}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-6">
        {loading && <p className="text-sm text-diplomatic-navy/50">جارٍ البحث...</p>}

        {!loading && debounced.length >= 2 && results.length === 0 && (
          <p className="text-sm text-diplomatic-navy/50">لا توجد نتائج مطابقة لـ &quot;{debounced}&quot;.</p>
        )}

        {Array.from(grouped.entries()).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-xs font-bold uppercase tracking-wide text-diplomatic-navy/50 mb-2">
              {CATEGORY_LABELS[category] ?? category}
            </h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="card-diplomatic py-3">
                  <p className="text-sm font-semibold">{highlight(item.title, debounced)}</p>
                  {item.subtitle && <p className="text-xs text-diplomatic-navy/50 mt-0.5">{item.subtitle}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
