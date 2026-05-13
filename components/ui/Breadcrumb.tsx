"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const routeNames: Record<string, string> = {
  dashboard: "Dashboard",
  "expert-dashboard": "Expert Dashboard",
  connect: "Connect",
  ventures: "Ventures",
  experts: "Experts",
  community: "Community",
  profile: "Profile",
  credits: "Credits",
  students: "Students",
  sessions: "Sessions",
  investments: "Investments",
  venture: "Venture",
  progress: "Progress",
  chat: "Chat",
};

export default function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <div className="relative z-40 mt-20 w-full bg-white px-6 py-1.5 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 text-sm font-medium text-black">
        <Link href="/" className="text-gray-700 transition hover:text-blue-600">
          Home
        </Link>

        {pathSegments.map((segment, index) => {
          if (!isNaN(Number(segment))) return null;

          const href =
            "/" + pathSegments.slice(0, index + 1).join("/");

          const isLast = index === pathSegments.length - 1;

          const label =
            routeNames[segment] ||
            segment.charAt(0).toUpperCase() +
              segment.slice(1);

          return (
            <div
              key={href}
              className="flex items-center"
            >
              <ChevronRight
                size={16}
                className="mx-2 text-[#AACDDC]"
              />

              {isLast ? (
                <span className="font-medium text-[#1A2332]">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="transition hover:text-[#81A6C6]"
                >
                  {label}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}