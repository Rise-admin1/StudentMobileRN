"use client";

import AdminList from "@/components/admin/AdminList";
import { AdminCard } from "@/components/admin/AdminCard";

type TeacherRow = {
  id: string;
  name: string;
  email: string;
  organizationName: string | null;
  organizationRole: string | null;
  verifiedSubjects: number;
  pendingSubjects: number;
  rejectedSubjects: number;
};

export default function TeachersPage() {
  return (
    <div>
      <h1 className="mb-3 text-xl font-semibold">Teachers</h1>
      <AdminList<TeacherRow>
        endpoint="/admin/teachers"
        dataKey="teachers"
        searchPlaceholder="Search teachers"
        emptyText="No teachers found"
        renderItem={(item) => (
          <AdminCard
            title={item.name}
            subtitle={item.email}
            meta={`${item.organizationName || "Independent"}${item.organizationRole ? ` · ${item.organizationRole}` : ""} · ${item.verifiedSubjects} verified, ${item.pendingSubjects} pending, ${item.rejectedSubjects} rejected`}
          />
        )}
      />
    </div>
  );
}
