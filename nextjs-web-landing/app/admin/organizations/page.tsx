"use client";

import AdminList from "@/components/admin/AdminList";
import { AdminCard } from "@/components/admin/AdminCard";

type OrgRow = {
  id: string;
  orgName: string;
  orgEmail: string | null;
  orgWebsite: string | null;
  orgCapacity: number;
  memberCount: number;
  teamLeadName: string | null;
  teamLeadEmail: string | null;
};

export default function OrganizationsPage() {
  return (
    <div>
      <h1 className="mb-3 text-xl font-semibold">Organizations</h1>
      <AdminList<OrgRow>
        endpoint="/api/admin-proxy/admin/organizations"
        dataKey="organizations"
        searchPlaceholder="Search organizations"
        emptyText="No organizations found"
        renderItem={(item) => (
          <AdminCard
            title={item.orgName}
            subtitle={item.orgEmail || item.teamLeadEmail}
            meta={`Lead: ${item.teamLeadName || "—"} · ${item.memberCount}/${item.orgCapacity} members${item.orgWebsite ? ` · ${item.orgWebsite}` : ""}`}
          />
        )}
      />
    </div>
  );
}
