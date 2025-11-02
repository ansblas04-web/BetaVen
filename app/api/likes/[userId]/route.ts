import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId: targetUserId } = await params;

  // If demo profile, short-circuit for testing (no DB writes)
  if (targetUserId.startsWith("demo-")) {
    return NextResponse.json({ liked: true, demo: true, match: null });
  }

  try {
    // Create like
    await prisma.like.create({
      data: {
        likerId: session.user.id,
        likeeId: targetUserId,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Unique constraint violation (like already exists)
      return NextResponse.json({ error: 'Already liked' }, { status: 409 });
    }
    // Other error
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }

  // Check if target user also liked current user (mutual like = match)
  const mutualLike = await prisma.like.findUnique({
    where: {
      likerId_likeeId: {
        likerId: targetUserId,
        likeeId: session.user.id,
      },
    },
  });

  let match = null;

  if (mutualLike) {
    // Create match
    const [userAId, userBId] = [session.user.id, targetUserId].sort();

    match = await prisma.match.upsert({
      where: {
        userAId_userBId: {
          userAId,
          userBId,
        },
      },
      update: {},
      create: {
        userAId,
        userBId,
      },
      include: {
        userA: { include: { profile: true } },
        userB: { include: { profile: true } },
      },
    });
  }

  return NextResponse.json({
    liked: true,
    match: match ? { matchId: match.id, matched: true } : null,
  });
}
