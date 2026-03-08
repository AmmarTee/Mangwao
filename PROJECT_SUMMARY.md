# Mangwao - Project Summary

## Overview
Mangwao is a crowd-sourced food delivery platform for Burewala, Pakistan (20 km radius). Built with React Native (Expo) and Supabase, it focuses on trust and safety through OTP verification, photo proof, and strict rider vetting.

## What Has Been Built

### ✅ Complete Features

1. **Project Infrastructure**
   - Expo React Native project structure
   - TypeScript configuration
   - Supabase backend integration
   - Theme system with trustworthy colors (Navy, Teal, Amber)
   - Environment variable setup

2. **Authentication System**
   - Email magic link sign-in (no SMS/WhatsApp)
   - Role-based access (Customer, Rider, Admin)
   - Session management with AsyncStorage
   - AuthContext for app-wide state

3. **Customer App**
   - Home screen with active orders
   - New delivery order creation
   - Distance-based pricing calculator
   - Payment method selection (COD/Transfer)
   - Sealed package confirmation
   - Orders history (placeholder)
   - Profile management

4. **Rider App**
   - Dashboard with online/offline toggle
   - Stats display (deliveries, rating, strikes)
   - Tier system display (Basic/Premium/Gold)
   - KYC status checking
   - Job feed (placeholder)
   - Earnings tracker (placeholder)
   - Profile screen

5. **Database Schema**
   - Complete SQL schema with 10 tables
   - Row Level Security policies
   - Automatic OTP generation function
   - Timestamp triggers
   - Indexes for performance
   - Default pricing configuration

6. **Admin Web Panel**
   - Clean, responsive dashboard
   - Tab-based navigation
   - Stats overview
   - Order monitoring interface
   - Rider management view
   - Dispute resolution UI
   - Pricing configuration
   - Settings management

7. **Trust & Safety Design**
   - Mandatory sealed package toggle
   - Photo capture points (pickup/drop)
   - Server-generated OTP system
   - Local OTP caching for offline verification
   - Rating system (bidirectional)
   - Dispute ticketing system
   - Strike system tracking
   - Restricted items list

8. **Reusable Components**
   - Button (4 variants, 3 sizes)
   - Card with elevation
   - Consistent styling across apps

### 📋 What's Next (Implementation Checklist Created)

The following features are designed but need implementation:

1. **Photo Capture Integration**
   - expo-image-picker setup
   - Supabase Storage upload
   - Preview before submit

2. **Live Map Tracking**
   - Google Maps integration (react-native-maps)
   - Real-time location updates
   - Route display

3. **OTP Flow Completion**
   - In-app OTP display component
   - OTP input with verification
   - Local caching implementation
   - Offline fallback

4. **Job Feed & Matching**
   - Nearby order display for riders
   - Accept/reject logic
   - Auto-assignment algorithm

5. **Dispute System**
   - Evidence upload
   - Admin review interface
   - Resolution workflow

6. **Real-time Updates**
   - Supabase subscriptions
   - Push notifications
   - Live order status

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Mobile Frontend | React Native (Expo 50) |
| Language | TypeScript |
| Backend | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Maps | Google Maps (react-native-maps) |
| Navigation | React Navigation 6 |
| State Management | React Context |
| Storage | AsyncStorage |

## File Structure

```
App/
├── admin/                          # Web admin panel
│   ├── index.html                 # Static admin dashboard
│   └── README.md
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Button.tsx         # Reusable button component
│   │       └── Card.tsx           # Card wrapper component
│   ├── contexts/
│   │   └── AuthContext.tsx        # Authentication state management
│   ├── lib/
│   │   └── supabase.ts            # Supabase client + types
│   ├── navigation/
│   │   ├── CustomerNavigator.tsx  # Customer bottom tabs
│   │   └── RiderNavigator.tsx     # Rider bottom tabs
│   ├── screens/
│   │   ├── auth/
│   │   │   └── AuthScreen.tsx     # Magic link sign-in
│   │   ├── customer/
│   │   │   ├── HomeScreen.tsx     # Customer dashboard
│   │   │   ├── NewDeliveryScreen.tsx  # Order creation
│   │   │   ├── OrdersScreen.tsx   # Order history
│   │   │   └── ProfileScreen.tsx  # Customer profile
│   │   └── rider/
│   │       ├── RiderHomeScreen.tsx    # Rider dashboard
│   │       ├── JobFeedScreen.tsx      # Available jobs
│   │       ├── EarningsScreen.tsx     # Earnings tracker
│   │       └── RiderProfileScreen.tsx # Rider profile
│   ├── theme/
│   │   └── index.ts               # Colors, typography, spacing
│   └── types/
│       └── env.d.ts               # Environment variable types
├── App.tsx                        # Root component
├── app.json                       # Expo configuration
├── babel.config.js                # Babel setup
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── supabase-schema.sql           # Database schema
├── database-schema.md            # Schema documentation
├── README.md                     # Full documentation
├── QUICKSTART.md                 # 10-minute setup guide
├── IMPLEMENTATION_CHECKLIST.md   # Feature roadmap
└── .env.example                  # Environment template
```

## Key Design Decisions

### Why Supabase?
- No Stripe needed (manual payments work in Pakistan)
- Built-in auth, storage, and real-time
- PostgreSQL for complex queries
- Row Level Security for data isolation
- Free tier sufficient for MVP

### Why Magic Link?
- No SMS costs
- More secure than passwords
- Users already check email
- In-app OTPs replace SMS for verification

### Why React Native (Expo)?
- Single codebase for Android/iOS
- Fast development cycle
- OTA updates without Play Store review
- Good for Pakistan market (Android-first)

### Trust Features
- **Sealed Package**: Customer confirms before order creation
- **Photo Proof**: Mandatory at pickup and delivery
- **OTP**: 6-digit codes prevent fake completions
- **Local Cache**: Riders can verify OTP offline
- **Bidirectional Ratings**: Accountability for both sides
- **Strike System**: Auto-suspend after 3 strikes
- **Deposit**: Financial commitment from riders

## Pricing Model

- **Base Fee**: PKR 50 (covers platform costs)
- **Per KM**: PKR 15 (fair for fuel in Pakistan)
- **Example**: 10 km delivery = 50 + (10 × 15) = PKR 200

### Rider Earnings
- Tier affects job priority, not commission
- 100% of delivery fee goes to rider
- Platform monetization: future subscription or commission

## Launch Readiness

### ✅ Ready
- Core app structure
- Database schema
- Authentication
- Order creation
- Basic UI/UX

### ⏳ Needs Implementation (2-3 weeks)
- Photo capture integration
- Live map tracking
- OTP verification flow
- Job feed and matching
- Admin panel backend connection

### Launch Requirements
- 10-15 verified riders in Burewala
- Tested full order lifecycle
- Customer support process
- Play Store approval
- Marketing materials

## Next Steps

### Immediate (This Week)
1. Set up Supabase project
2. Run database schema
3. Test magic link authentication
4. Create test accounts (customer + rider + admin)
5. Verify order creation works

### Short Term (Next 2 Weeks)
1. Integrate expo-image-picker
2. Implement Supabase Storage uploads
3. Build OTP display and verification
4. Add Google Maps for live tracking
5. Complete job feed for riders

### Medium Term (Weeks 3-4)
1. Admin panel Supabase integration
2. Dispute creation and resolution
3. Rating submission
4. Testing with real scenarios
5. Bug fixes and polish

### Pre-Launch (Week 5)
1. Recruit 10-15 riders
2. KYC verification process
3. Pilot testing in Burewala
4. Collect feedback
5. Play Store submission

## Success Metrics

### MVP Launch Goals
- 50+ orders in first month
- 90%+ on-time delivery rate
- <5% dispute rate
- 4.0+ average customer rating
- 4.0+ average rider rating

### Revenue Projections (After 6 Months)
- 500 orders/month
- Average PKR 150/order
- Potential MRR if 10% commission: PKR 7,500

## Documentation

- [README.md](README.md) - Complete documentation
- [QUICKSTART.md](QUICKSTART.md) - 10-minute setup guide
- [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) - Feature roadmap
- [database-schema.md](database-schema.md) - Database documentation
- [admin/README.md](admin/README.md) - Admin panel guide

## Contact & Support

All core infrastructure is in place. Focus on completing the implementation checklist to reach MVP launch.

---

**Built**: March 8, 2026  
**Target Launch**: April 2026  
**Location**: Burewala, Pakistan  
**Radius**: 20 km
