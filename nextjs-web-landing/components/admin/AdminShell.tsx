"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { API_BASE_URL } from "@/lib/constants";
import { clearAdminSession, getAdminEmail, getAdminToken } from "@/lib/admin/token";
import {
  Building2,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Trash2,
  Undo2,
  Users,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/pending", label: "Pending verification", icon: ShieldCheck, exact: false },
  { href: "/admin/teachers", label: "Teachers", icon: GraduationCap, exact: false },
  { href: "/admin/organizations", label: "Organizations", icon: Building2, exact: false },
  { href: "/admin/parents", label: "Parents", icon: Users, exact: false },
  { href: "/admin/purchases", label: "Purchases", icon: CreditCard, exact: false },
  { href: "/admin/refunds", label: "Refund requests", icon: Undo2, exact: false },
  { href: "/admin/deletions", label: "Deletion requests", icon: Trash2, exact: false },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [ready, setReady] = useState(isLogin);
  const [email, setEmail] = useState<string | null>(null);
  const [gateError, setGateError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const token = getAdminToken();
        if (!token) {
          if (!isLogin) router.replace("/admin/login");
          else setReady(true);
          return;
        }
        const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          cache: "no-store",
        });
        if (!active) return;
        if (response.ok) {
          if (isLogin) {
            router.replace("/admin");
            return;
          }
          setEmail(getAdminEmail());
          setReady(true);
          return;
        }
        if (response.status === 401 || response.status === 403) {
          clearAdminSession();
          if (!isLogin) router.replace("/admin/login");
          else setReady(true);
          return;
        }
        setGateError("Could not reach the admin service.");
        setReady(true);
      } catch {
        if (!active) return;
        setGateError("Could not reach the admin service.");
        setReady(true);
      }
    };
    check();
    return () => {
      active = false;
    };
  }, [isLogin, router]);

  const logout = async () => {
    clearAdminSession();
    router.replace("/admin/login");
  };

  if (isLogin) {
    return <div className="min-h-screen bg-[#F4F6F8]">{ready ? children : null}</div>;
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center text-sm text-slate-500">
        Checking admin session…
      </div>
    );
  }

  if (gateError) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center px-6">
        <p className="text-sm text-red-600">{gateError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#1A2B4B] md:grid md:grid-cols-[240px_1fr]">
      <aside className="bg-[#1A2B4B] text-white md:min-h-screen">
        <div className="px-5 py-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Coach Academ</p>
          <p className="mt-1 text-xl font-semibold">Admin</p>
          {email ? <p className="mt-2 truncate text-xs text-slate-300">{email}</p> : null}
        </div>
        <nav className="flex gap-2 overflow-x-auto px-3 pb-4 md:block md:space-y-1 md:px-3">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  active ? "bg-white text-[#1A2B4B]" : "text-slate-200 hover:bg-white/10"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden px-3 pb-5 md:block">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="flex items-center justify-end border-b border-[#E8EEF4] bg-white px-4 py-3 md:hidden">
          <button type="button" onClick={logout} className="text-sm font-medium text-[#1A2B4B]">
            Log out
          </button>
        </div>
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">{children}</div>
      </div>
    </div>
  );
}
