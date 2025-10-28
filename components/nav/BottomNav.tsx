"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/feed", label: "Feed", icon: "🔥" },
    { href: "/standouts", label: "Standouts", icon: "⭐" },
    { href: "/matches", label: "Matches", icon: "💬" },
    { href: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t shadow-lg z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? "text-pink-600 dark:text-pink-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-pink-500"
              }`}
            >
              <span className="text-2xl mb-1">{link.icon}</span>
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
