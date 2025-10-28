import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify match exists and user is part of it
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      userA: { include: { profile: true } },
      userB: { include: { profile: true } },
      messages: {
        orderBy: { sentAt: "asc" },
      },
    },
  });

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  if (match.userAId !== session.user.id && match.userBId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Get other user info
  const otherUser =
    match.userAId === session.user.id ? match.userB : match.userA;
  const age = Math.floor(
    (Date.now() - new Date(otherUser.profile!.birthdate).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000)
  );

  const formattedMessages = match.messages.map((msg) => ({
    id: msg.id,
    senderId: msg.senderId,
    body: msg.body,
    sentAt: msg.sentAt,
    readAt: msg.readAt,
  }));

  return NextResponse.json({
    messages: formattedMessages,
    otherUser: {
      id: otherUser.id,
      displayName: otherUser.profile!.displayName,
      age,
    },
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { body } = await req.json();

  if (!body || !body.trim()) {
    return NextResponse.json({ error: "Message body required" }, { status: 400 });
  }

  // Verify match exists and user is part of it
  const match = await prisma.match.findUnique({
    where: { id: matchId },
  });

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  if (match.userAId !== session.user.id && match.userBId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Create message
  const message = await prisma.message.create({
    data: {
      matchId,
      senderId: session.user.id,
      body: body.trim(),
    },
  });

  return NextResponse.json({
    message: {
      id: message.id,
      senderId: message.senderId,
      body: message.body,
      sentAt: message.sentAt,
      readAt: message.readAt,
    },
  });
}
