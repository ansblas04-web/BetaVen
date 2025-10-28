# 🔐 Google OAuth Setup Guide - Dirty Nobita

**Updated**: October 28, 2025  
**Status**: Easy 5-minute setup

---

## 📋 What's Changed

✅ **Modern Google SSO Authentication**
- One-click sign in with Google
- No password needed
- Automatic account creation
- Beautiful modern sign-in page

✅ **Phone Number Collection**
- Indian country code (+91) selected by default 🇮🇳
- Easy 10-digit phone input
- Collected during onboarding
- Used for future verification

✅ **Better User Experience**
- 4-step onboarding process
- Phone → Name → Basic Info → Bio → Interests
- Pre-filled data from Google (name, avatar)

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click **"Select a Project"** → **"NEW PROJECT"**
4. Name it: `Dirty Nobita` → Click **CREATE**
5. Wait for the project to be created (1-2 min)

### Step 2: Enable OAuth 2.0

1. In the sidebar, go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. You'll see: **"To create an OAuth client ID, you must first create an OAuth consent screen"**
4. Click **"CONFIGURE CONSENT SCREEN"**

### Step 3: Create OAuth Consent Screen

1. **User Type**: Select **"External"** → Click **CREATE**
2. **App Information**:
   - App name: `Dirty Nobita`
   - User support email: `your-email@gmail.com`
   - Developer contact: `your-email@gmail.com`
3. Click **SAVE AND CONTINUE** (3 times, skip optional fields)
4. On the final page, click **BACK TO DASHBOARD**

### Step 4: Create OAuth Client

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. **Application type**: Select **"Web application"**
4. **Name**: `Dirty Nobita Web Client`
5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:3000/api/auth/callback/google
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Click **CREATE**

### Step 5: Copy Your Credentials

You'll see a popup with:
- **Client ID** (copy this)
- **Client Secret** (copy this)

---

## 🔑 Environment Setup

### Local Development

1. Create or edit `.env.local` in your project root:

```bash
# Google OAuth
GOOGLE_CLIENT_ID="paste-your-client-id-here"
GOOGLE_CLIENT_SECRET="paste-your-client-secret-here"

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dating_db"
```

2. Replace:
   - `paste-your-client-id-here` → Your Client ID from Step 5
   - `paste-your-client-secret-here` → Your Client Secret from Step 5
   - Generate `NEXTAUTH_SECRET` by running:
     ```bash
     openssl rand -base64 32
     ```

3. Save the file

---

## 🧪 Test the Setup

### Start the App

```bash
npm run dev
```

Open http://localhost:3000 in your browser

### Test Sign In

1. Click **"Continue with Google"**
2. Sign in with your Google account
3. You'll be redirected to onboarding
4. **Step 1**: Enter phone number (India is default ✅)
5. **Step 2**: Confirm name, date of birth, gender, orientation
6. **Step 3**: Add bio and photos (optional)
7. **Step 4**: Select interests
8. Click **"Complete Profile"**
9. ✅ You're in! Go to `/feed`

---

## 📱 What Users See

### Sign In Page
- Beautiful modern design
- "Continue with Google" button
- Features preview (Super Likes, Top Picks, Verified)
- No password confusion

### Onboarding Flow
1. **📱 Phone Number**
   - Indian flag 🇮🇳 with +91 country code
   - Easy 10-digit input
   - Pre-filled message: "India is set as default"

2. **👤 Basic Info**
   - Name (pre-filled from Google)
   - Date of birth
   - Gender
   - Orientation

3. **📝 Bio & Photos**
   - Bio text (optional)
   - Photo upload (coming soon)

4. **⭐ Interests**
   - Select interests from list
   - Multiple selection allowed

---

## 🔄 For Production Deployment

### Update Google OAuth Credentials

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to **APIs & Services** → **Credentials**
3. Click your OAuth 2.0 Client ID
4. Add your production domain:

   **Authorized JavaScript origins**:
   ```
   https://yourdomain.com
   https://www.yourdomain.com
   ```

   **Authorized redirect URIs**:
   ```
   https://yourdomain.com/api/auth/callback/google
   https://www.yourdomain.com/api/auth/callback/google
   ```

5. Click **SAVE**

### Update Production .env

```bash
GOOGLE_CLIENT_ID="your-production-client-id"
GOOGLE_CLIENT_SECRET="your-production-client-secret"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-new-random-secret"
```

---

## 📊 Database Changes

### New Fields in User Model

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  phone         String?   // New: Phone number with country code
  phoneVerified DateTime? // New: When phone was verified
  name          String?   // New: From Google or user
  image         String?   // New: Avatar from Google
  // ... rest of fields
}
```

### Migration

The changes have already been added to `prisma/schema.prisma`. To apply:

```bash
npx prisma migrate dev --name add_phone_and_google_fields
npx prisma generate
```

---

## ✅ Checklist

- [ ] Google Cloud Project created
- [ ] OAuth consent screen configured
- [ ] OAuth client created
- [ ] Client ID copied
- [ ] Client Secret copied
- [ ] `.env.local` created with credentials
- [ ] `NEXTAUTH_SECRET` generated
- [ ] App started with `npm run dev`
- [ ] Test sign-in works
- [ ] Phone input shows Indian code by default
- [ ] Onboarding completes successfully
- [ ] Profile created in database

---

## 🐛 Troubleshooting

### "Invalid client" Error
**Problem**: Google credentials are wrong
**Solution**: 
1. Double-check Client ID and Secret
2. Ensure no extra spaces
3. Restart the app: `Ctrl+C` then `npm run dev`

### "Redirect URL mismatch"
**Problem**: Google doesn't recognize the redirect URL
**Solution**:
1. Verify in Google Cloud Console that `http://localhost:3000/api/auth/callback/google` is listed
2. Clear browser cache (`Ctrl+Shift+Del`)
3. Try in incognito window

### Phone number not collecting
**Problem**: Phone input is skipped
**Solution**:
1. Check onboarding step counter (should show "Step 1 of 4")
2. Verify `.env.local` is loaded (restart app)
3. Check browser console for errors

### "NEXTAUTH_SECRET is not set"
**Problem**: Missing environment variable
**Solution**:
```bash
# Generate secret
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET="paste-the-generated-value"

# Restart app
npm run dev
```

---

## 🎯 Features Now Available

### User Authentication
- ✅ Google SSO sign-up/sign-in
- ✅ Automatic account creation
- ✅ JWT session management
- ✅ Phone collection (India default)

### User Profile
- ✅ Name (from Google or manual)
- ✅ Avatar (from Google)
- ✅ Phone number (+91 format)
- ✅ Birthdate, gender, orientation
- ✅ Bio, interests, lifestyle

### Coming Next
- [ ] Phone verification (SMS OTP)
- [ ] Other OAuth providers (Apple, GitHub)
- [ ] Email verification
- [ ] Password reset flow
- [ ] Profile editing after signup

---

## 💡 Security Notes

1. **Never commit `.env.local`** to git
2. **Client Secret is private** - keep it safe
3. **Use HTTPS in production** (required by Google)
4. **NEXTAUTH_SECRET should be random** (use openssl)
5. **Redirect URIs must match exactly** (including protocol)

---

## 📞 Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review app logs: `npm run dev` (shows errors)
3. Check browser console: `F12` → **Console** tab
4. Google OAuth docs: https://developers.google.com/identity/protocols/oauth2

---

## 🎉 Next Steps

After setup is working:

1. **Test the complete flow**:
   - Sign out: `/api/auth/signout`
   - Sign in again
   - Verify phone has +91
   - Complete onboarding

2. **Create your test account**:
   - Use your real Google account
   - Add real phone number
   - Upload profile photos
   - Start testing features!

3. **Invite others to test**:
   - Share local IP: `http://192.168.x.x:3000`
   - Get feedback on UX
   - Test matches and chat

---

**Setup Complete! Ready to date! 🚀💕**

*Built with Next.js + TypeScript + NextAuth + Google OAuth*
