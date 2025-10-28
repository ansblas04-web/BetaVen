import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Popular prompt questions
export const PROMPT_QUESTIONS = [
  "What's your ideal Sunday?",
  "Two truths and a lie",
  "I'm looking for someone who...",
  "My perfect first date",
  "I'm overly competitive about...",
  "The way to win me over is...",
  "I geek out on...",
  "My most controversial opinion",
  "Best travel story",
  "I won't shut up about...",
  "Green flags I look for",
  "My love language is...",
  "I'm secretly really good at...",
  "Most spontaneous thing I've done",
  "The key to my heart is...",
];

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prompts = await prisma.profilePrompt.findMany({
      where: {
        profileId: session.user.id,
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ prompts, availableQuestions: PROMPT_QUESTIONS });
  } catch (error) {
    console.error("Get prompts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, answer, answerType = "text", voiceUrl, order = 0 } = await req.json();

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

    // Check if profile has too many prompts (max 5)
    const existingCount = await prisma.profilePrompt.count({
      where: { profileId: session.user.id },
    });

    if (existingCount >= 5) {
      return NextResponse.json(
        { error: "Maximum 5 prompts allowed" },
        { status: 400 }
      );
    }

    const prompt = await prisma.profilePrompt.create({
      data: {
        profileId: session.user.id,
        question,
        answer,
        answerType,
        voiceUrl,
        order: order || existingCount,
      },
    });

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Create prompt error:", error);
    return NextResponse.json(
      { error: "Failed to create prompt" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { promptId } = await req.json();

    await prisma.profilePrompt.delete({
      where: {
        id: promptId,
        profileId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete prompt error:", error);
    return NextResponse.json(
      { error: "Failed to delete prompt" },
      { status: 500 }
    );
  }
}
