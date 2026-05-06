"use client";

import { useUser } from "@clerk/nextjs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  const userName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Admin";
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <DashboardLayout role="admin" userName={userName} userEmail={userEmail}>
      {children}
    </DashboardLayout>
  );
}
