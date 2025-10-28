import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const PASSPORT_DURATION_DAYS = 7; // Passport lasts 7 days

// Get profile settings
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: {
        isIncognito: true,
        passportLocation: true,
        passportExpiresAt: true,
        location: true,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        isPremium: true,
        readReceiptsEnabled: true,
      },
    });

    if (!profile || !user) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check if passport is active
    const isPassportActive =
      profile.passportLocation &&
      profile.passportExpiresAt &&
      profile.passportExpiresAt > new Date();

    return NextResponse.json({
      settings: {
        isIncognito: profile.isIncognito,
        isPremium: user.isPremium,
        readReceiptsEnabled: user.readReceiptsEnabled,
        passport: {
          isActive: isPassportActive,
          location: isPassportActive ? profile.passportLocation : null,
          expiresAt: profile.passportExpiresAt,
          homeLocation: profile.location,
        },
      },
    });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// Update profile settings
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, ...data } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isPremium: true },
    });

    // Handle different actions
    switch (action) {
      case "toggle_incognito":
        if (!user?.isPremium) {
          return NextResponse.json(
            { error: "Incognito mode requires Premium subscription" },
            { status: 403 }
          );
        }

        const profile = await prisma.profile.update({
          where: { userId: session.user.id },
          data: { isIncognito: data.isIncognito },
        });

        return NextResponse.json({
          success: true,
          isIncognito: profile.isIncognito,
        });

      case "toggle_read_receipts":
        const updatedUser = await prisma.user.update({
          where: { id: session.user.id },
          data: { readReceiptsEnabled: data.readReceiptsEnabled },
        });

        return NextResponse.json({
          success: true,
          readReceiptsEnabled: updatedUser.readReceiptsEnabled,
        });

      case "set_passport":
        if (!user?.isPremium) {
          return NextResponse.json(
            { error: "Passport feature requires Premium subscription" },
            { status: 403 }
          );
        }

        if (!data.location || !data.location.lat || !data.location.lon) {
          return NextResponse.json(
            { error: "Valid location required" },
            { status: 400 }
          );
        }

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + PASSPORT_DURATION_DAYS);

        const passportProfile = await prisma.profile.update({
          where: { userId: session.user.id },
          data: {
            passportLocation: JSON.stringify(data.location),
            passportExpiresAt: expiresAt,
          },
        });

        return NextResponse.json({
          success: true,
          message: `Passport activated! You'll appear in ${data.locationName || 'new location'} for 7 days.`,
          passport: {
            location: passportProfile.passportLocation,
            expiresAt: passportProfile.passportExpiresAt,
          },
        });

      case "cancel_passport":
        const cancelledProfile = await prisma.profile.update({
          where: { userId: session.user.id },
          data: {
            passportLocation: null,
            passportExpiresAt: null,
          },
        });

        return NextResponse.json({
          success: true,
          message: "Passport cancelled. You're back to your home location.",
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
