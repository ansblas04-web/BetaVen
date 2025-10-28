import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { matchId } = await params;

  // Verify user is part of this match
  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      OR: [{ userAId: session.user.id }, { userBId: session.user.id }],
    },
  });

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  // Fetch messages
  const messages = await prisma.message.findMany({
    where: { matchId },
    orderBy: { sentAt: "asc" },
    include: {
      sender: { select: { id: true } },
    },
  });

  return NextResponse.json({ messages });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { matchId } = await params;
  const body = await request.json();

  // Verify user is part of this match
  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      OR: [{ userAId: session.user.id }, { userBId: session.user.id }],
    },
  });

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  // Create message
  const message = await prisma.message.create({
    data: {
      matchId,
      senderId: session.user.id,
      body: body.body,
    },
  });

  // Update match to mark first message sent
  if (!match.hasFirstMessage) {
    await prisma.match.update({
      where: { id: matchId },
      data: { hasFirstMessage: true },
    });
  }

  return NextResponse.json({ message });
}
