import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true, likesGiven: true, blocksGiven: true },
  });

  if (!currentUser?.profile) {
    return NextResponse.json({ error: "Profile incomplete" }, { status: 400 });
  }

  // Use default age range if not set
  const ageMin = currentUser.profile.ageMin || 18;
  const ageMax = currentUser.profile.ageMax || 99;

  // Get IDs of users already liked or blocked
  const excludedIds = [
    session.user.id,
    ...currentUser.likesGiven.map((l) => l.likeeId),
    ...currentUser.blocksGiven.map((b) => b.blockedId),
  ];

  // Calculate age range dates
  const today = new Date();
  const maxBirthdate = new Date(
    today.getFullYear() - ageMin,
    today.getMonth(),
    today.getDate()
  );
  const minBirthdate = new Date(
    today.getFullYear() - ageMax,
    today.getMonth(),
    today.getDate()
  );

  // Fetch candidates
  const candidates = await prisma.profile.findMany({
    where: {
      userId: { notIn: excludedIds },
      birthdate: {
        gte: minBirthdate,
        lte: maxBirthdate,
      },
      // TODO: Add distance filtering using PostGIS
      // TODO: Add gender/orientation filters
    },
    take: 20,
    orderBy: { updatedAt: "desc" }, // Simple ranking for now
    include: {
      user: { select: { id: true } },
      prompts: true,
    },
  });

  // Calculate ages and format response
  const profiles = candidates.map((profile) => {
    const age = Math.floor(
      (today.getTime() - new Date(profile.birthdate).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );

    return {
      userId: profile.userId,
      displayName: profile.displayName,
      birthdate: profile.birthdate,
      age,
      bio: profile.bio,
      interests: profile.interests,
      photos: profile.photos,
      height: profile.height,
      lookingFor: profile.lookingFor,
      drinking: profile.drinking,
      smoking: profile.smoking,
      wantsKids: profile.wantsKids,
      isVerified: profile.isVerified,
      prompts: profile.prompts,
    };
  });

  return NextResponse.json({ profiles });
}
