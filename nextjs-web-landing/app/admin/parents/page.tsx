"use client";

import AdminList from "@/components/admin/AdminList";
import { AdminCard } from "@/components/admin/AdminCard";

type ParentRow = {
  id: string;
  name: string;
  email: string;
  acceptedLinks: number;
  pendingLinks: number;
};

export default function ParentsPage() {
  return (
    <div>
      <h1 className="mb-3 text-xl font-semibold">Parents</h1>
      <AdminList<ParentRow>
        endpoint="/api/admin-proxy/admin/parents"
        dataKey="parents"
        searchPlaceholder="Search parents"
        emptyText="No parents found"
        renderItem={(item) => (
          <AdminCard
            title={item.name}
            subtitle={item.email}
            meta={`${item.acceptedLinks} linked students · ${item.pendingLinks} pending invites`}
          />
        )}
      />
    </div>
  );
}
