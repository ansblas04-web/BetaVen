"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/nav/BottomNav";

interface Notification {
  id: string;
  type: "match" | "message";
  title: string;
  description: string;
  createdAt: string;
}

export default function NotificationsPage() {
  // Mock data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "match",
      title: "New Match!",
      description: "You matched with Alice",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      type: "message",
      title: "New Message",
      description: "Bob: Hey, how are you?",
      createdAt: new Date().toISOString(),
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-neutral-950 dark:to-neutral-900 p-4 pt-16 pb-24">
      <div className="max-w-2xl mx-auto pt-8">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-center">No new notifications</p>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {notification.type === "match" ? "💖" : "💬"}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}
