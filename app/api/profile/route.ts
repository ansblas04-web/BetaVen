import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({ profile });
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Check if profile already exists
  const existingProfile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (existingProfile) {
    return NextResponse.json(
      { error: "Profile already exists. Use PUT to update." },
      { status: 409 }
    );
  }

  // Validate required fields
  if (!body.displayName || !body.birthdate || !body.gender) {
    return NextResponse.json(
      { error: "Missing required fields: displayName, birthdate, gender" },
      { status: 400 }
    );
  }

  // Create profile data
  const profileData: any = {
    userId: session.user.id,
    displayName: body.displayName,
    birthdate: new Date(body.birthdate),
    gender: body.gender,
    orientation: body.orientation || null,
    bio: body.bio || null,
    interests: JSON.stringify(body.interests || []),
    photos: JSON.stringify([]), // Default empty photos
    dealbreakers: JSON.stringify({}),
    ageMin: body.ageMin || 18,
    ageMax: body.ageMax || 99,
    distanceMax: body.distanceMax || 50,
  };

  try {
    const profile = await prisma.profile.create({
      data: profileData,
    });

    return NextResponse.json({ profile, message: "Profile created successfully" });
  } catch (error: any) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: "Failed to create profile", message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Prepare update data
  const updateData: any = {
    displayName: body.displayName,
    bio: body.bio || null,
    height: body.height || null,
    drinking: body.drinking || null,
    smoking: body.smoking || null,
    wantsKids: body.wantsKids || null,
    lookingFor: body.lookingFor || null,
    ageMin: body.ageMin || 18,
    ageMax: body.ageMax || 99,
  };

  // Handle arrays/JSON fields
  if (body.interests) {
    updateData.interests = JSON.stringify(body.interests);
  }

  // Only update birthdate if provided and valid
  if (body.birthdate) {
    updateData.birthdate = new Date(body.birthdate);
  }

  // Only update gender/orientation if provided
  if (body.gender) updateData.gender = body.gender;
  if (body.orientation) updateData.orientation = body.orientation;

  const profile = await prisma.profile.update({
    where: { userId: session.user.id },
    data: updateData,
  });

  return NextResponse.json({ profile });
}
