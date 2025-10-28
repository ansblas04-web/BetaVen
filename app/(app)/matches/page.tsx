"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/nav/BottomNav";

interface Match {
  id: string;
  user: {
    displayName: string;
    bio?: string;
    age: number;
  };
  createdAt: string;
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/matches');
      const data = await res.json();
      
      if (data.matches) {
        setMatches(data.matches);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-neutral-950 dark:to-neutral-900 p-4 pb-24">
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
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-2xl font-bold">
                    {match.user.displayName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {match.user.displayName}, {match.user.age}
                    </h3>
                    {match.user.bio && (
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
