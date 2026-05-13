"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Video, Lightbulb, Users, BookOpen, Rocket, Zap, LogOut, LayoutDashboard, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useClerk } from "@clerk/nextjs";
import { clerkUserToAuthUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const NAV_LINKS = [
  { label: "Discover",  href: "/discover",  icon: Sparkles },
  { label: "Connect",   href: "/connect",   icon: Video },
  { label: "Ventures",  href: "/ventures",  icon: Lightbulb },
  { label: "Experts",   href: "/experts",   icon: Users },
  { label: "Community", href: "/community", icon: BookOpen },
  { label: "Insights",  href: "/insights",  icon: Zap },
];

export function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();


  // Clerk auth state
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  // Derive GSF user from Clerk
  const user = isSignedIn && clerkUser ? clerkUserToAuthUser(clerkUser) : null;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  const navBg = scrolled
    ? "backdrop-blur-md border-b shadow-[var(--shadow-nav)]"
    : "border-b";

  // Determine dashboard link based on role stored in Clerk metadata
  const dashboardHref = user?.role === "expert" ? "/expert-dashboard" : "/dashboard";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          navBg
        )}
        style={{ backgroundColor: "var(--bg-nav)", borderBottomColor: "var(--border-default)" }}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="logo-circle group-hover:shadow-[0_0_0_3px_rgba(91,108,255,0.2)] transition-all duration-200">
                <Image
                  src="/gsf-logo.jpeg"
                  alt="GSF Logo"
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight leading-none block" style={{ color: "var(--text-primary)" }}>
                  GSF
                </span>
                <span className="text-[10px] tracking-widest uppercase font-medium leading-none hidden sm:block" style={{ color: "var(--text-muted)" }}>
                  Global Society of Founders
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    pathname === link.href
                      ? "text-primary-500 dark:text-primary-400 bg-primary-500/10 dark:bg-primary-500/20 border border-primary-500/20 dark:border-primary-500/30 shadow-[0_0_12px_rgba(91,108,255,0.1)]"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all duration-200"
                  )}
                >
                  <link.icon className="size-3.5" />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-2">
              {!isLoaded ? (
                // Loading skeleton
                <div className="size-8 rounded-full animate-pulse" style={{ backgroundColor: "var(--bg-surface-2)" }} />
              ) : isSignedIn && user ? (
                <>
                  <NotificationBell />
                  <Link
                    href={dashboardHref}
                    className="btn-ghost text-sm py-2 px-4 flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="size-3.5" />
                    Dashboard
                  </Link>
                  {/* Avatar — shows profile image from Clerk if available */}
                  {clerkUser?.imageUrl ? (
                    <Image
                      src={clerkUser.imageUrl}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="size-8 rounded-full object-cover border-2 cursor-pointer"
                      style={{ borderColor: "rgba(91,108,255,0.4)" }}
                      onClick={() => router.push(dashboardHref)}
                    />
                  ) : (
                    <div
                      className="size-8 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer"
                      style={{ background: "linear-gradient(135deg, #5B6CFF, #4FD1C5)" }}
                      title={user.name}
                      onClick={() => router.push(dashboardHref)}
                    >
                      {user.avatar}
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="btn-ghost text-sm py-2 px-3"
                    title="Log out"
                  >
                    <LogOut className="size-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost text-sm py-2 px-4">
                    Login
                  </Link>
                  <Link href="/sign-up" className="btn-primary text-sm py-2 px-5">
                    <Rocket className="size-3.5" />
                    Join Free
                  </Link>
                </>
              )}
              
              <ThemeToggle />
            </div>

            {/* Mobile header additions */}
            <div className="flex items-center gap-1 lg:hidden">
              {isSignedIn && user && <NotificationBell />}
              <button
                className="p-2 rounded-lg transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-16 z-40 backdrop-blur-md shadow-[var(--shadow-soft-md)] lg:hidden border-b"
            style={{ backgroundColor: "var(--bg-nav)", borderBottomColor: "var(--border-default)" }}
          >
            <div className="section-container py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-[var(--accent-indigo)] bg-[rgba(91,108,255,0.1)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]"
                  )}
                >
                  <link.icon className="size-4" />
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t flex flex-col gap-2" style={{ borderTopColor: "var(--border-default)" }}>
                {isSignedIn && user ? (
                  <>
                    <Link
                      href={dashboardHref}
                      onClick={() => setMobileOpen(false)}
                      className="btn-outline w-full justify-center"
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="btn-ghost w-full justify-center" style={{ color: "#EF4444" }}>
                      <LogOut className="size-4" />
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-outline w-full justify-center">
                      Login
                    </Link>
                    <Link href="/sign-up" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center">
                      <Rocket className="size-4" />
                      Join Free
                    </Link>
                  </>
                )}
                
                <div className="flex justify-center pt-2">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
