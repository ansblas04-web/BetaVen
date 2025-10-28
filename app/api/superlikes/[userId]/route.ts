import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId: targetUserId } = params;
    const { message } = await req.json();

    // Short-circuit for demo profiles (no DB writes)
    if (targetUserId.startsWith("demo-")) {
      return NextResponse.json({ superLike: { demo: true }, mutual: false, demo: true });
    }

    // Check if user has Super Likes left
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        superLikesLeft: true,
        superLikesResetAt: true,
        isPremium: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Reset daily Super Likes if 24 hours have passed
    const now = new Date();
    const resetDate = new Date(user.superLikesResetAt);
    const hoursSinceReset = (now.getTime() - resetDate.getTime()) / (1000 * 60 * 60);

    if (hoursSinceReset >= 24) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          superLikesLeft: user.isPremium ? 10 : 5, // Premium gets more
          superLikesResetAt: now,
        },
      });
    } else if (user.superLikesLeft <= 0) {
      return NextResponse.json(
        { error: "No Super Likes remaining. Try again tomorrow or upgrade to Premium." },
        { status: 403 }
      );
    }

    // Check if Super Like already exists
    const existingSuperLike = await prisma.superLike.findUnique({
      where: {
        likerId_likeeId: {
          likerId: session.user.id,
          likeeId: targetUserId,
        },
      },
    });

    if (existingSuperLike) {
      return NextResponse.json(
        { error: "You've already Super Liked this user" },
        { status: 400 }
      );
    }

    // Create Super Like and decrement counter
    const superLike = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: { superLikesLeft: { decrement: 1 } },
      });

      return tx.superLike.create({
        data: {
          likerId: session.user.id,
          likeeId: targetUserId,
          message,
          notified: false,
        },
      });
    });

    // Check if mutual - create match if target has liked back
    const existingLike = await prisma.like.findUnique({
      where: {
        likerId_likeeId: {
          likerId: targetUserId,
          likeeId: session.user.id,
        },
      },
    });

    if (existingLike) {
      const match = await prisma.match.create({
        data: {
          userAId: session.user.id,
          userBId: targetUserId,
        },
      });
      return NextResponse.json({ superLike, match, mutual: true });
    }

    return NextResponse.json({ superLike, mutual: false });
  } catch (error) {
    console.error("Super Like error:", error);
    return NextResponse.json(
      { error: "Failed to create Super Like" },
      { status: 500 }
    );
  }
}

// Get Super Likes received
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const superLikes = await prisma.superLike.findMany({
      where: { likeeId: session.user.id },
      include: {
        liker: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Mark as notified
    await prisma.superLike.updateMany({
      where: {
        likeeId: session.user.id,
        notified: false,
      },
      data: { notified: true },
    });

    return NextResponse.json({ superLikes });
  } catch (error) {
    console.error("Fetch Super Likes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Super Likes" },
      { status: 500 }
    );
  }
}
