"use client";

import { Search } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { AdminRequestError, adminFetch } from "@/lib/admin/client";

type PageResponse<T> = {
  page: number;
  pageSize: number;
  total: number;
} & Record<string, T[] | number>;

type AdminListProps<T extends { id: string }> = {
  endpoint: string;
  dataKey: string;
  searchPlaceholder: string;
  emptyText: string;
  extraParams?: Record<string, string>;
  renderItem: (item: T, refresh: () => void) => ReactNode;
};

export default function AdminList<T extends { id: string }>({
  endpoint,
  dataKey,
  searchPlaceholder,
  emptyText,
  extraParams,
  renderItem,
}: AdminListProps<T>) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const extraKey = JSON.stringify(extraParams ?? {});

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebounced(query.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({
          page: String(page),
          pageSize: "50",
          ...(JSON.parse(extraKey) as Record<string, string>),
        });
        if (debounced) params.set("q", debounced);
        const data = await adminFetch<PageResponse<T>>(`${endpoint}?${params.toString()}`);
        if (!active) return;
        const rows = data[dataKey];
        setItems(Array.isArray(rows) ? rows : []);
        setTotal(data.total || 0);
        setPageSize(data.pageSize || 50);
      } catch (err) {
        if (!active) return;
        if (err instanceof AdminRequestError && err.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load");
        setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [dataKey, debounced, endpoint, extraKey, page, reloadKey]);

  const refresh = () => setReloadKey((value) => value + 1);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <p className="text-sm text-slate-500">{total} total</p>
      <label className="mt-3 flex items-center gap-2 rounded-xl border border-[#E8EEF4] bg-white px-3 py-2.5">
        <Search size={16} className="text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-sm outline-none"
          autoCapitalize="none"
        />
      </label>
      {loading ? (
        <p className="py-16 text-center text-sm text-slate-500">Loading…</p>
      ) : error ? (
        <p className="py-16 text-center text-sm text-red-600">{error}</p>
      ) : items.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-500">{emptyText}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id}>{renderItem(item, refresh)}</div>
          ))}
        </div>
      )}
      {pageCount > 1 ? (
        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="rounded-lg border border-[#E8EEF4] bg-white px-3 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-slate-500">
            Page {page} of {pageCount}
          </span>
          <button
            type="button"
            disabled={page >= pageCount}
            onClick={() => setPage((value) => value + 1)}
            className="rounded-lg border border-[#E8EEF4] bg-white px-3 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
