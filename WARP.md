# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

"Dirty Nobita" is a web-based dating platform combining features from Tinder, Bumble, Hinge, and Pure. Built with Next.js 16 (App Router), TypeScript, Prisma, and PostgreSQL with PostGIS for geolocation.

## Essential Commands

### Setup & Installation
```bash
# Install dependencies
npm install --legacy-peer-deps

# Start local database and Redis
docker compose up -d

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name <migration-name>

# Start development server
npm run dev  # Opens at http://localhost:3000
```

### Development Workflow
```bash
# Lint code
npm run lint

# Typecheck (no dedicated script - run manually)
npx tsc --noEmit

# Build for production
npm run build

# Database GUI
npx prisma studio

# After schema changes
npx prisma migrate dev --name <migration-name>
npx prisma generate
```

### Docker Services
```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f postgres
docker compose logs -f redis
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with PostGIS extension (via postgis/postgis:16-3.4-alpine)
- **ORM**: Prisma with custom generator output at `app/generated/prisma`
- **Cache/Queue**: Redis 7
- **Auth**: NextAuth v5 (beta.29) with Prisma adapter, JWT sessions
- **Components**: Radix UI primitives via shadcn/ui

### App Directory Structure

The app uses Next.js 16 App Router with route groups:

- **`app/(auth)/`** - Unauthenticated pages
  - `/signin` - Authentication page
  - `/onboarding` - New user profile setup

- **`app/(app)/`** - Protected app pages (requires authentication)
  - `/feed` - Swipe deck for discovering profiles
  - `/matches` - List of mutual matches
  - `/matches/[matchId]` - Chat with specific match
  - `/profile` - User's own profile management

- **`app/api/`** - API routes
  - `/api/auth/[...nextauth]` - NextAuth handlers
  - `/api/feed` - Fetch profiles for swiping
  - `/api/likes/[userId]` - Create likes
  - `/api/matches` - Retrieve matches
  - `/api/matches/[matchId]` - Messages for match
  - `/api/profile` - CRUD operations for user profile
  - `/api/health` - Health check endpoint

- **`app/generated/`** - Prisma client output (not in version control)

### Authentication Flow

**NextAuth v5 Configuration**:
- Config split: `auth.config.ts` (edge-compatible) + `auth.ts` (full config)
- Adapter: `@auth/prisma-adapter` connects NextAuth to Prisma User model
- Session: JWT strategy (not database sessions)
- Protected routes: middleware checks `auth?.user` via `authorized()` callback
- Redirects: unauthenticated → `/auth/signin`, new users → `/onboarding`

**Key Files**:
- `auth.ts` - NextAuth instance with Prisma adapter
- `auth.config.ts` - Authorization logic and page redirects
- `lib/prisma.ts` - Singleton Prisma client (prevents hot-reload connection leaks)

### Database Schema (Prisma)

**Core Models**:
- **User** - Authentication base (email, timestamps)
- **Profile** - Display data (name, bio, photos, location, preferences, age/distance filters)
- **Like** - Swipe right with optional comment (Hinge-style)
- **Match** - Created on mutual like; supports timers (`expiresAt`) and initiator rules (`initiatorId`, `hasFirstMessage`)
- **Message** - Chat messages with `readAt` (read receipts) and `ephemeralUntil` (disappearing messages)
- **KinkTag** & **UserKink** - Consent-based preference taxonomy with visibility controls
- **Block** & **Report** - Safety/moderation features

**Important Relationships**:
- User ↔ Profile: One-to-one, cascade delete
- User ↔ Like: Bidirectional (`likes_given`, `likes_received`)
- User ↔ Match: Bidirectional (`matches_a`, `matches_b`)
- Match ↔ Message: One-to-many with cascade delete

**PostGIS Note**: The `Profile.location` field stores JSON `{lat, lon}` but can be migrated to PostGIS geometry types for advanced spatial queries.

### Component Architecture

**Reusable Components** (`components/`):
- **`feed/SwipeCard.tsx`** - Card-based profile display with like/pass actions
- **`nav/BottomNav.tsx`** - Fixed bottom navigation (Feed, Matches, Profile)
- **`ui/`** - shadcn/ui components (Button, Card, Avatar, Dialog, etc.)

**Patterns**:
- Client components marked with `"use client"`
- Server components by default in App Router
- Use `usePathname()` for active route detection
- Tailwind classes with `clsx` and `tailwind-merge` via `lib/utils.ts`

### Key Configuration Files

- **`prisma/schema.prisma`** - Database schema (run migrations after changes)
- **`docker-compose.yml`** - Local Postgres (port 5432) and Redis (port 6379)
- **`.env`** - Local environment variables (gitignored)
- **`.env.example`** - Template for required env vars
- **`components.json`** - shadcn/ui configuration (uses Tailwind v4)
- **`tsconfig.json`** - TypeScript with path aliases (`@/*`)

## Development Guidelines

### When Adding Features

1. **Update Prisma schema** if new models/fields needed → run `npx prisma migrate dev --name <name>` → run `npx prisma generate`
2. **Create API routes** in `app/api/` for data operations (use `lib/prisma.ts` singleton)
3. **Add UI pages/components** in `app/(app)/` or `app/(auth)/` (respect route groups)
4. **Use auth session** via `import { auth } from "@/auth"` in Server Components or API routes
5. **Run lint and typecheck** before committing: `npm run lint && npx tsc --noEmit`

### shadcn/ui Components

Add new shadcn/ui components via CLI:
```bash
npx shadcn@latest add <component-name>
```

Components install to `components/ui/` with Tailwind v4 compatibility.

### Environment Variables

**Required**:
- `DATABASE_URL` - Postgres connection (docker-compose default works locally)
- `NEXTAUTH_URL` - App URL (http://localhost:3000 for dev)
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`

**Optional** (for full features):
- `REDIS_URL` - Redis connection
- Email provider vars for magic links
- OAuth provider credentials (Google, Apple)
- S3-compatible storage for media uploads

### Database Access

- **In API routes/Server Components**: `import { prisma } from "@/lib/prisma"`
- **Never**: Create new `PrismaClient()` instances directly (causes connection pool issues)
- **Prisma Studio**: Run `npx prisma studio` to browse/edit data at http://localhost:5555

### NextAuth v5 Beta Notes

- Import `auth` for Server Components: `import { auth } from "@/auth"`
- Import `signIn`/`signOut` for actions: `import { signIn, signOut } from "@/auth"`
- Session shape: `{ user: { email, id } }` (no default `name` or `image` unless added to JWT callback)
- Middleware: Not explicitly defined yet; authorization via `authorized()` callback in `auth.config.ts`

## Project Roadmap

See `docs/dating-web-plan.md` for detailed feature milestones.
See `docs/NEW_FEATURES.md` for comprehensive documentation of recently added features.

**Current Phase**: Enhanced MVP with premium features

**Implemented**:
- ✅ Super Likes (Tinder-style) with daily limits and auto-reset
- ✅ Standouts/Top Picks (Hinge-style) with compatibility scoring
- ✅ Profile Prompts (Hinge-style) with text/voice support
- ✅ Comment-on-Like (Hinge-style) on any profile field
- ✅ Compliments (Bumble-style) pre-match engagement
- ✅ Boost (Tinder/Bumble-style) 30-minute visibility increase
- ✅ Premium subscription system
- ✅ Enhanced profile fields (height, lifestyle, dealbreakers)
- ✅ Verification system foundation

**Next Up**: Match timers (Bumble), read receipts, incognito mode, Passport, ephemeral messages (Pure)

## New API Routes

Recently added routes for new features:

- **Super Likes**:
  - `POST /api/superlikes/[userId]` - Send Super Like with optional message
  - `GET /api/superlikes/[userId]` - Get Super Likes received

- **Standouts**:
  - `GET /api/standouts` - Get daily curated top picks
  - `PATCH /api/standouts` - Mark standout as viewed/liked

- **Compliments**:
  - `POST /api/compliments` - Send pre-match compliment
  - `GET /api/compliments` - Get compliments received

- **Boost**:
  - `POST /api/boost` - Activate 30-minute visibility boost
  - `GET /api/boost` - Get current boost status

- **Prompts**:
  - `GET /api/profile/prompts` - Get user's profile prompts
  - `POST /api/profile/prompts` - Add new prompt (max 5)
  - `DELETE /api/profile/prompts` - Remove prompt

## Enhanced Components

**New Components**:
- `components/feed/EnhancedSwipeCard.tsx` - Advanced swipe card with Super Like, comment-on-like, photo carousel, verified badge, boost indicator
- `app/(app)/standouts/page.tsx` - Daily curated matches page with compatibility scores

**Updated Navigation**:
- Bottom nav now includes Standouts tab (⭐) between Feed and Matches
