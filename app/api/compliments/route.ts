import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const COMPLIMENT_TYPES = {
  thoughtful: "Your profile really shows depth and thoughtfulness",
  funny: "Your sense of humor really stands out!",
  charming: "You have such a charming vibe",
  confident: "I love your confidence!",
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receiverId, type, message } = await req.json();

    if (!COMPLIMENT_TYPES[type as keyof typeof COMPLIMENT_TYPES] && !message) {
      return NextResponse.json(
        { error: "Invalid compliment type or message required" },
        { status: 400 }
      );
    }

    // Check if compliment already sent today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCompliment = await prisma.compliment.findFirst({
      where: {
        senderId: session.user.id,
        receiverId,
        createdAt: {
          gte: today,
        },
      },
    });

    if (existingCompliment) {
      return NextResponse.json(
        { error: "You've already sent a compliment to this user today" },
        { status: 400 }
      );
    }

    // Create compliment
    const compliment = await prisma.compliment.create({
      data: {
        senderId: session.user.id,
        receiverId,
        type,
        message: message || COMPLIMENT_TYPES[type as keyof typeof COMPLIMENT_TYPES],
      },
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json({ compliment });
  } catch (error) {
    console.error("Compliment error:", error);
    return NextResponse.json(
      { error: "Failed to send compliment" },
      { status: 500 }
    );
  }
}

// Get compliments received
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const compliments = await prisma.compliment.findMany({
      where: { receiverId: session.user.id },
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Mark unread compliments as read
    await prisma.compliment.updateMany({
      where: {
        receiverId: session.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ compliments });
  } catch (error) {
    console.error("Fetch compliments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch compliments" },
      { status: 500 }
    );
  }
}
