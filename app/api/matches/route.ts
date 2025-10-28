import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const matches = await prisma.match.findMany({
    where: {
      OR: [{ userAId: session.user.id }, { userBId: session.user.id }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      userA: { include: { profile: true } },
      userB: { include: { profile: true } },
      messages: {
        orderBy: { sentAt: "desc" },
        take: 1,
      },
    },
  });

  // Format matches with other user's info
  const formattedMatches = matches.map((match) => {
    const otherUser =
      match.userAId === session.user.id ? match.userB : match.userA;
    const age = Math.floor(
      (Date.now() - new Date(otherUser.profile!.birthdate).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );

    return {
      id: match.id,
      user: {
        id: otherUser.id,
        displayName: otherUser.profile!.displayName,
        bio: otherUser.profile!.bio,
        age,
      },
      lastMessage: match.messages[0] || null,
      createdAt: match.createdAt,
    };
  });

  return NextResponse.json({ matches: formattedMatches });
}
