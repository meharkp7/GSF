"use client";

import { useUser } from "@clerk/nextjs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  const userName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Student";
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <DashboardLayout role="student" userName={userName} userEmail={userEmail}>
      {children}
    </DashboardLayout>
  );
}
