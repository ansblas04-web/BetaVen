"use client";

import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { Star } from "lucide-react";

export function Settings() {
  const { data: session } = useSession();

  return (
    <div className="space-y-4">
      <Button variant="outline" className="w-full">Edit Profile</Button>
      <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
        <Star className="w-4 h-4 mr-2" />
        Go Premium
      </Button>
      <Button
        onClick={() => signOut({ callbackUrl: '/signin' })}
        variant="outline"
        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
      >
        Sign Out
      </Button>
    </div>
  );
}
