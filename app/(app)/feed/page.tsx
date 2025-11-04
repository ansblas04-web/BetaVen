"use client";

import { useState, useEffect } from "react";
import { EnhancedSwipeCard } from "@/components/feed/EnhancedSwipeCard";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/nav/BottomNav";
import { Loader2, Star, Undo2 } from "lucide-react";

export default function FeedPage() {
  const [candidates, setCandidates] = useState<any[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastSwiped, setLastSwiped] = useState<any>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const [hasActiveBoost, setHasActiveBoost] = useState(false);
  const [boostTimeLeft, setBoostTimeLeft] = useState(0);
  const [superLikesLeft, setSuperLikesLeft] = useState(5); // Add this state

  useEffect(() => {
    fetchProfiles();
    checkBoostStatus();
    // TODO: Fetch super a likes left
    const interval = setInterval(checkBoostStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkBoostStatus = async () => {
    try {
      const res = await fetch('/api/boost');
      const data = await res.json();
      
      if (data.isActive && data.boost) {
        const timeLeft = new Date(data.boost.expiresAt).getTime() - Date.now();
        setHasActiveBoost(timeLeft > 0);
        setBoostTimeLeft(Math.max(0, Math.floor(timeLeft / 60000)));
      } else {
        setHasActiveBoost(false);
      }
    } catch (error) {
      console.error('Error checking boost:', error);
    }
  };

  const activateBoost = async () => {
    try {
      const res = await fetch('/api/boost', { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        checkBoostStatus();
        alert('Boost activated! 30 minutes of increased visibility.');
      } else {
        alert(data.error || 'Failed to activate boost');
      }
    } catch (error) {
      alert('Failed to activate boost');
    }
  };

  const fetchProfiles = async () => {
    try {
      const res = await fetch('/api/feed');

      if (res.status === 401) {
        // Not logged in
        window.location.href = '/signin';
        return;
      }
      if (res.status === 400) {
        // Profile incomplete -> go to onboarding
        window.location.href = '/onboarding';
        return;
      }

      const data = await res.json();
      
      if (data.profiles) {
        // Transform data for SwipeCard
        const profiles = data.profiles.map((p: any) => ({
          userId: p.userId,
          displayName: p.displayName,
          age: p.age, // Use age from API
          bio: p.bio,
          interests: typeof p.interests === 'string' ? JSON.parse(p.interests) : p.interests,
          photos: typeof p.photos === 'string' ? JSON.parse(p.photos) : p.photos,
        }));
        setCandidates(profiles);
        setCurrentIndex(0);
      } else {
        setCandidates([]);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      // Fallback to empty
      setCandidates([]);
    }
  };

  const handleLike = async (comment?: string, commentOnField?: string) => {
    const current = candidates[currentIndex];
    setLastSwiped(current);
    console.log("Liked:", current.userId);

    try {
      const res = await fetch(`/api/likes/${current.userId}`, {
        method: 'POST',
        body: JSON.stringify({ comment, commentOnField }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      
      if (data.match && data.match.matched) {
        setMatchedUser(current);
        setShowMatchModal(true);
      }
    } catch (error) {
      console.error('Error liking profile:', error);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handlePass = () => {
    const current = candidates[currentIndex];
    setLastSwiped(current);
    console.log("Passed:", candidates[currentIndex].userId);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSuperLike = async (message?: string) => {
    if (superLikesLeft <= 0) {
      alert("You have no Super Likes left!");
      return;
    }
    const current = candidates[currentIndex];
    setLastSwiped(current);
    console.log("Super Liked:", current.userId);

    try {
      const res = await fetch(`/api/superlikes/${current.userId}`, {
        method: 'POST',
        body: JSON.stringify({ message }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      
      if (data.match && data.match.matched) {
        setMatchedUser(current);
        setShowMatchModal(true);
      }
      setSuperLikesLeft(prev => prev - 1);
    } catch (error) {
      console.error('Error super liking profile:', error);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (lastSwiped) {
      setCurrentIndex((prev) => prev - 1);
      setLastSwiped(null);
    }
  };

  // Loading state to avoid flashing "No more candidates"
  if (candidates === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Finding great matches near you…</span>
        </div>
      </div>
    );
  }

  if (candidates.length === 0 || currentIndex >= candidates.length) {
    const { EmptyFeed } = require("@/components/illustrations/EmptyFeed");
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center p-4">
        <div className="text-center">
          <EmptyFeed className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">You're all caught up!</h2>
          <p className="text-muted-foreground mb-6">
            You've seen all the profiles in your area. Check back later or upgrade to Premium for unlimited swipes.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()}>Refresh</Button>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
              <Star className="w-4 h-4 mr-2" />
              Go Premium
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 dark:from-neutral-950 dark:to-neutral-900 flex flex-col items-center justify-center p-4 pt-16 pb-24">
        {/* Boost Button/Status */}
        {hasActiveBoost ? (
          <div className="w-full max-w-sm mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-4 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
                <span className="font-bold">Boost Active</span>
              </div>
              <span className="text-sm font-semibold">{boostTimeLeft}m left</span>
            </div>
          </div>
        ) : (
          <button
            onClick={activateBoost}
            className="w-full max-w-sm mb-6 bg-gradient-to-r from-amber-500 via-pink-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-4 rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
            </svg>
            <span className="font-bold">Activate Boost</span>
          </button>
        )}

        {/* Swipe Card */}
        <EnhancedSwipeCard
          profile={candidates[currentIndex]}
          onLike={handleLike}
          onPass={handlePass}
          onSuperLike={handleSuperLike}
          superLikesLeft={superLikesLeft}
          hasActiveBoost={hasActiveBoost}
        />
        <p className="text-center text-sm text-muted-foreground mt-4">
          {currentIndex + 1} / {candidates.length}
        </p>
        {lastSwiped && (
            <button
                onClick={handleUndo}
                className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:scale-110 transition-transform"
            >
                <Undo2 />
            </button>
        )}
      </div>

      {/* Match Modal */}
      {showMatchModal && matchedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">💖</div>
            <h2 className="text-3xl font-bold mb-2">It's a Match!</h2>
            <p className="text-muted-foreground mb-6">
              You and {matchedUser.displayName} liked each other
            </p>
            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={() => {
                  setShowMatchModal(false);
                  // TODO: Navigate to chat
                }}
              >
                Send a Message
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowMatchModal(false)}
              >
                Keep Swiping
              </Button>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </>
  );
}
