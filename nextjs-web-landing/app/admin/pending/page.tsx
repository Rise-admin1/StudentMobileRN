"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AdminRequestError, adminFetch } from "@/lib/admin/client";
import { formatMinorAed } from "@/lib/admin/format";

type PendingSubject = {
  id: string;
  subjectName?: string | null;
  subjectBoard?: string | null;
  subjectGrade?: number | null;
  subjectPrice?: number | null;
  createdAt?: string | null;
};

export default function PendingVerificationPage() {
  const [subjects, setSubjects] = useState<PendingSubject[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    adminFetch<PendingSubject[]>("/api/subjects/verify")
      .then((data) => {
        if (active) setSubjects(Array.isArray(data) ? data : []);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof AdminRequestError && err.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to fetch subjects");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return subjects;
    return subjects.filter((subject) =>
      `${subject.subjectName ?? ""} ${subject.subjectBoard ?? ""}`.toLowerCase().includes(needle)
    );
  }, [query, subjects]);

  return (
    <div>
      <h1 className="text-xl font-semibold">Pending verification</h1>
      <p className="mt-1 text-sm text-slate-500">{subjects.length} waiting</p>
      <label className="mt-4 flex items-center gap-2 rounded-xl border border-[#E8EEF4] bg-white px-3 py-2.5">
        <Search size={16} className="text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search subjects"
          className="w-full bg-transparent text-sm outline-none"
        />
      </label>
      {loading ? <p className="py-16 text-center text-sm text-slate-500">Loading subjects…</p> : null}
      {error ? <p className="py-16 text-center text-sm text-red-600">{error}</p> : null}
      {!loading && !error && visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-500">No subjects pending verification</p>
      ) : null}
      <div className="mt-4 space-y-3">
        {visible.map((subject) => (
          <Link
            key={subject.id}
            href={`/admin/subjects/${subject.id}`}
            className="block rounded-2xl border border-[#E8EEF4] bg-white p-4"
          >
            <p className="font-semibold">{subject.subjectName || "Untitled subject"}</p>
            <p className="mt-1 text-sm text-slate-500">
              {subject.subjectBoard || "No board"}
              {subject.subjectGrade != null ? ` · Grade ${subject.subjectGrade}` : ""}
              {subject.subjectPrice != null ? ` · ${formatMinorAed(subject.subjectPrice)}` : ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
