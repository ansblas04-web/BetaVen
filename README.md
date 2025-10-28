# Dirty Nobita

An elegant, web-based dating platform combining the best features from Tinder, Bumble, Hinge, and Pure.

## Architecture

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with PostGIS (geolocation), Prisma ORM
- **Cache/Queue**: Redis
- **Auth**: NextAuth v5 with Prisma adapter, JWT sessions
- **Deployment**: Vercel (or similar)

## Features (Planned)

### MVP
- Email/OAuth authentication with age gating
- Rich profiles: photos, bio, prompts, voice notes
- Location-based matching with distance filters
- Swipe deck with like/pass
- Mutual match chat system
- Preferences: gender, orientation, age, interests, kinks (consent-based)
- Safety: report, block, verification pipeline

### Phase 2+
- Super Like / Rose, Standouts/Top Picks
- Comment-on-like (Hinge-style)
- Read receipts (opt-in), incognito mode
- Match timers and initiator rules (Bumble-style)
- Ephemeral/disappearing messages (Pure-style)
- In-chat voice/video, Passport (location change)

## Local Development

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- npm

### Setup

1. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start database and Redis**
   ```bash
   docker compose up -d
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env and add a real NEXTAUTH_SECRET:
   # openssl rand -base64 32
   ```

4. **Run Prisma migrations**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Start dev server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### Development Workflow

- **Lint**: `npm run lint`
- **Typecheck**: `npx tsc --noEmit`
- **Build**: `npm run build`
- **Prisma Studio**: `npx prisma studio` (database GUI)

### Database Migrations

After changing `prisma/schema.prisma`:
```bash
npx prisma migrate dev --name <migration-name>
npx prisma generate
```

## Project Structure

```
dating-app/
├── app/
│   ├── api/           # API routes
│   ├── (auth)/        # Auth pages (signin, onboarding)
│   ├── (app)/         # Protected app pages (feed, matches, profile)
│   └── generated/     # Prisma client
├── components/        # React components
│   └── ui/            # shadcn/ui components
├── lib/               # Utilities
├── prisma/            # Prisma schema and migrations
├── docs/              # Planning and architecture docs
├── auth.ts            # NextAuth config
└── docker-compose.yml # Local Postgres + Redis
```

## Data Model

Core models:
- **User**: Auth, email, timestamps
- **Profile**: Display name, bio, photos, location, preferences
- **Like**: Swipe right with optional comment
- **Match**: Mutual like creates match, supports timers/initiators
- **Message**: Chat messages with read receipts and ephemeral support
- **KinkTag** & **UserKink**: Consent-based preference taxonomy
- **Block** & **Report**: Safety and moderation

See `prisma/schema.prisma` for details.

## Contributing

1. Create a feature branch
2. Make changes and test locally
3. Run lint and typecheck: `npm run lint && npx tsc --noEmit`
4. Commit and push
5. Open a PR

## Deployment

1. Push to GitHub
2. Connect to Vercel (or deployment platform)
3. Set environment variables (DATABASE_URL, NEXTAUTH_SECRET, etc.)
4. Deploy

## Roadmap

See `docs/dating-web-plan.md` for detailed feature plan and milestones.

## License

Proprietary
