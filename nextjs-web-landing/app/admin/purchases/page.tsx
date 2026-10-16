"use client";

import AdminList from "@/components/admin/AdminList";
import { AdminCard } from "@/components/admin/AdminCard";
import { formatMoney, formatWhen } from "@/lib/admin/format";

type PurchaseRow = {
  id: string;
  studentName: string | null;
  studentEmail: string | null;
  subjectName: string | null;
  purchaseAmount: number;
  purchaseCurrency: string;
  purchaseDate: string;
};

export default function PurchasesPage() {
  return (
    <div>
      <h1 className="mb-3 text-xl font-semibold">Purchases</h1>
      <AdminList<PurchaseRow>
        endpoint="/api/admin/purchases"
        dataKey="purchases"
        searchPlaceholder="Search student or course"
        emptyText="No confirmed purchases"
        renderItem={(item) => (
          <AdminCard
            title={item.subjectName || "Course"}
            subtitle={`${item.studentName || "Student"} · ${item.studentEmail || ""}`}
            meta={`${formatMoney(item.purchaseAmount, item.purchaseCurrency)} · ${formatWhen(item.purchaseDate)}`}
          />
        )}
      />
    </div>
  );
}
