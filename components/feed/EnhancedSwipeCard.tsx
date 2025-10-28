"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Heart, X, Star, MessageCircle, Zap } from "lucide-react";

interface ProfilePrompt {
  id: string;
  question: string;
  answer: string;
  answerType: "text" | "voice";
  voiceUrl?: string;
}

interface Profile {
  userId: string;
  displayName: string;
  bio?: string;
  interests: string[];
  age: number;
  photos: string[];
  height?: number;
  lookingFor?: string;
  drinking?: string;
  smoking?: string;
  wantsKids?: string;
  prompts?: ProfilePrompt[];
  isVerified?: boolean;
}

interface EnhancedSwipeCardProps {
  profile: Profile;
  onLike: (comment?: string, commentOnField?: string) => void;
  onPass: () => void;
  onSuperLike: (message?: string) => void;
  superLikesLeft: number;
  hasActiveBoost?: boolean;
}

export function EnhancedSwipeCard({
  profile,
  onLike,
  onPass,
  onSuperLike,
  superLikesLeft,
  hasActiveBoost = false,
}: EnhancedSwipeCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [selectedField, setSelectedField] = useState<string>("");
  const [comment, setComment] = useState("");

  const handleCommentOnField = (field: string) => {
    setSelectedField(field);
    setShowCommentDialog(true);
  };

  const handleSubmitLike = () => {
    if (comment) {
      onLike(comment, selectedField);
    } else {
      onLike();
    }
    setShowCommentDialog(false);
    setComment("");
  };

  return (
    <>
      <div className="w-full max-w-sm mx-auto relative">
        {/* Main card with photo */}
        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-amber-200 via-pink-200 to-orange-200">
          {profile.photos.length > 0 ? (
            <img
              src={profile.photos[currentPhotoIndex] || ""}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center text-6xl h-full">
              {profile.displayName.charAt(0)}
            </div>
          )}

          {/* Photo indicators */}
          {profile.photos.length > 1 && (
            <div className="absolute top-4 left-0 right-0 flex gap-1.5 px-4">
              {profile.photos.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-1 rounded-full transition-all ${
                    idx === currentPhotoIndex ? "bg-white" : "bg-white/30"
                  }`}
                  onClick={() => setCurrentPhotoIndex(idx)}
                />
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-12 right-4 flex flex-col gap-2">
            {profile.isVerified && (
              <div className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg backdrop-blur">
                ✓ Verified
              </div>
            )}
            {hasActiveBoost && (
              <div className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg backdrop-blur">
                <Zap className="w-3 h-3" />
                Boosted
              </div>
            )}
          </div>
        </div>

        {/* Profile info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-6 pb-24 text-white">
          <h2 className="text-3xl font-bold tracking-tight">
            {profile.displayName}, {profile.age}
          </h2>

          {profile.bio && (
            <p className="text-sm mt-3 leading-relaxed opacity-90 line-clamp-2">{profile.bio}</p>
          )}

          {/* Quick facts */}
          <div className="flex flex-wrap gap-2 mt-4 text-xs">
            {profile.height && (
              <span className="bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium">
                {Math.floor(profile.height / 30.48)}'{Math.floor((profile.height % 30.48) / 2.54)}"
              </span>
            )}
            {profile.lookingFor && (
              <span className="bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium capitalize">
                {profile.lookingFor}
              </span>
            )}
            {profile.drinking && (
              <span className="bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium capitalize">
                🍷 {profile.drinking}
              </span>
            )}
            {profile.smoking && profile.smoking === "never" && (
              <span className="bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium">
                🚭 Non-smoker
              </span>
            )}
          </div>

          {/* Interests */}
          {profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.interests.slice(0, 4).map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1.5 bg-pink-500/40 backdrop-blur-sm rounded-full text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons - floating below card */}
      <div className="flex justify-center items-center gap-5 mt-8">
        <button
          onClick={onPass}
          className="w-14 h-14 rounded-full bg-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center border-2 border-gray-100"
        >
          <X className="w-7 h-7 text-red-500" strokeWidth={2.5} />
        </button>

        <button
          onClick={() => onSuperLike()}
          disabled={superLikesLeft === 0}
          className="w-12 h-12 rounded-full bg-blue-500 shadow-xl hover:shadow-2xl hover:bg-blue-600 hover:scale-110 transition-all flex items-center justify-center disabled:opacity-40 disabled:hover:scale-100"
          title={`${superLikesLeft} Super Likes left`}
        >
          <Star className="w-6 h-6 text-white fill-white" strokeWidth={2} />
        </button>

        <button
          onClick={() => onLike()}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 via-pink-500 to-orange-600 shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
        >
          <Heart className="w-8 h-8 text-white fill-white" strokeWidth={2} />
        </button>

        <button
          onClick={() => setShowCommentDialog(true)}
          className="w-12 h-12 rounded-full bg-purple-500 shadow-xl hover:shadow-2xl hover:bg-purple-600 hover:scale-110 transition-all flex items-center justify-center"
          title="Add a comment"
        >
          <MessageCircle className="w-6 h-6 text-white" strokeWidth={2} />
        </button>
      </div>

      {/* Comment dialog */}
      {showCommentDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Add a comment</h3>
            <p className="text-sm text-gray-500 mb-6">
              Stand out! Add a thoughtful note to your like.
            </p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What caught your attention?"
              className="w-full border-2 border-gray-200 rounded-2xl p-4 min-h-[120px] mb-4 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
              maxLength={200}
            />
            <p className="text-xs text-gray-400 mb-4">{comment.length}/200</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCommentDialog(false);
                  setComment("");
                }}
                className="flex-1 py-3 rounded-full border-2 border-gray-200 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitLike} 
                className="flex-1 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold hover:shadow-lg transition-all"
              >
                Send Like ❤️
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
