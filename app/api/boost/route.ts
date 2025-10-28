import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const BOOST_DURATION_MINUTES = 30; // Standard boost duration

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is premium (or has boost credits in future)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isPremium: true },
    });

    if (!user?.isPremium) {
      return NextResponse.json(
        { error: "Boost feature requires Premium subscription" },
        { status: 403 }
      );
    }

    // Check if already has active boost
    const activeBoost = await prisma.boost.findFirst({
      where: {
        userId: session.user.id,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (activeBoost) {
      return NextResponse.json(
        {
          error: "You already have an active boost",
          boost: activeBoost,
        },
        { status: 400 }
      );
    }

    // Create new boost
    const now = new Date();
    const expiresAt = new Date(now.getTime() + BOOST_DURATION_MINUTES * 60 * 1000);

    const boost = await prisma.boost.create({
      data: {
        userId: session.user.id,
        startedAt: now,
        expiresAt,
        isActive: true,
      },
    });

    return NextResponse.json({ boost });
  } catch (error) {
    console.error("Boost error:", error);
    return NextResponse.json(
      { error: "Failed to activate boost" },
      { status: 500 }
    );
  }
}

// Get current boost status
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeBoost = await prisma.boost.findFirst({
      where: {
        userId: session.user.id,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: { startedAt: "desc" },
    });

    // Deactivate expired boosts
    await prisma.boost.updateMany({
      where: {
        userId: session.user.id,
        isActive: true,
        expiresAt: {
          lte: new Date(),
        },
      },
      data: { isActive: false },
    });

    return NextResponse.json({
      boost: activeBoost,
      isActive: !!activeBoost,
    });
  } catch (error) {
    console.error("Get boost error:", error);
    return NextResponse.json(
      { error: "Failed to fetch boost status" },
      { status: 500 }
    );
  }
}
