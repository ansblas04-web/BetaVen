"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname();

  const getTitle = () => {
    switch (pathname) {
      case "/feed":
        return "Feed";
      case "/standouts":
        return "Standouts";
      case "/matches":
        return "Matches";
      case "/profile":
        return "Profile";
      default:
        return "";
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-brand-light dark:bg-brand-dark border-b shadow-sm z-50">
      <div className="max-w-md mx-auto flex items-center h-16 px-4">
        {pathname !== "/feed" && (
          <button onClick={() => router.back()} className="p-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-lg font-semibold mx-auto">{getTitle()}</h1>
      </div>
    </nav>
  );
}
