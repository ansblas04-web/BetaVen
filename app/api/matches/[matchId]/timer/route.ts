import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MATCH_TIMER_HOURS = 24; // Bumble-style 24-hour timer
const EXTEND_HOURS = 24; // Extension adds 24 more hours

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { matchId } = await params;
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: {
        id: true,
        createdAt: true,
        expiresAt: true,
        initiatorId: true,
        hasFirstMessage: true,
        userAId: true,
        userBId: true,
      },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Check if user is part of match
    if (match.userAId !== session.user.id && match.userBId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Calculate remaining time
    const now = new Date();
    const timeRemaining = match.expiresAt
      ? Math.max(0, match.expiresAt.getTime() - now.getTime())
      : null;

    const isExpired = match.expiresAt && match.expiresAt < now;
    const canExtend = match.initiatorId === session.user.id && !match.hasFirstMessage;

    return NextResponse.json({
      match: {
        id: match.id,
        expiresAt: match.expiresAt,
        timeRemainingMs: timeRemaining,
        isExpired,
        initiatorId: match.initiatorId,
        hasFirstMessage: match.hasFirstMessage,
        canExtend,
        isUserInitiator: match.initiatorId === session.user.id,
      },
    });
  } catch (error) {
    console.error("Get timer error:", error);
    return NextResponse.json(
      { error: "Failed to fetch timer" },
      { status: 500 }
    );
  }
}

// Extend match timer
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isPremium: true },
    });

    if (!user?.isPremium) {
      return NextResponse.json(
        { error: "Extend feature requires Premium subscription" },
        { status: 403 }
      );
    }

    const { matchId } = await params;
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Only initiator can extend
    if (match.initiatorId !== session.user.id) {
      return NextResponse.json(
        { error: "Only match initiator can extend" },
        { status: 403 }
      );
    }

    // Can't extend if first message already sent
    if (match.hasFirstMessage) {
      return NextResponse.json(
        { error: "Match already has first message" },
        { status: 400 }
      );
    }

    // Check if already expired
    const now = new Date();
    if (match.expiresAt && match.expiresAt < now) {
      return NextResponse.json(
        { error: "Match has already expired" },
        { status: 400 }
      );
    }

    // Extend by 24 hours
    const newExpiresAt = new Date(
      (match.expiresAt || now).getTime() + EXTEND_HOURS * 60 * 60 * 1000
    );

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: { expiresAt: newExpiresAt },
    });

    return NextResponse.json({
      success: true,
      match: {
        id: updatedMatch.id,
        expiresAt: updatedMatch.expiresAt,
      },
    });
  } catch (error) {
    console.error("Extend timer error:", error);
    return NextResponse.json(
      { error: "Failed to extend timer" },
      { status: 500 }
    );
  }
}

// Rematch with expired match
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isPremium: true },
    });

    if (!user?.isPremium) {
      return NextResponse.json(
        { error: "Rematch feature requires Premium subscription" },
        { status: 403 }
      );
    }

    const { matchId } = await params;
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Check if user is part of match
    if (match.userAId !== session.user.id && match.userBId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Must be expired to rematch
    const now = new Date();
    if (!match.expiresAt || match.expiresAt >= now) {
      return NextResponse.json(
        { error: "Match has not expired yet" },
        { status: 400 }
      );
    }

    // Create new timer
    const newExpiresAt = new Date(now.getTime() + MATCH_TIMER_HOURS * 60 * 60 * 1000);

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        expiresAt: newExpiresAt,
        hasFirstMessage: false, // Reset
      },
    });

    return NextResponse.json({
      success: true,
      message: "Match reactivated!",
      match: {
        id: updatedMatch.id,
        expiresAt: updatedMatch.expiresAt,
      },
    });
  } catch (error) {
    console.error("Rematch error:", error);
    return NextResponse.json(
      { error: "Failed to rematch" },
      { status: 500 }
    );
  }
}
