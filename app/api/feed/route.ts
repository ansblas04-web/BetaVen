import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true, likesGiven: true, blocksGiven: true },
  });

  if (!currentUser?.profile) {
    // Return 20 demo profiles with scenic photos
    const scenic = [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1443890923422-7819ed4101c0?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1465145177017-c5b156cd4d4a?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
    ];

    const names = [
      "Aarav","Isha","Kabir","Meera","Vihaan","Anaya","Arjun","Kiara","Rohan","Siya",
      "Dev","Tara","Aditya","Nisha","Kunal","Riya","Sameer","Pooja","Ishaan","Aanya",
    ];

    const demoProfiles = Array.from({ length: 20 }).map((_, i) => ({
      userId: `demo-${i + 1}`,
      displayName: names[i],
      birthdate: new Date(1993 + (i % 10), (i * 3) % 12, (i * 7) % 28 + 1),
      bio: [
        "Coffee snob, weekend trekker, and amateur chef.",
        "Designer by day, salsa dancer by night.",
        "Pet parent. Marathon runner. Chai > Coffee.",
        "Book hoarder and sunset chaser.",
        "Beach > mountains (most days).",
      ][i % 5],
      interests: [
        ["Travel","Fitness","Music"],
        ["Art","Music","Movies"],
        ["Running","Reading","Food"],
        ["Photography","Nature","Yoga"],
        ["Cooking","Hiking","Tech"],
      ][i % 5],
      photos: [
        scenic[i % scenic.length],
        scenic[(i + 3) % scenic.length],
        scenic[(i + 6) % scenic.length],
      ],
      height: 160 + (i % 25),
      lookingFor: ["relationship","friendship","casual"][i % 3],
      drinking: ["never","socially","regularly"][i % 3],
      smoking: ["never","socially"][i % 2],
      wantsKids: ["yes","no","maybe"][i % 3],
      isVerified: i % 2 === 0,
      prompts: [],
    }));

    return NextResponse.json({ profiles: demoProfiles, demo: true });
  }

  // Use default age range if not set
  const ageMin = currentUser.profile.ageMin || 18;
  const ageMax = currentUser.profile.ageMax || 99;

  // Get IDs of users already liked or blocked
  const excludedIds = [
    session.user.id,
    ...currentUser.likesGiven.map((l) => l.likeeId),
    ...currentUser.blocksGiven.map((b) => b.blockedId),
  ];

  // Calculate age range dates
  const today = new Date();
  const maxBirthdate = new Date(
    today.getFullYear() - ageMin,
    today.getMonth(),
    today.getDate()
  );
  const minBirthdate = new Date(
    today.getFullYear() - ageMax,
    today.getMonth(),
    today.getDate()
  );

  // Fetch candidates
  const candidates = await prisma.profile.findMany({
    where: {
      userId: { notIn: excludedIds },
      birthdate: {
        gte: minBirthdate,
        lte: maxBirthdate,
      },
      // TODO: Add distance filtering using PostGIS
      // TODO: Add gender/orientation filters
    },
    take: 20,
    orderBy: { updatedAt: "desc" }, // Simple ranking for now
    include: {
      user: { select: { id: true } },
      prompts: true,
    },
  });

  // Calculate ages and format response
  const profiles = candidates.map((profile) => {
    const age = Math.floor(
      (today.getTime() - new Date(profile.birthdate).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );

    return {
      userId: profile.userId,
      displayName: profile.displayName,
      birthdate: profile.birthdate,
      age,
      bio: profile.bio,
      interests: profile.interests,
      photos: profile.photos,
      height: profile.height,
      lookingFor: profile.lookingFor,
      drinking: profile.drinking,
      smoking: profile.smoking,
      wantsKids: profile.wantsKids,
      isVerified: profile.isVerified,
      prompts: profile.prompts,
    };
  });

  return NextResponse.json({ profiles });
}
