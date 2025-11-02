"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Sparkles, Heart, RefreshCw } from "lucide-react";

interface Standout {
  id: string;
  reason: string;
  compatibilityScore: number;
  profile: {
    userId: string;
    displayName: string;
    birthdate: string;
    bio?: string;
    photos: string[];
    interests: string[];
    prompts?: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export default function StandoutsPage() {
  const [standouts, setStandouts] = useState<Standout[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStandout, setSelectedStandout] = useState<Standout | null>(null);

  useEffect(() => {
    fetchStandouts();
  }, []);

  const fetchStandouts = async () => {
    try {
      const res = await fetch("/api/standouts");
      const data = await res.json();
      setStandouts(data.standouts || []);
    } catch (error) {
      console.error("Error fetching standouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLoading(true);
      fetchStandouts();
      setRefreshing(false);
    }, 1000);
  };

  const handleLike = async (standoutId: string, profileId: string) => {
    try {
      // Mark standout as liked
      await fetch("/api/standouts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ standoutId, liked: true }),
      });

      // Send like to profile
      await fetch(`/api/likes/${profileId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      // Remove from list
      setStandouts(standouts.filter((s) => s.id !== standoutId));
      setSelectedStandout(null);
    } catch (error) {
      console.error("Error liking standout:", error);
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case "highly_compatible":
        return "Highly Compatible";
      case "new_here":
        return "New Here";
      case "recent_activity":
        return "Recently Active";
      case "popular":
        return "Popular";
      default:
        return "Featured";
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case "highly_compatible":
        return "bg-pink-500";
      case "new_here":
        return "bg-green-500";
      case "recent_activity":
        return "bg-blue-500";
      case "popular":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const calculateAge = (birthdate: string) => {
    return new Date().getFullYear() - new Date(birthdate).getFullYear();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 animate-pulse text-pink-500" />
          <p className="text-gray-600">Finding your top picks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8 px-4 pt-16 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            <h1 className="text-3xl font-bold">Standouts</h1>
          </div>
          <p className="text-gray-600">
            Your daily curated picks • {standouts.length} profiles
          </p>
          <Button onClick={handleRefresh} variant="outline" className="mt-4">
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {standouts.length === 0 ? (
          <Card className="p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">
              No standouts available today
            </h3>
            <p className="text-gray-600">
              Check back tomorrow for fresh recommendations!
            </p>
          </Card>
        ) : (
          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${refreshing ? "animate-pulse" : ""}`}>
            {standouts.map((standout) => (
              <Card
                key={standout.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedStandout(standout)}
              >
                <div className="relative aspect-[3/4]">
                  {standout.profile.photos[0] ? (
                    <img
                      src={standout.profile.photos[0]}
                      alt={standout.profile.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-4xl">
                      {standout.profile.displayName.charAt(0)}
                    </div>
                  )}

                  {/* Reason badge */}
                  <div
                    className={`absolute top-2 left-2 ${getReasonColor(
                      standout.reason
                    )} text-white px-2 py-1 rounded-full text-xs font-semibold`}
                  >
                    {getReasonLabel(standout.reason)}
                  </div>

                  {/* Compatibility score */}
                  {standout.compatibilityScore > 0 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {Math.round(standout.compatibilityScore)}% match
                    </div>
                  )}

                  {/* Quick info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
                    <p className="font-semibold">
                      {standout.profile.displayName},{" "}
                      {calculateAge(standout.profile.birthdate)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detailed view modal */}
      {selectedStandout && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="relative aspect-[3/4]">
              {selectedStandout.profile.photos[0] ? (
                <img
                  src={selectedStandout.profile.photos[0]}
                  alt={selectedStandout.profile.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-6xl">
                  {selectedStandout.profile.displayName.charAt(0)}
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  {selectedStandout.profile.displayName},{" "}
                  {calculateAge(selectedStandout.profile.birthdate)}
                </h2>
                <div
                  className={`${getReasonColor(
                    selectedStandout.reason
                  )} text-white px-3 py-1 rounded-full text-xs font-semibold`}
                >
                  {getReasonLabel(selectedStandout.reason)}
                </div>
              </div>

              {selectedStandout.profile.bio && (
                <p className="text-gray-700 mb-4">{selectedStandout.profile.bio}</p>
              )}

              {selectedStandout.profile.interests.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Interests
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStandout.profile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedStandout.profile.prompts &&
                selectedStandout.profile.prompts.length > 0 && (
                  <div className="mb-4 space-y-3">
                    {selectedStandout.profile.prompts.map((prompt, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">
                          {prompt.question}
                        </p>
                        <p className="text-sm">{prompt.answer}</p>
                      </div>
                    ))}
                  </div>
                )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setSelectedStandout(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() =>
                    handleLike(
                      selectedStandout.id,
                      selectedStandout.profile.userId
                    )
                  }
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Like
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
