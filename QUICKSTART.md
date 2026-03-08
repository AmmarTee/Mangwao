# Quick Start Guide - Mangwao

Follow these steps to get Mangwao running locally in under 10 minutes.

## Prerequisites Check

```bash
node --version  # Should be 18+
npm --version
```

If not installed, download from https://nodejs.org/

## Step 1: Install Dependencies

```bash
cd e:/Personal-Projects/App
npm install
```

## Step 2: Set Up Supabase

1. Go to https://supabase.com and create a free account
2. Create a new project (choose a region close to Pakistan)
3. Wait for project to be ready (~2 minutes)

### Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Open the file `supabase-schema.sql` from this project
3. Copy **all contents** and paste into SQL Editor
4. Click **Run** (green play button)
5. You should see "Success. No rows returned"

### Create Storage Buckets

1. In Supabase, go to **Storage**
2. Create these 4 buckets (click **New bucket**):
   - `rider-documents` (Private)
   - `order-photos` (Private)
   - `dispute-evidence` (Private)
   - `payment-screenshots` (Private)

### Get Your Credentials

1. Go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string)

## Step 3: Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` and paste your Supabase credentials:
   ```env
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=your_long_anon_key_here
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here  # Optional for now
   ```

## Step 4: Confirm Expo CLI

```bash
npx expo --version
```

## Step 5: Start the App (Expo SDK 54)

```bash
npx expo start
```

This will:
- Start the Expo development server
- Open Expo DevTools in your browser
- Show a QR code

## Step 6: Run on Device/Emulator

### Option A: Physical Device (Easiest)

1. Install **Expo Go** app from Play Store (Android) or App Store (iOS)
2. Scan the QR code from terminal
3. App will load on your phone

### Option B: Android Emulator

1. Install Android Studio
2. Set up an Android emulator
3. Run: `npx expo start --android`

### Option C: iOS Simulator (Mac only)

1. Install Xcode
2. Run: `npx expo start --ios`

## Step 7: Test the App

### Create a Customer Account

1. App opens to auth screen
2. Enter your email (any email works)
3. Check email for magic link
4. Click the link → You're signed in!

### Create a Test Rider

1. Sign in with a different email
2. In Supabase dashboard, go to **Table Editor** → **users**
3. Find the user you just created
4. Edit the row and change `role` from `customer` to `rider`
5. Sign out and sign in again → You'll see Rider app!

### Create Your First Order

1. Sign in as customer
2. Tap **+ New Delivery Order**
3. Fill in pickup and drop details
4. Enter item description
5. Toggle "Package is sealed" → ON
6. Tap **Calculate Price**
7. Tap **Create Order**
8. Order created!

## Common Issues

### "Cannot find module '@env'"

```bash
# Clear cache and restart
npx expo start -c
```

### Magic Link Not Arriving

1. Check spam folder
2. In Supabase, go to **Authentication** → **Email Templates**
3. Verify email settings are correct

### "Failed to create order"

1. Check Supabase logs: **Project Dashboard** → **Logs**
2. Verify the SQL schema ran successfully
3. Ensure user is authenticated

### App Won't Load

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npx expo start -c
```

## Next Steps

Once you've confirmed the app works:

1. [ ] Read [README.md](README.md) for full documentation
2. [ ] Check [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) for roadmap
3. [ ] Set up Google Maps for live tracking (optional for testing)
4. [ ] Invite team members to test

## Admin Panel

To view the admin panel:

```bash
cd admin
python -m http.server 8000
# Or: npx serve
```

Open http://localhost:8000

## Need Help?

- Check README.md for detailed setup
- Review database-schema.md for data structure
- Inspect Supabase logs for backend errors

## Success Checklist

- [ ] App starts without errors
- [ ] Can receive magic link email
- [ ] Can sign in as customer
- [ ] Can create a delivery order
- [ ] Can switch user role to rider
- [ ] Rider dashboard loads
- [ ] Admin panel opens in browser

If all checked, you're ready to continue development.

## Supabase CLI (Optional)

If you want a local Supabase environment:

```bash
npm install -g supabase
supabase start
```
