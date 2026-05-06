"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ShortcutItem {
  key: string;
  description: string;
}

const shortcuts: ShortcutItem[] = [
  { key: "H", description: "Go to Home" },
  { key: "E", description: "Go to Experts" },
  { key: "V", description: "Go to Ventures" },
  { key: "C", description: "Go to Connect" },
  { key: "?", description: "Show this help menu" },
];

export default function KeyboardHelpModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "?") {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsOpen(false)}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-[#D2C4B4] dark:border-slate-700">
          <h2 className="text-lg font-semibold text-[#1A2332] dark:text-slate-100">Keyboard Shortcuts</h2>
          <button onClick={() => setIsOpen(false)} className="text-[#8A95A3] hover:text-[#1A2332]">
            <X className="size-5" />
          </button>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {shortcuts.map(({ key, description }) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm text-[#4A5668] dark:text-slate-300">{description}</span>
                <kbd className="px-2 py-1 text-xs font-mono font-semibold text-[#1A2332] dark:text-slate-100 bg-[#F3E3D0] dark:bg-slate-700 border border-[#D2C4B4] dark:border-slate-600 rounded">
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}