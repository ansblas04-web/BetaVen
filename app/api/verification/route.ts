import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const VERIFICATION_POSES = ["turn_left", "smile", "neutral"] as const;

// Get verification status
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: {
        isVerified: true,
        verificationStatus: true,
      },
    });

    const attempts = await prisma.verificationAttempt.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      profile: {
        isVerified: profile?.isVerified || false,
        verificationStatus: profile?.verificationStatus || "unverified",
      },
      attempts,
      requiredPoses: VERIFICATION_POSES,
    });
  } catch (error) {
    console.error("Get verification error:", error);
    return NextResponse.json(
      { error: "Failed to fetch verification status" },
      { status: 500 }
    );
  }
}

// Submit verification photo
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { photoUrl, pose } = await req.json();

    if (!photoUrl || !pose) {
      return NextResponse.json(
        { error: "Photo URL and pose are required" },
        { status: 400 }
      );
    }

    if (!VERIFICATION_POSES.includes(pose)) {
      return NextResponse.json(
        { error: "Invalid pose. Must be: turn_left, smile, or neutral" },
        { status: 400 }
      );
    }

    // Check if already verified
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { isVerified: true, verificationStatus: true },
    });

    if (profile?.isVerified) {
      return NextResponse.json(
        { error: "Profile is already verified" },
        { status: 400 }
      );
    }

    // Check for pending verification
    const pendingAttempt = await prisma.verificationAttempt.findFirst({
      where: {
        userId: session.user.id,
        status: "pending",
      },
    });

    if (pendingAttempt) {
      return NextResponse.json(
        { error: "You already have a pending verification" },
        { status: 400 }
      );
    }

    // Create verification attempt
    const attempt = await prisma.verificationAttempt.create({
      data: {
        userId: session.user.id,
        photoUrl,
        pose,
        status: "pending",
      },
    });

    // Update profile status to pending
    await prisma.profile.update({
      where: { userId: session.user.id },
      data: { verificationStatus: "pending" },
    });

    // In production, this would trigger:
    // 1. AI-based photo verification
    // 2. Manual review queue
    // 3. Pose matching algorithm
    // For now, we'll auto-approve after 5 seconds (demo mode)

    return NextResponse.json({
      success: true,
      message: "Verification photo submitted! Review typically takes 1-2 hours.",
      attempt: {
        id: attempt.id,
        status: attempt.status,
        createdAt: attempt.createdAt,
      },
    });
  } catch (error) {
    console.error("Submit verification error:", error);
    return NextResponse.json(
      { error: "Failed to submit verification" },
      { status: 500 }
    );
  }
}

// Admin/System endpoint to approve/reject verification (would be protected in production)
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { attemptId, status, rejectionReason } = await req.json();

    if (!attemptId || !status) {
      return NextResponse.json(
        { error: "Attempt ID and status are required" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be approved or rejected" },
        { status: 400 }
      );
    }

    const attempt = await prisma.verificationAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: "Verification attempt not found" },
        { status: 404 }
      );
    }

    // Update attempt
    const updatedAttempt = await prisma.verificationAttempt.update({
      where: { id: attemptId },
      data: {
        status,
        rejectionReason: status === "rejected" ? rejectionReason : null,
        reviewedAt: new Date(),
      },
    });

    // Update profile
    if (status === "approved") {
      await prisma.profile.update({
        where: { userId: attempt.userId },
        data: {
          isVerified: true,
          verificationStatus: "verified",
        },
      });
    } else {
      await prisma.profile.update({
        where: { userId: attempt.userId },
        data: {
          verificationStatus: "rejected",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Verification ${status}`,
      attempt: updatedAttempt,
    });
  } catch (error) {
    console.error("Update verification error:", error);
    return NextResponse.json(
      { error: "Failed to update verification" },
      { status: 500 }
    );
  }
}
