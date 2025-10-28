import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Using UI Avatars and Unsplash for demo images
const generateAvatarUrl = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=random&bold=true`;
};

// Demo profiles with diverse characteristics
const demoProfiles = [
  // Women
  {
    email: 'sarah.chen@demo.com',
    displayName: 'Sarah',
    birthdate: new Date(1996, 5, 15),
    bio: 'Coffee enthusiast ☕️ • Love hiking and photography 📸 • Looking for someone to explore the city with',
    gender: 'woman',
    orientation: 'straight',
    interests: ['Photography', 'Hiking', 'Coffee', 'Travel', 'Yoga'],
    height: 165,
    drinking: 'socially',
    smoking: 'never',
    wantsKids: 'maybe',
    lookingFor: 'relationship',
    prompts: [
      { question: "What's your ideal Sunday?", answer: "Brunch with friends, then a long hike in nature", answerType: 'text' },
      { question: "I geek out on...", answer: "Film photography and vintage cameras", answerType: 'text' },
    ]
  },
  {
    email: 'emma.wilson@demo.com',
    displayName: 'Emma',
    birthdate: new Date(1998, 2, 22),
    bio: 'Artist 🎨 • Dog mom to a golden retriever • Wine lover 🍷 • Spontaneous adventures are my thing',
    gender: 'woman',
    orientation: 'straight',
    interests: ['Art', 'Dogs', 'Wine', 'Music', 'Cooking'],
    height: 170,
    drinking: 'regularly',
    smoking: 'never',
    wantsKids: 'yes',
    lookingFor: 'relationship',
    prompts: [
      { question: "Two truths and a lie", answer: "I speak 3 languages, I've been to 30 countries, I can't swim", answerType: 'text' },
      { question: "The way to win me over is...", answer: "Cook me dinner and show me your vinyl collection", answerType: 'text' },
    ]
  },
  {
    email: 'maya.patel@demo.com',
    displayName: 'Maya',
    birthdate: new Date(1997, 8, 10),
    bio: 'Yoga instructor 🧘‍♀️ • Plant-based foodie 🌱 • Beach lover 🏖️ • Let\'s talk about sustainable living',
    gender: 'woman',
    orientation: 'bisexual',
    interests: ['Yoga', 'Vegan Cooking', 'Sustainability', 'Beach', 'Meditation'],
    height: 163,
    drinking: 'never',
    smoking: 'never',
    wantsKids: 'no',
    lookingFor: 'casual',
    prompts: [
      { question: "My perfect first date", answer: "Sunset yoga on the beach followed by acai bowls", answerType: 'text' },
      { question: "Green flags I look for", answer: "Environmental consciousness and emotional intelligence", answerType: 'text' },
    ]
  },
  {
    email: 'jessica.kim@demo.com',
    displayName: 'Jessica',
    birthdate: new Date(1995, 11, 5),
    bio: 'Software engineer by day 💻 • DJ by night 🎧 • Fitness junkie • Looking for someone who can keep up',
    gender: 'woman',
    orientation: 'straight',
    interests: ['Technology', 'Music', 'Fitness', 'EDM', 'Rock Climbing'],
    height: 168,
    drinking: 'socially',
    smoking: 'socially',
    wantsKids: 'maybe',
    lookingFor: 'relationship',
    prompts: [
      { question: "I'm overly competitive about...", answer: "Rock climbing routes and beat matching", answerType: 'text' },
      { question: "I won't shut up about...", answer: "Why everyone should learn to code", answerType: 'text' },
    ]
  },
  {
    email: 'olivia.martinez@demo.com',
    displayName: 'Olivia',
    birthdate: new Date(1999, 3, 18),
    bio: 'Med student 🏥 • Love trying new restaurants 🍜 • Bookworm 📚 • Netflix binge expert',
    gender: 'woman',
    orientation: 'straight',
    interests: ['Medicine', 'Food', 'Reading', 'Netflix', 'Baking'],
    height: 172,
    drinking: 'socially',
    smoking: 'never',
    wantsKids: 'yes',
    lookingFor: 'relationship',
    prompts: [
      { question: "Best travel story", answer: "Got lost in Tokyo for 8 hours, found the best ramen of my life", answerType: 'text' },
      { question: "My love language is...", answer: "Quality time and words of affirmation", answerType: 'text' },
    ]
  },
  
  // Men
  {
    email: 'alex.johnson@demo.com',
    displayName: 'Alex',
    birthdate: new Date(1995, 7, 20),
    bio: 'Marketing guru 📱 • Craft beer enthusiast 🍺 • Loves live music • Let\'s grab drinks and see where it goes',
    gender: 'man',
    orientation: 'straight',
    interests: ['Marketing', 'Craft Beer', 'Live Music', 'Basketball', 'Stand-up Comedy'],
    height: 180,
    drinking: 'regularly',
    smoking: 'never',
    wantsKids: 'maybe',
    lookingFor: 'casual',
    prompts: [
      { question: "What's your ideal Sunday?", answer: "Brunch, day drinking, and a concert at night", answerType: 'text' },
      { question: "I'm secretly really good at...", answer: "Beer pong and making people laugh", answerType: 'text' },
    ]
  },
  {
    email: 'marcus.brown@demo.com',
    displayName: 'Marcus',
    birthdate: new Date(1994, 1, 14),
    bio: 'Personal trainer 💪 • Early riser 🌅 • Meal prep king 🥗 • Looking for my gym partner in crime',
    gender: 'man',
    orientation: 'straight',
    interests: ['Fitness', 'Nutrition', 'Boxing', 'Cycling', 'Meal Prep'],
    height: 185,
    drinking: 'never',
    smoking: 'never',
    wantsKids: 'yes',
    lookingFor: 'relationship',
    prompts: [
      { question: "The key to my heart is...", answer: "Someone who shares my 6am workout dedication", answerType: 'text' },
      { question: "Most spontaneous thing I've done", answer: "Ran a marathon with only 2 weeks of training", answerType: 'text' },
    ]
  },
  {
    email: 'ryan.lee@demo.com',
    displayName: 'Ryan',
    birthdate: new Date(1996, 9, 8),
    bio: 'Architect 🏗️ • Design nerd • Loves museums and art galleries • Cooking Italian food is my therapy',
    gender: 'man',
    orientation: 'straight',
    interests: ['Architecture', 'Art', 'Cooking', 'Design', 'Italian Food'],
    height: 178,
    drinking: 'socially',
    smoking: 'never',
    wantsKids: 'yes',
    lookingFor: 'relationship',
    prompts: [
      { question: "I geek out on...", answer: "Brutalist architecture and mid-century modern design", answerType: 'text' },
      { question: "My perfect first date", answer: "Coffee at a museum, then I cook you homemade pasta", answerType: 'text' },
    ]
  },
  {
    email: 'david.anderson@demo.com',
    displayName: 'David',
    birthdate: new Date(1993, 6, 25),
    bio: 'Entrepreneur 🚀 • Travel addict ✈️ • Scuba diver 🤿 • Always planning the next adventure',
    gender: 'man',
    orientation: 'straight',
    interests: ['Entrepreneurship', 'Travel', 'Scuba Diving', 'Startups', 'Adventure'],
    height: 183,
    drinking: 'socially',
    smoking: 'never',
    wantsKids: 'maybe',
    lookingFor: 'casual',
    prompts: [
      { question: "Best travel story", answer: "Swam with whale sharks in the Philippines at sunrise", answerType: 'text' },
      { question: "I won't shut up about...", answer: "Why everyone should quit their job and travel for a year", answerType: 'text' },
    ]
  },
  {
    email: 'james.garcia@demo.com',
    displayName: 'James',
    birthdate: new Date(1997, 4, 12),
    bio: 'Teacher by day 📚 • Guitarist by night 🎸 • Love dogs and dad jokes • Seeking my co-pilot',
    gender: 'man',
    orientation: 'straight',
    interests: ['Teaching', 'Guitar', 'Dogs', 'Music', 'Reading'],
    height: 175,
    drinking: 'socially',
    smoking: 'never',
    wantsKids: 'yes',
    lookingFor: 'relationship',
    prompts: [
      { question: "Two truths and a lie", answer: "I can play 4 instruments, I've written a novel, I speak fluent Spanish", answerType: 'text' },
      { question: "My love language is...", answer: "Acts of service and quality time", answerType: 'text' },
    ]
  },

  // More diverse profiles
  {
    email: 'lily.wong@demo.com',
    displayName: 'Lily',
    birthdate: new Date(1998, 10, 30),
    bio: 'Fashion blogger 👗 • Brunch enthusiast • Shopping is my cardio 🛍️ • Looking for someone stylish',
    gender: 'woman',
    orientation: 'straight',
    interests: ['Fashion', 'Shopping', 'Brunch', 'Instagram', 'Beauty'],
    height: 160,
    drinking: 'socially',
    smoking: 'never',
    wantsKids: 'no',
    lookingFor: 'casual',
    prompts: [
      { question: "I'm overly competitive about...", answer: "Finding the best thrift store finds", answerType: 'text' },
      { question: "The way to win me over is...", answer: "Surprise me with flowers and good taste in fashion", answerType: 'text' },
    ]
  },
  {
    email: 'sophie.davis@demo.com',
    displayName: 'Sophie',
    birthdate: new Date(1996, 1, 8),
    bio: 'Nurse 🏥 • Cat mom to 2 fur babies • Horror movie fanatic 🎬 • Craft cocktail connoisseur',
    gender: 'woman',
    orientation: 'bisexual',
    interests: ['Nursing', 'Cats', 'Horror Movies', 'Cocktails', 'True Crime'],
    height: 167,
    drinking: 'regularly',
    smoking: 'socially',
    wantsKids: 'no',
    lookingFor: 'relationship',
    prompts: [
      { question: "My most controversial opinion", answer: "Pineapple DOES belong on pizza", answerType: 'text' },
      { question: "Green flags I look for", answer: "Someone who doesn't mind my obsession with true crime podcasts", answerType: 'text' },
    ]
  },
  {
    email: 'chris.taylor@demo.com',
    displayName: 'Chris',
    birthdate: new Date(1995, 12, 3),
    bio: 'Firefighter 🚒 • Adrenaline junkie • BBQ master 🍖 • Looking for someone brave',
    gender: 'man',
    orientation: 'straight',
    interests: ['Firefighting', 'BBQ', 'Motorcycles', 'Sports', 'Camping'],
    height: 188,
    drinking: 'socially',
    smoking: 'never',
    wantsKids: 'yes',
    lookingFor: 'relationship',
    prompts: [
      { question: "Most spontaneous thing I've done", answer: "Drove cross-country on my motorcycle with no plan", answerType: 'text' },
      { question: "The key to my heart is...", answer: "Someone who appreciates my smoked brisket", answerType: 'text' },
    ]
  },
  {
    email: 'ethan.moore@demo.com',
    displayName: 'Ethan',
    birthdate: new Date(1994, 5, 17),
    bio: 'Photographer 📷 • Coffee snob ☕ • Vinyl collector 🎵 • Let\'s create something beautiful together',
    gender: 'man',
    orientation: 'straight',
    interests: ['Photography', 'Coffee', 'Vinyl', 'Indie Music', 'Film'],
    height: 177,
    drinking: 'socially',
    smoking: 'socially',
    wantsKids: 'maybe',
    lookingFor: 'relationship',
    prompts: [
      { question: "I geek out on...", answer: "35mm film photography and pressing my own vinyl", answerType: 'text' },
      { question: "My perfect first date", answer: "Record store browsing, then coffee and deep conversations", answerType: 'text' },
    ]
  },
  {
    email: 'isabella.rodriguez@demo.com',
    displayName: 'Isabella',
    birthdate: new Date(1997, 7, 9),
    bio: 'Lawyer ⚖️ • Wine and true crime nights 🍷 • Pilates addict • Fluent in sarcasm',
    gender: 'woman',
    orientation: 'straight',
    interests: ['Law', 'Wine', 'Pilates', 'True Crime', 'Travel'],
    height: 169,
    drinking: 'regularly',
    smoking: 'never',
    wantsKids: 'yes',
    lookingFor: 'relationship',
    prompts: [
      { question: "Two truths and a lie", answer: "I've never lost a case, I speak 4 languages, I'm afraid of dogs", answerType: 'text' },
      { question: "I won't shut up about...", answer: "Whatever true crime documentary I just finished", answerType: 'text' },
    ]
  },
  {
    email: 'noah.williams@demo.com',
    displayName: 'Noah',
    birthdate: new Date(1996, 3, 21),
    bio: 'Scientist 🔬 • Board game enthusiast • Home brewer 🍺 • Searching for my lab partner',
    gender: 'man',
    orientation: 'straight',
    interests: ['Science', 'Board Games', 'Brewing', 'Chemistry', 'Gaming'],
    height: 182,
    drinking: 'socially',
    smoking: 'never',
    wantsKids: 'maybe',
    lookingFor: 'relationship',
    prompts: [
      { question: "I'm secretly really good at...", answer: "Brewing beer and winning at Settlers of Catan", answerType: 'text' },
      { question: "My most controversial opinion", answer: "Board games are better than video games", answerType: 'text' },
    ]
  },
  {
    email: 'ava.thompson@demo.com',
    displayName: 'Ava',
    birthdate: new Date(1995, 9, 14),
    bio: 'Graphic designer 🎨 • Anime lover • Boba tea addict 🧋 • Looking for my player 2',
    gender: 'woman',
    orientation: 'bisexual',
    interests: ['Design', 'Anime', 'Gaming', 'Boba', 'Cosplay'],
    height: 162,
    drinking: 'socially',
    smoking: 'never',
    wantsKids: 'no',
    lookingFor: 'casual',
    prompts: [
      { question: "I geek out on...", answer: "Studio Ghibli films and Animal Crossing", answerType: 'text' },
      { question: "The way to win me over is...", answer: "Take me to a boba shop and debate which anime is superior", answerType: 'text' },
    ]
  },
  {
    email: 'liam.jackson@demo.com',
    displayName: 'Liam',
    birthdate: new Date(1993, 11, 28),
    bio: 'Chef 👨‍🍳 • Foodie explorer • Craft cocktail maker • Let me cook for you',
    gender: 'man',
    orientation: 'straight',
    interests: ['Cooking', 'Food', 'Cocktails', 'Travel', 'Wine'],
    height: 179,
    drinking: 'regularly',
    smoking: 'never',
    wantsKids: 'yes',
    lookingFor: 'relationship',
    prompts: [
      { question: "My perfect first date", answer: "I cook you a 5-course meal with wine pairings", answerType: 'text' },
      { question: "I won't shut up about...", answer: "Why everyone needs to try real Japanese ramen", answerType: 'text' },
    ]
  },
  {
    email: 'mia.white@demo.com',
    displayName: 'Mia',
    birthdate: new Date(1998, 6, 7),
    bio: 'Dancer 💃 • Salsa instructor • Always moving • Looking for my dance partner',
    gender: 'woman',
    orientation: 'straight',
    interests: ['Dancing', 'Salsa', 'Music', 'Fitness', 'Latin Culture'],
    height: 164,
    drinking: 'socially',
    smoking: 'never',
    wantsKids: 'maybe',
    lookingFor: 'relationship',
    prompts: [
      { question: "The key to my heart is...", answer: "Someone who can salsa or is willing to learn", answerType: 'text' },
      { question: "Most spontaneous thing I've done", answer: "Moved to Cuba for 3 months to learn authentic salsa", answerType: 'text' },
    ]
  },
  {
    email: 'lucas.harris@demo.com',
    displayName: 'Lucas',
    birthdate: new Date(1994, 2, 19),
    bio: 'Writer ✍️ • Bookstore regular 📚 • Coffee shop dweller ☕ • Let\'s discuss literature',
    gender: 'man',
    orientation: 'straight',
    interests: ['Writing', 'Reading', 'Coffee', 'Poetry', 'Philosophy'],
    height: 176,
    drinking: 'socially',
    smoking: 'socially',
    wantsKids: 'no',
    lookingFor: 'relationship',
    prompts: [
      { question: "I geek out on...", answer: "20th century literature and existential philosophy", answerType: 'text' },
      { question: "My love language is...", answer: "Words of affirmation and quality time in bookstores", answerType: 'text' },
    ]
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing demo data (but keep test user)
  await prisma.profilePrompt.deleteMany({
    where: {
      profile: {
        user: {
          email: { not: 'test@example.com' }
        }
      }
    }
  });
  await prisma.superLike.deleteMany();
  await prisma.compliment.deleteMany();
  await prisma.boost.deleteMany();
  await prisma.standout.deleteMany();
  await prisma.like.deleteMany();
  await prisma.message.deleteMany();
  await prisma.match.deleteMany();
  await prisma.profile.deleteMany({
    where: {
      user: {
        email: { not: 'test@example.com' }
      }
    }
  });
  await prisma.user.deleteMany({
    where: {
      email: { not: 'test@example.com' }
    }
  });

  console.log('🗑️  Cleared existing data');

  // Create or update test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      emailVerified: new Date(),
      isPremium: true,
      superLikesLeft: 5,
    },
  });

  // Create or update test user profile
  await prisma.profile.upsert({
    where: { userId: testUser.id },
    update: {
      ageMin: 18,
      ageMax: 99,
    },
    create: {
      userId: testUser.id,
      displayName: 'Test User',
      birthdate: new Date(1995, 0, 1),
      bio: 'Test account for development',
      photos: JSON.stringify([generateAvatarUrl('Test User')]),
      gender: 'other',
      orientation: 'other',
      interests: JSON.stringify(['Testing', 'Development']),
      height: 170,
      drinking: 'never',
      smoking: 'never',
      wantsKids: 'maybe',
      lookingFor: 'casual',
      location: JSON.stringify({ lat: 37.7749, lon: -122.4194 }),
      isVerified: true,
      ageMin: 18,
      ageMax: 99,
    },
  });

  console.log('✅ Created/updated test user: test@example.com');

  // Create demo profiles
  for (const profileData of demoProfiles) {
    const { email, prompts, ...profile } = profileData;

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        emailVerified: new Date(),
        isPremium: Math.random() > 0.7, // 30% are premium
        superLikesLeft: 5,
      },
    });

    // Generate photos (3 photos per profile)
    const photos = [
      generateAvatarUrl(profile.displayName + ' 1'),
      generateAvatarUrl(profile.displayName + ' 2'),
      generateAvatarUrl(profile.displayName + ' 3'),
    ];

    // Create profile
    const createdProfile = await prisma.profile.create({
      data: {
        userId: user.id,
        displayName: profile.displayName,
        birthdate: profile.birthdate,
        bio: profile.bio,
        photos: JSON.stringify(photos),
        gender: profile.gender,
        orientation: profile.orientation,
        interests: JSON.stringify(profile.interests),
        height: profile.height,
        drinking: profile.drinking,
        smoking: profile.smoking,
        wantsKids: profile.wantsKids,
        lookingFor: profile.lookingFor,
        location: JSON.stringify({ lat: 37.7749 + Math.random() - 0.5, lon: -122.4194 + Math.random() - 0.5 }),
        isVerified: Math.random() > 0.5, // 50% verified
      },
    });

    // Create prompts if provided
    if (prompts) {
      for (let i = 0; i < prompts.length; i++) {
        await prisma.profilePrompt.create({
          data: {
            profileId: user.id,
            question: prompts[i].question,
            answer: prompts[i].answer,
            answerType: prompts[i].answerType,
            order: i,
          },
        });
      }
    }

    console.log(`✅ Created profile for ${profile.displayName}`);
  }

  // Create a few mutual matches for the test user
  const testUserProfile = await prisma.profile.findUnique({
    where: { userId: testUser.id },
  });

  if (testUserProfile) {
    // Get 3 random demo profiles to match with
    const allProfiles = await prisma.profile.findMany({
      where: {
        userId: { not: testUser.id },
      },
      take: 3,
    });

    for (const profile of allProfiles) {
      // Create mutual likes
      await prisma.like.create({
        data: {
          likerId: testUser.id,
          likeeId: profile.userId,
        },
      });

      await prisma.like.create({
        data: {
          likerId: profile.userId,
          likeeId: testUser.id,
        },
      });

      // Create match
      await prisma.match.create({
        data: {
          userAId: testUser.id,
          userBId: profile.userId,
        },
      });

      console.log(`❤️  Created match with ${profile.displayName}`);
    }
  }

  console.log('🎉 Seed completed successfully!');
  console.log(`📊 Created ${demoProfiles.length} demo profiles`);
  console.log(`💖 Created 3 test matches`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
