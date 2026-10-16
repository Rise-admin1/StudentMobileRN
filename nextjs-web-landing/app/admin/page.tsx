"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminRequestError, adminFetch } from "@/lib/admin/client";
import { formatMinorAed } from "@/lib/admin/format";

type AdminStats = {
  teachers: number;
  students: number;
  parents: number;
  organizations: number;
  pendingSubjects: number;
  confirmedPurchases: number;
  pendingRefundRequests: number;
  pendingDeletionRequests: number;
  totalSpendMinor: number;
};

const LINKS = [
  { href: "/admin/pending", label: "Pending verification", hintKey: "pendingSubjects" as const, suffix: "waiting" },
  { href: "/admin/teachers", label: "Teachers", hint: "Directory" },
  { href: "/admin/organizations", label: "Organizations", hint: "Student orgs" },
  { href: "/admin/parents", label: "Parents", hint: "Linked families" },
  { href: "/admin/purchases", label: "Purchases", hint: "Courses and spend" },
  { href: "/admin/refunds", label: "Refund requests", hintKey: "pendingRefundRequests" as const, suffix: "pending" },
  { href: "/admin/deletions", label: "Deletion requests", hintKey: "pendingDeletionRequests" as const, suffix: "pending" },
];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    adminFetch<AdminStats>("/api/admin/stats")
      .then((data) => {
        if (active) setStats(data);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof AdminRequestError && err.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load admin stats");
      });
    return () => {
      active = false;
    };
  }, []);

  const cards = [
    { label: "Pending verification", value: stats?.pendingSubjects ?? 0 },
    { label: "Teachers", value: stats?.teachers ?? 0 },
    { label: "Organizations", value: stats?.organizations ?? 0 },
    { label: "Parents", value: stats?.parents ?? 0 },
    { label: "Students", value: stats?.students ?? 0 },
    { label: "Courses bought", value: stats?.confirmedPurchases ?? 0 },
  ];

  return (
    <div>
      <p className="text-sm text-slate-500">{formatMinorAed(stats?.totalSpendMinor || 0)} spent by students</p>
      {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}
      {!stats && !error ? <p className="mt-6 text-sm text-slate-500">Loading…</p> : null}
      {stats ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {cards.map((card) => (
              <div key={card.label} className="rounded-2xl border border-[#E8EEF4] bg-white p-4">
                <p className="text-2xl font-semibold">{card.value}</p>
                <p className="mt-1 text-xs text-slate-500">{card.label}</p>
              </div>
            ))}
          </div>
          <h2 className="mt-8 text-base font-semibold">Browse</h2>
          <div className="mt-3 space-y-2">
            {LINKS.map((link) => {
              const hint =
                "hint" in link && link.hint
                  ? link.hint
                  : `${stats[link.hintKey!] ?? 0} ${link.suffix}`;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-2xl border border-[#E8EEF4] bg-white px-4 py-3"
                >
                  <span>
                    <span className="block text-sm font-semibold">{link.label}</span>
                    <span className="block text-xs text-slate-500">{hint}</span>
                  </span>
                  <span className="text-slate-400">›</span>
                </Link>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
