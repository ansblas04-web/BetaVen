import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Calculate compatibility score based on shared interests, preferences, etc.
function calculateCompatibility(
  userProfile: { interests: string[]; ageMin: number; ageMax: number; lookingFor?: string; drinking?: string; smoking?: string; wantsKids?: string; religion?: string },
  targetProfile: { interests: string[]; birthdate: Date; lookingFor?: string; drinking?: string; smoking?: string; wantsKids?: string; religion?: string }
): number {
  let score = 0;

  // Shared interests (0-40 points)
  const sharedInterests = userProfile.interests.filter((i: string) =>
    targetProfile.interests.includes(i)
  );
  score += Math.min(sharedInterests.length * 8, 40);

  // Age preference match (0-20 points)
  const targetAge = new Date().getFullYear() - new Date(targetProfile.birthdate).getFullYear();
  if (targetAge >= userProfile.ageMin && targetAge <= userProfile.ageMax) {
    score += 20;
  }

  // Looking for alignment (0-20 points)
  if (userProfile.lookingFor && userProfile.lookingFor === targetProfile.lookingFor) {
    score += 20;
  }

  // Lifestyle compatibility (0-20 points)
  let lifestyleScore = 0;
  if (userProfile.drinking && userProfile.drinking === targetProfile.drinking) lifestyleScore += 5;
  if (userProfile.smoking && userProfile.smoking === targetProfile.smoking) lifestyleScore += 5;
  if (userProfile.wantsKids && userProfile.wantsKids === targetProfile.wantsKids) lifestyleScore += 5;
  if (userProfile.religion && userProfile.religion === targetProfile.religion) lifestyleScore += 5;
  score += lifestyleScore;

  return Math.min(score, 100);
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if standouts already generated for today
    const existingStandouts = await prisma.standout.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: today,
        },
      },
    });

    if (existingStandouts.length > 0) {
      // Return existing standouts with full profile data
      const standoutsWithProfiles = await Promise.all(
        existingStandouts.map(async (standout) => {
          const profile = await prisma.profile.findUnique({
            where: { userId: standout.standoutUserId },
            include: {
              prompts: true,
            },
          });

          if (!profile) return null;

          return {
            id: standout.id,
            reason: standout.reason,
            compatibilityScore: standout.compatibilityScore || 0,
            profile: {
              userId: profile.userId,
              displayName: profile.displayName,
              birthdate: profile.birthdate,
              bio: profile.bio,
              photos: typeof profile.photos === 'string' ? JSON.parse(profile.photos) : profile.photos,
              interests: typeof profile.interests === 'string' ? JSON.parse(profile.interests) : profile.interests,
              prompts: profile.prompts.map(p => ({
                question: p.question,
                answer: p.answer,
              })),
            },
          };
        })
      );

      return NextResponse.json({ standouts: standoutsWithProfiles.filter(Boolean) });
    }

    // Generate new standouts
    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get users to exclude (already liked, matched, blocked)
    const likedUsers = await prisma.like.findMany({
      where: { likerId: session.user.id },
      select: { likeeId: true },
    });

    const excludeIds = new Set([
      session.user.id,
      ...likedUsers.map((l) => l.likeeId),
    ]);

    // Find potential standouts
    const candidates = await prisma.profile.findMany({
      where: {
        userId: {
          notIn: Array.from(excludeIds),
        },
      },
      include: {
        prompts: true,
      },
      take: 50, // Analyze top 50 candidates
    });

    // Score and select top standouts
    const scoredCandidates = candidates
      .map((candidate) => {
        const candidateInterests = typeof candidate.interests === 'string' ? JSON.parse(candidate.interests) : candidate.interests;
        const userInterests = typeof userProfile.interests === 'string' ? JSON.parse(userProfile.interests) : userProfile.interests;
        
        const compatibilityScore = calculateCompatibility(
          { ...userProfile, interests: userInterests },
          { ...candidate, interests: candidateInterests }
        );
        
        const isNewProfile = new Date().getTime() - candidate.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000;
        const hasPrompts = candidate.prompts.length > 0;
        
        let reason = "highly_compatible";
        if (compatibilityScore > 80) {
          reason = "highly_compatible";
        } else if (isNewProfile) {
          reason = "new_here";
        } else if (hasPrompts && candidate.prompts.length >= 3) {
          reason = "recent_activity";
        }

        return {
          profile: candidate,
          compatibilityScore,
          reason,
        };
      })
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 10);

    // Create standout records
    const standouts = await Promise.all(
      scoredCandidates.map((candidate) =>
        prisma.standout.create({
          data: {
            userId: session.user.id,
            standoutUserId: candidate.profile.userId,
            reason: candidate.reason,
            compatibilityScore: candidate.compatibilityScore,
            date: today,
          },
        })
      )
    );

    const standoutsWithProfiles = standouts.map((standout, idx) => {
      const candidate = scoredCandidates[idx];
      return {
        id: standout.id,
        reason: standout.reason,
        compatibilityScore: standout.compatibilityScore || 0,
        profile: {
          userId: candidate.profile.userId,
          displayName: candidate.profile.displayName,
          birthdate: candidate.profile.birthdate,
          bio: candidate.profile.bio,
          photos: typeof candidate.profile.photos === 'string' ? JSON.parse(candidate.profile.photos) : candidate.profile.photos,
          interests: typeof candidate.profile.interests === 'string' ? JSON.parse(candidate.profile.interests) : candidate.profile.interests,
          prompts: candidate.profile.prompts.map(p => ({
            question: p.question,
            answer: p.answer,
          })),
        },
      };
    });

    return NextResponse.json({ standouts: standoutsWithProfiles });
  } catch (error) {
    console.error("Standouts error:", error);
    return NextResponse.json(
      { error: "Failed to generate standouts" },
      { status: 500 }
    );
  }
}

// Mark standout as viewed
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { standoutId, viewed, liked } = await req.json();

    const standout = await prisma.standout.update({
      where: { id: standoutId },
      data: {
        isViewed: viewed !== undefined ? viewed : undefined,
        isLiked: liked !== undefined ? liked : undefined,
      },
    });

    return NextResponse.json({ standout });
  } catch (error) {
    console.error("Update standout error:", error);
    return NextResponse.json(
      { error: "Failed to update standout" },
      { status: 500 }
    );
  }
}
