"use client";

import { useRouter } from "next/navigation";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import KeyboardHelpModal from "@/components/ui/KeyboardHelpModal";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useKeyboardShortcuts([
    { key: "h", action: () => router.push("/"), description: "Go to Home" },
    { key: "e", action: () => router.push("/experts"), description: "Go to Experts" },
    { key: "v", action: () => router.push("/ventures"), description: "Go to Ventures" },
    { key: "c", action: () => router.push("/connect"), description: "Go to Connect" },
  ]);

  return (
    <>
      {children}
      <KeyboardHelpModal />
    </>
  );
}