"use client";

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
  return (
    <Card className="w-full max-w-sm mx-auto relative overflow-hidden shadow-2xl">
      {/* Photo placeholder */}
      <div className="aspect-[3/4] bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-6xl">
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

      {/* Action buttons */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
        <button
          onClick={onPass}
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <button
          onClick={onLike}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
        >
          <svg
            className="w-7 h-7"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>
    </Card>
  );
}
