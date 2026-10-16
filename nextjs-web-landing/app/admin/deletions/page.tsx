"use client";

import { useState } from "react";
import AdminList from "@/components/admin/AdminList";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminRequestError, adminFetch } from "@/lib/admin/client";
import { formatWhen } from "@/lib/admin/format";

type DeletionRequestRow = {
  id: string;
  userName: string;
  userEmail: string;
  userType: string;
  createdAt: string;
};

const PENDING = { status: "PENDING" };

export default function DeletionRequestsPage() {
  const [actingId, setActingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<{ item: DeletionRequestRow; refresh: () => void } | null>(null);

  const approve = async () => {
    if (!pending) return;
    try {
      setActingId(pending.item.id);
      setError(null);
      await adminFetch(`/admin/deletion-requests/${pending.item.id}/approve`, {
        method: "POST",
        body: "{}",
      });
      pending.refresh();
      setPending(null);
    } catch (err) {
      setError(err instanceof AdminRequestError ? err.message : "Could not approve this deletion request.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div>
      <h1 className="mb-3 text-xl font-semibold">Deletion requests</h1>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      <AdminList<DeletionRequestRow>
        endpoint="/admin/deletion-requests"
        dataKey="deletionRequests"
        extraParams={PENDING}
        searchPlaceholder="Search name or email"
        emptyText="No pending deletion requests"
        renderItem={(item, refresh) => (
          <AdminCard
            title={item.userName}
            subtitle={item.userEmail}
            meta={`${item.userType} · ${formatWhen(item.createdAt)}`}
          >
            <button
              type="button"
              disabled={actingId === item.id}
              onClick={() => setPending({ item, refresh })}
              className="mt-4 rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {actingId === item.id ? "Deleting…" : "Approve & delete"}
            </button>
          </AdminCard>
        )}
      />
      {pending ? (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-5">
            <h2 className="text-lg font-semibold">Approve & delete</h2>
            <p className="mt-2 text-sm text-slate-600">
              Permanently delete {pending.item.userName} ({pending.item.userEmail})? This cannot be undone.
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
                onClick={approve}
                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Approve & delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
