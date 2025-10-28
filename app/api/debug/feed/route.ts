import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ 
      error: "Unauthorized", 
      session: null,
      hasSession: false 
    });
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { 
      profile: true, 
      likesGiven: true, 
      blocksGiven: true 
    },
  });

  // Get total profile count
  const totalProfiles = await prisma.profile.count();

  // Get all profiles (for debugging)
  const allProfiles = await prisma.profile.findMany({
    take: 5,
    select: {
      userId: true,
      displayName: true,
      birthdate: true,
    }
  });

  return NextResponse.json({
    hasSession: true,
    currentUserId: session.user.id,
    currentUserEmail: session.user.email,
    hasProfile: !!currentUser?.profile,
    profileData: currentUser?.profile ? {
      displayName: currentUser.profile.displayName,
      ageMin: currentUser.profile.ageMin,
      ageMax: currentUser.profile.ageMax,
    } : null,
    likesGiven: currentUser?.likesGiven.length || 0,
    blocksGiven: currentUser?.blocksGiven.length || 0,
    totalProfilesInDb: totalProfiles,
    sampleProfiles: allProfiles,
  });
}
