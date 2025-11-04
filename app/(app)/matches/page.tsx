"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/nav/BottomNav";
import NoMatches from "@/components/illustrations/NoMatches";

interface Match {
  id: string;
  user: {
    displayName: string;
    bio?: string;
    age: number;
  };
  createdAt: string;
  status: "new" | "unread" | "expiring";
  lastMessage?: string;
  lastMessageAt?: string;
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    // Mock data for demonstration
    const mockMatches: Match[] = [
      {
        id: "1",
        user: { displayName: "Alice", age: 28, bio: "Looking for something real" },
        createdAt: new Date().toISOString(),
        status: "new",
      },
      {
        id: "2",
        user: { displayName: "Bob", age: 32, bio: "Let's go on an adventure" },
        createdAt: new Date().toISOString(),
        status: "unread",
        lastMessage: "Hey, how are you?",
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: "3",
        user: { displayName: "Charlie", age: 25, bio: "Just a small town girl" },
        createdAt: new Date().toISOString(),
        status: "expiring",
        lastMessage: "Are you free tonight?",
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ];
    setMatches(mockMatches);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-green-500";
      case "unread":
        return "bg-blue-500";
      case "expiring":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-neutral-950 dark:to-neutral-900 p-4 pt-16 pb-24">
      <div className="max-w-2xl mx-auto pt-8">
        <h1 className="text-3xl font-bold mb-6">Your Matches</h1>

        {loading ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Loading matches...</p>
            </CardContent>
          </Card>
        ) : matches.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <NoMatches className="mx-auto mb-4" />
              <p className="text-muted-foreground">
                No matches yet. Keep swiping!
              </p>
              <Button onClick={() => router.push("/feed")} className="mt-4">
                Go to Feed
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <Card
                key={match.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/matches/${match.id}`)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={`w-2 h-16 rounded-full ${getStatusColor(match.status)}`}></div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-2xl font-bold">
                    {match.user.displayName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-lg">
                        {match.user.displayName}, {match.user.age}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(match.lastMessageAt)}
                      </p>
                    </div>
                    {match.lastMessage ? (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {match.lastMessage}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {match.user.bio}
                      </p>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    Message
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
