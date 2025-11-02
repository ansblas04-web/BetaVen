"use client";

import { Card } from "@/components/ui/card";

export function About() {
  // Mock data
  const profile = {
    bio: "I'm a software engineer who loves to travel and try new things. I'm looking for someone to share my adventures with.",
    interests: ["Travel", "Music", "Art", "Fitness", "Food"],
    height: "170",
    lookingFor: "Relationship",
    drinking: "Socially",
    smoking: "Never",
    wantsKids: "Maybe",
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h4 className="font-semibold text-lg">Bio</h4>
        <p className="text-muted-foreground">{profile.bio}</p>
      </Card>
      <Card className="p-4">
        <h4 className="font-semibold text-lg">Interests</h4>
        <div className="flex flex-wrap gap-2 mt-2">
          {profile.interests.map((interest: string) => (
            <span
              key={interest}
              className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <h4 className="font-semibold text-lg">Lifestyle</h4>
        <div className="grid grid-cols-2 gap-4 pt-4">
          {profile.height && (
            <div>
              <p className="text-sm font-medium">{profile.height} cm</p>
              <p className="text-muted-foreground text-xs">Height</p>
            </div>
          )}
          {profile.lookingFor && (
            <div>
              <p className="text-sm font-medium capitalize">{profile.lookingFor}</p>
              <p className="text-muted-foreground text-xs">Looking For</p>
            </div>
          )}
          {profile.drinking && (
            <div>
              <p className="text-sm font-medium capitalize">{profile.drinking}</p>
              <p className="text-muted-foreground text-xs">Drinking</p>
            </div>
          )}
          {profile.smoking && (
            <div>
              <p className="text-sm font-medium capitalize">{profile.smoking}</p>
              <p className="text-muted-foreground text-xs">Smoking</p>
            </div>
          )}
          {profile.wantsKids && (
            <div>
              <p className="text-sm font-medium capitalize">{profile.wantsKids}</p>
              <p className="text-muted-foreground text-xs">Want Kids</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
