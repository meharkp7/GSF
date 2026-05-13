"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUser, useClerk } from "@clerk/nextjs";
import { clerkUserToAuthUser } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";
import { NotificationBell } from "@/components/ui/NotificationBell";
import {
  LayoutDashboard, Lightbulb, TrendingUp, Users, MessageSquare,
  Coins, User, Menu, X, Briefcase, Calendar, Star, LogOut,
  ChevronRight, Bell,
} from "lucide-react";

// ===== SIDEBAR CONFIGS per role =====
const FOUNDER_LINKS = [
  { label: "Dashboard",        href: "/dashboard",                    icon: LayoutDashboard },
  { label: "My Venture",       href: "/dashboard/venture",            icon: Lightbulb },
  { label: "Progress Tracker", href: "/dashboard/progress",           icon: TrendingUp },
  { label: "Experts",          href: "/dashboard/experts",            icon: Users },
  { label: "Chat",             href: "/dashboard/chat",               icon: MessageSquare },
  { label: "Community",        href: "/community",                    icon: Star },
  { label: "Credits",          href: "/dashboard/credits",            icon: Coins },
  { label: "Profile",          href: "/dashboard/profile",            icon: User },
];

const EXPERT_LINKS = [
  { label: "Dashboard",          href: "/expert-dashboard",                icon: LayoutDashboard },
  { label: "Sessions",           href: "/expert-dashboard/sessions",       icon: Calendar },
  { label: "My Founders",        href: "/expert-dashboard/students",       icon: Users },
  { label: "Browse Ventures",    href: "/expert-dashboard/ventures",       icon: Lightbulb },
  { label: "My Contributions",   href: "/expert-dashboard/investments",    icon: TrendingUp },
  { label: "Chat",               href: "/expert-dashboard/chat",           icon: MessageSquare },
  { label: "Credits Earned",     href: "/expert-dashboard/credits",        icon: Coins },
  { label: "Profile",            href: "/expert-dashboard/profile",        icon: User },
];

interface DashboardShellProps {
  children: React.ReactNode;
  role: "founder" | "expert";
}

export function DashboardShell({ children, role }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [notifCount, setNotifCount]   = useState(3);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotificationsList(data);
        setNotifCount(data.filter((n: any) => n.status !== "read").length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH", body: JSON.stringify({ status: "read" }) });
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", { method: "POST" });
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };
  
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  const user = clerkUser ? clerkUserToAuthUser(clerkUser) : null;

  const links = role === "founder" ? FOUNDER_LINKS : EXPERT_LINKS;

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.replace("/login");
      } else if (user.role !== role) {
        router.replace(role === "founder" ? "/expert-dashboard" : "/dashboard");
      }
      setMobileOpen(false);
    }
  }, [isLoaded, user, role, router, pathname]);

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b" style={{ borderBottomColor: "var(--border-default)" }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="size-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: "linear-gradient(135deg, #5B6CFF, #4FD1C5)",
              color: "white",
            }}
          >
            G
          </div>
          {sidebarOpen && (
            <div>
              <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>GSF</div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                {role === "founder" ? "Founder Portal" : "Expert Portal"}
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                isActive ? "sidebar-link-active" : "sidebar-link",
                !sidebarOpen && "justify-center px-2"
              )}
              title={!sidebarOpen ? link.label : undefined}
            >
              <link.icon className="size-4 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1">{link.label}</span>
                  {isActive && <ChevronRight className="size-3 ml-auto" />}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      {user && (
        <div className="p-3 border-t" style={{ borderTopColor: "var(--border-default)" }}>
          <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}>
            <div
              className="size-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #5B6CFF, #4FD1C5)" }}
            >
              {user.avatar}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                  {user.name}
                </p>
                <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
                  {user.plan}
                </p>
              </div>
            )}
            {sidebarOpen && (
              <button onClick={handleLogout} className="p-1 rounded-lg hover:bg-red-50 transition-colors" title="Log out">
                <LogOut className="size-3.5 text-red-400" />
              </button>
            )}
          </div>
          {/* Credit display */}
          {sidebarOpen && (
            <div className="mt-3 p-2 rounded-xl" style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-default)" }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  {role === "founder" ? "Credits" : "Earned"}
                </span>
                <span className="text-xs font-bold" style={{ color: "var(--accent-indigo)" }}>
                  {user.credits}
                </span>
              </div>
              <div className="progress-bar" style={{ height: "3px" }}>
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(100, (user.credits / (role === "founder" ? 600 : 500)) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (!isLoaded || !user) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: "var(--bg-canvas)" }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="size-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--border-default)", borderTopColor: "var(--accent-indigo)" }}
          />
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--bg-canvas)" }}>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 220 : 64 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex flex-col flex-shrink-0 border-r relative"
        style={{
          backgroundColor: "var(--bg-sidebar)",
          borderRightColor: "var(--border-default)",
        }}
      >
        {sidebarContent}

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-[72px] size-6 rounded-full flex items-center justify-center shadow-md border z-10 transition-colors"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-default)",
            color: "var(--text-muted)",
          }}
        >
          <motion.div animate={{ rotate: sidebarOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="size-3" />
          </motion.div>
        </button>
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -220 }}
              animate={{ x: 0 }}
              exit={{ x: -220 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[220px] border-r md:hidden"
              style={{
                backgroundColor: "var(--bg-sidebar)",
                borderRightColor: "var(--border-default)",
              }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="h-14 flex items-center gap-3 px-4 border-b flex-shrink-0"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderBottomColor: "var(--border-default)",
          }}
        >
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            <Menu className="size-5" />
          </button>

          <div className="flex-1" />

          {/* Right side: notifications + user */}
          <div className="relative">
            <button onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) fetchNotifications(); }} className="relative p-2 rounded-xl transition-colors" style={{ color: "var(--text-muted)" }}>
              <Bell className="size-4" />
              {notifCount > 0 && (
                <span
                  className="absolute top-1 right-1 size-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                  style={{ backgroundColor: "#EF4444" }}
                >
                  {notifCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50" style={{ borderColor: "var(--border-default)" }}>
                <div className="p-3 border-b flex items-center justify-between" style={{ borderBottomColor: "var(--border-default)" }}>
                  <strong className="text-sm">Notifications</strong>
                  <button className="text-xs text-blue-600" onClick={async () => { await markAllRead(); await fetchNotifications(); }}>Mark all read</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notificationsList.length === 0 && <div className="p-3 text-sm text-muted">No notifications</div>}
                  {notificationsList.map((n) => (
                    <div key={n.id} onClick={async () => { await markRead(n.id); if (n.payload?.url) window.location.href = n.payload.url; }} className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${n.status !== 'read' ? 'bg-white' : 'bg-gray-50'}`} style={{ borderBottomColor: 'var(--border-default)' }}>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{n.type}</div>
                        <div className="text-[10px] text-muted">{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="text-xs text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>{n.payload?.message ?? JSON.stringify(n.payload ?? {})}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {user && (
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{user.name}</p>
                <p className="text-[10px] capitalize" style={{ color: "var(--text-muted)" }}>{user.role}</p>
              </div>
              <div
                className="size-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #5B6CFF, #4FD1C5)" }}
              >
                {user.avatar}
              </div>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
