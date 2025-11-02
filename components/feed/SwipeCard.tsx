"use client";

import TinderCard from "react-tinder-card";
import { Card } from "@/components/ui/card";

interface Profile {
  userId: string;
  displayName: string;
  bio?: string;
  interests: string[];
  age: number;
  photos: string[];
}

interface SwipeCardProps {
  profile: Profile;
  onLike: () => void;
  onPass: () => void;
}

export function SwipeCard({ profile, onLike, onPass }: SwipeCardProps) {
  const onSwipe = (direction: string) => {
    if (direction === "right") {
      onLike();
    } else if (direction === "left") {
      onPass();
    }
  };

  return (
    <TinderCard onSwipe={onSwipe} preventSwipe={["up", "down"]}>
      <Card className="w-full max-w-sm mx-auto relative overflow-hidden shadow-xl">
        {/* Photo placeholder */}
        <div className="aspect-[3/4] bg-gradient-to-br from-brand-gradient-start to-brand-gradient-end flex items-center justify-center text-6xl">
          {profile.displayName.charAt(0)}
        </div>

        {/* Profile info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <h2 className="text-2xl font-bold">
            {profile.displayName}, {profile.age}
          </h2>
          {profile.bio && <p className="text-sm mt-1 opacity-90">{profile.bio}</p>}
          {profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.interests.slice(0, 3).map((interest) => (
                <span
                  key={interest}
                  className="px-2 py-1 bg-white/20 backdrop-blur rounded-full text-xs"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </TinderCard>
  );
}
