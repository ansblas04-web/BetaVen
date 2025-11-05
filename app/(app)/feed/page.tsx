"use client";

import { useState, useEffect, useCallback } from "react";
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

      if (typeof data.superLikesLeft === "number") {
        setSuperLikesLeft(data.superLikesLeft);
      }

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

  const handleLike = useCallback(async (comment?: string, commentOnField?: string) => {
    if (!candidates || currentIndex >= candidates.length) return;
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
  }, [candidates, currentIndex]);

  const handlePass = useCallback(() => {
    if (!candidates || currentIndex >= candidates.length) return;
    const current = candidates[currentIndex];
    setLastSwiped(current);
    console.log("Passed:", candidates[currentIndex].userId);
    setCurrentIndex((prev) => prev + 1);
  }, [candidates, currentIndex]);

  const handleSuperLike = useCallback(async (message?: string) => {
    if (superLikesLeft <= 0) {
      alert("You have no Super Likes left!");
      return;
    }
    if (!candidates || currentIndex >= candidates.length) return;
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

      if (!res.ok) {
        alert(data.error || "Failed to Super Like profile");
        return;
      }

      if (data.match && data.match.matched) {
        setMatchedUser(current);
        setShowMatchModal(true);
      }

      if (typeof data.superLikesLeft === "number") {
        setSuperLikesLeft(data.superLikesLeft);
      } else {
        setSuperLikesLeft((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error super liking profile:', error);
      alert('Failed to Super Like profile');
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  }, [candidates, currentIndex, superLikesLeft]);

  const handleUndo = () => {
    if (lastSwiped) {
      setCurrentIndex((prev) => prev - 1);
      setLastSwiped(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!candidates || candidates.length === 0) {
        return;
      }

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          handleLike();
          break;
        case "ArrowLeft":
          event.preventDefault();
          handlePass();
          break;
        case "ArrowUp":
          event.preventDefault();
          handleSuperLike();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [candidates, handleLike, handlePass, handleSuperLike]);

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
      {/* Fixed viewport container - no scrolling */}
      <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 dark:from-neutral-950 dark:via-purple-950/20 dark:to-neutral-900">
        {/* Main content container */}
        <div className="h-full flex flex-col">
          {/* Top section with boost button - fixed height */}
          <div className="flex-shrink-0 pt-4 px-4 pb-2">
            {hasActiveBoost ? (
              <div className="max-w-sm mx-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-2xl shadow-lg animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                    </svg>
                    <span className="font-bold text-sm">Boost Active</span>
                  </div>
                  <span className="text-sm font-semibold bg-white/20 px-2 py-0.5 rounded-full">{boostTimeLeft}m</span>
                </div>
              </div>
            ) : (
              <button
                onClick={activateBoost}
                className="max-w-sm mx-auto w-full bg-gradient-to-r from-amber-500 via-pink-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
                <span className="font-bold text-sm">Activate Boost</span>
              </button>
            )}
          </div>

          {/* Card container - takes remaining space */}
          <div className="flex-1 flex items-center justify-center px-4 relative">
            {/* Card stack effect - show 2-3 cards behind */}
            <div className="relative w-full max-w-sm" style={{ height: 'calc(100vh - 240px)' }}>
              {/* Background cards for stack effect */}
              {currentIndex + 1 < candidates.length && (
                <div 
                  className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-3xl shadow-xl"
                  style={{ 
                    transform: 'scale(0.95) translateY(8px)',
                    opacity: 0.7,
                    zIndex: 1
                  }}
                />
              )}
              {currentIndex + 2 < candidates.length && (
                <div 
                  className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-3xl shadow-lg"
                  style={{ 
                    transform: 'scale(0.90) translateY(16px)',
                    opacity: 0.4,
                    zIndex: 0
                  }}
                />
              )}
              
              {/* Current card */}
              <div className="relative z-10 h-full">
                <EnhancedSwipeCard
                  profile={candidates[currentIndex]}
                  onLike={handleLike}
                  onPass={handlePass}
                  onSuperLike={handleSuperLike}
                  superLikesLeft={superLikesLeft}
                  hasActiveBoost={hasActiveBoost}
                />
              </div>
            </div>

            {/* Undo button */}
            {lastSwiped && (
              <button
                onClick={handleUndo}
                className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white dark:bg-neutral-800 shadow-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:scale-110 transition-transform z-20 border-2 border-gray-100 dark:border-neutral-700"
              >
                <Undo2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Bottom section - profile counter and nav */}
          <div className="flex-shrink-0 pb-20">
            <p className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              {currentIndex + 1} of {candidates.length} profiles
            </p>
          </div>
        </div>
      </div>

      {/* Match Modal */}
      {showMatchModal && matchedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-pink-200 dark:border-pink-900">
            <div className="text-7xl mb-6 animate-bounce">💖</div>
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              It's a Match!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              You and {matchedUser.displayName} liked each other
            </p>
            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-6 text-lg rounded-2xl"
                onClick={() => {
                  setShowMatchModal(false);
                  // TODO: Navigate to chat
                }}
              >
                Send a Message 💬
              </Button>
              <Button
                variant="outline"
                className="w-full py-6 text-lg rounded-2xl border-2"
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
