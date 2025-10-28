# 🚀 Quick Reference - Google OAuth Setup

## ⚡ TL;DR - 5 Minute Setup

```bash
# 1. Get Google credentials from https://console.cloud.google.com
# 2. Create .env.local
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"

# 3. Setup database
npx prisma migrate dev --name add_phone_and_google_fields
npx prisma generate

# 4. Run
npm run dev

# 5. Test
# → Go to http://localhost:3000
# → Click "Continue with Google"
# → Enter phone (+91 is auto-set! ✅)
# → Complete onboarding
```

---

## 📁 What Changed

| File | Change |
|------|--------|
| `auth.ts` | ✅ Added Google OAuth provider |
| `app/(auth)/signin/page.tsx` | ✅ Modern SSO sign-in page |
| `app/(auth)/onboarding/page.tsx` | ✅ 4 steps with phone (#1) |
| `prisma/schema.prisma` | ✅ Added phone, phoneVerified, name, image |

---

## 📱 New User Flow

```
Sign In Page → Click "Continue with Google"
    ↓
Google OAuth
    ↓
Onboarding Step 1: 📱 Phone (India +91 default ✅)
Onboarding Step 2: 👤 Basic Info
Onboarding Step 3: 📝 Bio & Photos
Onboarding Step 4: ⭐ Interests
    ↓
Profile Created ✅ → Feed Page
```

---

## 🔑 Environment Variables

```bash
# Required
GOOGLE_CLIENT_ID=          # From Google Cloud Console
GOOGLE_CLIENT_SECRET=      # From Google Cloud Console
NEXTAUTH_SECRET=           # Generate: openssl rand -base64 32
NEXTAUTH_URL=              # http://localhost:3000

# Existing
DATABASE_URL=              # Your database
REDIS_URL=                 # Optional
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| "Invalid client" | Check Client ID/Secret, restart app |
| "Redirect URL mismatch" | Add http://localhost:3000/api/auth/callback/google to Google Console |
| Phone shows wrong code | Clear browser cache, restart app |
| "NEXTAUTH_SECRET is not set" | Generate: `openssl rand -base64 32`, add to `.env.local` |

---

## ✅ Testing Checklist

- [ ] Google OAuth setup complete
- [ ] `.env.local` created
- [ ] Database migrated
- [ ] App starts (`npm run dev`)
- [ ] Sign-in page shows "Continue with Google"
- [ ] Google login works
- [ ] Phone field shows +91 by default
- [ ] Can complete all 4 onboarding steps
- [ ] Profile saves to database
- [ ] Can access /feed

---

## 📚 Full Guides

- **Setup**: `GOOGLE_OAUTH_SETUP.md` (complete walkthrough)
- **Summary**: `GOOGLE_OAUTH_IMPLEMENTATION_SUMMARY.md` (what was implemented)
- **Features**: `FEATURE_TEST_GUIDE.md` (test all 11 features)

---

## 🎯 Key Features

✅ Google SSO (one-click login)  
✅ Indian phone default (+91)  
✅ 4-step onboarding  
✅ JWT sessions  
✅ Auto account creation  
✅ Pre-filled Google data  

---

**Ready? Follow GOOGLE_OAUTH_SETUP.md to get started! 🚀**
