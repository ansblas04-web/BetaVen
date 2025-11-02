-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "premiumExpiresAt" DATETIME,
    "superLikesLeft" INTEGER NOT NULL DEFAULT 5,
    "superLikesResetAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readReceiptsEnabled" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Profile" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT NOT NULL,
    "birthdate" DATETIME NOT NULL,
    "bio" TEXT,
    "photos" TEXT NOT NULL DEFAULT '[]',
    "voiceNoteUrl" TEXT,
    "gender" TEXT,
    "orientation" TEXT,
    "interests" TEXT NOT NULL DEFAULT '[]',
    "location" TEXT,
    "passportLocation" TEXT,
    "passportExpiresAt" DATETIME,
    "lookingFor" TEXT,
    "dealbreakers" TEXT NOT NULL DEFAULT '{}',
    "ageMin" INTEGER NOT NULL DEFAULT 18,
    "ageMax" INTEGER NOT NULL DEFAULT 99,
    "distanceMax" INTEGER NOT NULL DEFAULT 50,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" TEXT NOT NULL DEFAULT 'unverified',
    "isIncognito" BOOLEAN NOT NULL DEFAULT false,
    "height" INTEGER,
    "drinking" TEXT,
    "smoking" TEXT,
    "wantsKids" TEXT,
    "religion" TEXT,
    "politics" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Like" (
    "likerId" TEXT NOT NULL,
    "likeeId" TEXT NOT NULL,
    "comment" TEXT,
    "commentOnField" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("likerId", "likeeId"),
    CONSTRAINT "Like_likerId_fkey" FOREIGN KEY ("likerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Like_likeeId_fkey" FOREIGN KEY ("likeeId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userAId" TEXT NOT NULL,
    "userBId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "initiatorId" TEXT,
    "hasFirstMessage" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Match_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" DATETIME,
    "ephemeralUntil" DATETIME,
    CONSTRAINT "Message_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KinkTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserKink" (
    "userId" TEXT NOT NULL,
    "kinkId" TEXT NOT NULL,
    "consent" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,

    PRIMARY KEY ("userId", "kinkId"),
    CONSTRAINT "UserKink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserKink_kinkId_fkey" FOREIGN KEY ("kinkId") REFERENCES "KinkTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Block" (
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("blockerId", "blockedId"),
    CONSTRAINT "Block_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Block_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reporterId" TEXT NOT NULL,
    "reportedId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SuperLike" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "likerId" TEXT NOT NULL,
    "likeeId" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "SuperLike_likerId_fkey" FOREIGN KEY ("likerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SuperLike_likeeId_fkey" FOREIGN KEY ("likeeId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProfilePrompt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "answerType" TEXT NOT NULL DEFAULT 'text',
    "voiceUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProfilePrompt_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Compliment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Compliment_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Compliment_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Boost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Boost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Standout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "standoutUserId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "compatibilityScore" REAL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isViewed" BOOLEAN NOT NULL DEFAULT false,
    "isLiked" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "VerificationAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "pose" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "rejectionReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Like_likeeId_idx" ON "Like"("likeeId");

-- CreateIndex
CREATE INDEX "Like_createdAt_idx" ON "Like"("createdAt");

-- CreateIndex
CREATE INDEX "Match_userAId_idx" ON "Match"("userAId");

-- CreateIndex
CREATE INDEX "Match_userBId_idx" ON "Match"("userBId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_userAId_userBId_key" ON "Match"("userAId", "userBId");

-- CreateIndex
CREATE INDEX "Message_matchId_idx" ON "Message"("matchId");

-- CreateIndex
CREATE INDEX "Message_sentAt_idx" ON "Message"("sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "KinkTag_name_key" ON "KinkTag"("name");

-- CreateIndex
CREATE INDEX "UserKink_userId_idx" ON "UserKink"("userId");

-- CreateIndex
CREATE INDEX "Block_blockedId_idx" ON "Block"("blockedId");

-- CreateIndex
CREATE INDEX "Report_reportedId_idx" ON "Report"("reportedId");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "SuperLike_likeeId_idx" ON "SuperLike"("likeeId");

-- CreateIndex
CREATE INDEX "SuperLike_createdAt_idx" ON "SuperLike"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SuperLike_likerId_likeeId_key" ON "SuperLike"("likerId", "likeeId");

-- CreateIndex
CREATE INDEX "ProfilePrompt_profileId_idx" ON "ProfilePrompt"("profileId");

-- CreateIndex
CREATE INDEX "Compliment_receiverId_idx" ON "Compliment"("receiverId");

-- CreateIndex
CREATE INDEX "Compliment_createdAt_idx" ON "Compliment"("createdAt");

-- CreateIndex
CREATE INDEX "Boost_userId_idx" ON "Boost"("userId");

-- CreateIndex
CREATE INDEX "Boost_expiresAt_idx" ON "Boost"("expiresAt");

-- CreateIndex
CREATE INDEX "Boost_isActive_idx" ON "Boost"("isActive");

-- CreateIndex
CREATE INDEX "Standout_userId_date_idx" ON "Standout"("userId", "date");

-- CreateIndex
CREATE INDEX "Standout_standoutUserId_idx" ON "Standout"("standoutUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Standout_userId_standoutUserId_date_key" ON "Standout"("userId", "standoutUserId", "date");

-- CreateIndex
CREATE INDEX "VerificationAttempt_userId_idx" ON "VerificationAttempt"("userId");

-- CreateIndex
CREATE INDEX "VerificationAttempt_status_idx" ON "VerificationAttempt"("status");
