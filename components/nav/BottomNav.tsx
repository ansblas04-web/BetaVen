"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FeedIcon from "@/components/icons/FeedIcon";
import StandoutsIcon from "@/components/icons/StandoutsIcon";
import MatchesIcon from "@/components/icons/MatchesIcon";
import ProfileIcon from "@/components/icons/ProfileIcon";

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/feed", label: "Feed", icon: <FeedIcon /> },
    { href: "/standouts", label: "Standouts", icon: <StandoutsIcon /> },
    { href: "/matches", label: "Matches", icon: <MatchesIcon /> },
    { href: "/profile", label: "Profile", icon: <ProfileIcon /> },
  ];

  const handleNavClick = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(200);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-brand-light dark:bg-brand-dark border-t shadow-lg z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? "text-brand-primary dark:text-brand-primary animate-pulse"
                  : "text-gray-600 dark:text-gray-400 hover:text-brand-primary"
              }`}
            >
              <div className="w-6 h-6 mb-1">{link.icon}</div>
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
