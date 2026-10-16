import type { ReactNode } from "react";

export function AdminCard({
  title,
  subtitle,
  meta,
  children,
}: {
  title: string;
  subtitle?: string | null;
  meta?: string | null;
  children?: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-[#E8EEF4] bg-white p-4">
      <h2 className="text-base font-semibold text-[#1A2B4B]">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
      {meta ? <p className="mt-1 text-sm text-slate-500">{meta}</p> : null}
      {children}
    </article>
  );
}
