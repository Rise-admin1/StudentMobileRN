"use client";

import { useState } from "react";
import AdminList from "@/components/admin/AdminList";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminRequestError, adminFetch } from "@/lib/admin/client";

type RefundRequestRow = {
  id: string;
  reason: string;
  classStartsAtLabel: string;
  studentName: string | null;
  studentEmail: string | null;
  subjectName: string | null;
  courseType: string | null;
  purchaseAmountLabel: string;
};

const PENDING = { status: "PENDING" };

export default function RefundsPage() {
  const [actingId, setActingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<{
    item: RefundRequestRow;
    action: "accept" | "decline";
    refresh: () => void;
  } | null>(null);

  const decide = async () => {
    if (!pending) return;
    try {
      setActingId(pending.item.id);
      setError(null);
      await adminFetch(`/admin/refund-requests/${pending.item.id}/${pending.action}`, {
        method: "POST",
        body: "{}",
      });
      pending.refresh();
      setPending(null);
    } catch (err) {
      const message =
        err instanceof AdminRequestError
          ? err.message
          : `Could not ${pending.action} this refund request.`;
      setError(message);
    } finally {
      setActingId(null);
    }
  };

  return (
    <div>
      <h1 className="mb-3 text-xl font-semibold">Refund requests</h1>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      <AdminList<RefundRequestRow>
        endpoint="/admin/refund-requests"
        dataKey="refundRequests"
        extraParams={PENDING}
        searchPlaceholder="Search student, course, or reason"
        emptyText="No pending refund requests"
        renderItem={(item, refresh) => (
          <AdminCard
            title={item.subjectName || "Course"}
            subtitle={`${item.studentName || "Student"} · ${item.studentEmail || ""}`}
            meta={`${item.purchaseAmountLabel} · ${item.courseType || "Course"}`}
          >
            <p className="mt-2 text-sm text-slate-500">Class: {item.classStartsAtLabel || "—"}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Reason</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{item.reason}</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                disabled={actingId === item.id}
                onClick={() => setPending({ item, action: "decline", refresh })}
                className="rounded-lg border border-[#E8EEF4] px-3 py-2 text-sm font-medium disabled:opacity-50"
              >
                Decline
              </button>
              <button
                type="button"
                disabled={actingId === item.id}
                onClick={() => setPending({ item, action: "accept", refresh })}
                className="rounded-lg bg-[#1A2B4B] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {actingId === item.id ? "Working…" : "Accept"}
              </button>
            </div>
          </AdminCard>
        )}
      />
      {pending ? (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-5">
            <h2 className="text-lg font-semibold">
              {pending.action === "accept" ? "Accept refund" : "Decline refund"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {pending.action === "accept"
                ? `Accept the refund for ${pending.item.subjectName || "this course"}? Stripe will refund the student and the class will be cancelled.`
                : `Decline the refund for ${pending.item.subjectName || "this course"}? The class stays booked.`}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={actingId !== null}
                onClick={() => setPending(null)}
                className="rounded-lg px-4 py-2 text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actingId !== null}
                onClick={decide}
                className="rounded-lg bg-[#1A2B4B] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {pending.action === "accept" ? "Accept" : "Decline"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
