# Mangwao - Food Delivery App

A crowd-sourced food delivery platform built with React Native (Expo) and Supabase, designed for Burewala, Pakistan.

## Features

### Customer App
- Email magic link authentication
- Create delivery orders with pickup/drop details
- Distance-based pricing calculator
- In-app OTP display for pickup/drop verification
- Real-time order tracking with Google Maps (react-native-maps)
- Rate riders and report issues
- COD & manual transfer payments

### Rider App
- KYC submission (CNIC, selfie, bike papers)
- Three-tier system (Basic/Premium/Gold)
- Online/offline availability toggle
- Job feed with nearby orders
- Photo capture for pickup/drop verification
- OTP verification (cached locally)
- Live location tracking
- Earnings dashboard
- Strike system & ratings

### Trust & Safety
- Mandatory package sealing confirmation
- Photo proof at pickup and drop
- OTP verification at both ends (in-app only, no SMS)
- Rating system (bidirectional)
- Dispute ticketing system
- Restricted items enforcement (no alcohol, cigarettes, narcotics)
- Rider deposit system by tier

## Tech Stack

- **Mobile**: React Native (Expo)
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Maps**: Google Maps (react-native-maps)
- **Language**: TypeScript
- **State Management**: React Context
- **Navigation**: React Navigation

## Color Scheme (Trustworthy Design)

- Primary: Deep Navy `#1a3a52` (Trust, Stability)
- Secondary: Teal `#20b2aa` (Reliability)
- Accent: Warm Amber `#f59e0b` (Energy)
- Background: Off-white `#f8f9fa`

## Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI: `npx expo` (no global install needed)
- Supabase CLI: `npm install -g supabase`
- Supabase account
- Google Maps API key (for Android live tracking)

## Setup Instructions

### 1. Clone and Install

```bash
cd e:/Personal-Projects/App
npm install
```

### 2. Configure Supabase

1. Create a new Supabase project at https://supabase.com
2. Copy your project URL and anon key
3. Run the SQL schema:
   - Go to Supabase SQL Editor
   - Copy and run the contents of `supabase-schema.sql`
4. Create storage buckets:
   - `rider-documents`
   - `order-photos`
   - `dispute-evidence`
   - `payment-screenshots`

### 3. Configure Google Maps

1. Create a project at https://console.cloud.google.com
2. Enable the Maps SDK (Android/iOS)
3. Create an API key

### 4. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 5. Run the App (Expo SDK 54)

```bash
# Start Expo development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios
```

## Project Structure

```
App/
├── src/
│   ├── components/
│   │   └── common/          # Reusable UI components
│   ├── contexts/            # React Context providers
│   ├── lib/                 # Supabase client & types
│   ├── navigation/          # Navigation configuration
│   ├── screens/
│   │   ├── auth/           # Authentication screens
│   │   ├── customer/       # Customer app screens
│   │   └── rider/          # Rider app screens
│   ├── theme/              # Colors, typography, spacing
│   └── types/              # TypeScript type definitions
├── App.tsx                 # Root component
├── app.json               # Expo configuration
├── package.json
└── supabase-schema.sql    # Database schema
```

## Database Schema

Key tables:
- `users` - User profiles with roles (customer/rider/admin)
- `rider_profiles` - Rider KYC and verification data
- `orders` - Delivery orders with OTP and status tracking
- `ratings` - Bidirectional rating system
- `disputes` - Dispute tickets with evidence
- `rider_locations` - Real-time location tracking
- `pricing_config` - Dynamic pricing (base + per km)
- `restricted_items` - Prohibited item list

## Pricing Model

- Base fee: PKR 50
- Per km fee: PKR 15
- Formula: `Total = Base + (Distance × Per KM)`

Example: 5 km delivery = 50 + (5 × 15) = PKR 125

## Rider Tiers

| Tier    | Deposit | Benefits |
|---------|---------|----------|
| Basic   | PKR 1,500 | Standard access |
| Premium | PKR 5,000 | Priority job feed |
| Gold    | PKR 10,000 | Premium features |

## Trust & Safety Workflow

### Order Creation
1. Customer creates order with sealed package confirmation
2. System generates pickup & drop OTPs (6 digits)
3. Order appears in rider job feed

### Pickup Flow
1. Rider arrives and takes photo of sealed package
2. Sender provides pickup OTP (shown in customer app)
3. Rider enters OTP to confirm pickup
4. OTP cached locally on rider device

### Delivery Flow
1. Rider arrives at drop location
2. Takes photo of delivery
3. Receiver provides drop OTP (shown in customer app)
4. Rider enters OTP to complete delivery
5. Both parties rate each other

### Dispute Resolution
- Either party can create dispute ticket
- Admin reviews evidence (photos, OTP logs)
- Case-by-case resolution

## Development Roadmap

### Phase 1: MVP (Current)
- [x] Authentication (magic link)
- [x] Customer order creation
- [x] Rider dashboard
- [x] OTP system
- [x] Basic navigation
- [ ] Live map tracking
- [ ] Photo capture integration
- [ ] Complete OTP verification flow

### Phase 2: Trust Features
- [ ] Image upload to Supabase Storage
- [ ] Dispute creation and admin review
- [ ] Rating submission
- [ ] Strike system enforcement
- [ ] Verified rider badges

### Phase 3: Admin Panel
- [ ] Web-based admin dashboard
- [ ] Rider KYC approval
- [ ] Dispute resolution interface
- [ ] Pricing configuration
- [ ] Analytics and reports

### Phase 4: Launch Prep
- [ ] Play Store release build
- [ ] Payment screenshot verification
- [ ] Push notifications
- [ ] Performance optimization
- [ ] Pilot testing with 10-15 riders

## Testing Accounts

Create test accounts with these roles:

```sql
-- Update user role after sign up
UPDATE users SET role = 'rider' WHERE email = 'rider@test.com';
UPDATE users SET role = 'admin' WHERE email = 'admin@test.com';
```

## Common Issues

### Magic Link Not Sending
- Check Supabase email settings
- Verify SMTP configuration
- Check spam folder

### App Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
expo start -c
```

### Database Errors
- Verify RLS policies are enabled
- Check user authentication
- Review Supabase logs

## Support

For issues or questions:
- GitHub Issues: (add your repo URL)
- Email: (add support email)

## License

Private - All Rights Reserved

## Contributors

- Initial development: 2026
