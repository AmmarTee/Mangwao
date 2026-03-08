# Mangwao Implementation Checklist

## Phase 1: Initial Setup ✅

- [x] Project scaffolding (Expo + TypeScript)
- [x] Supabase database schema
- [x] Theme and color system
- [x] Authentication flow (magic link)
- [x] Customer app navigation
- [x] Rider app navigation
- [x] Admin web panel structure

## Phase 2: Core Features (Next Steps)

### Customer App
- [ ] Integrate Google Maps (react-native-maps) for location selection
- [ ] Implement image picker for package photos
- [ ] Real-time order status updates
- [ ] In-app OTP display component
- [ ] Order history with filters
- [ ] Rating submission form
- [ ] Dispute creation with photo upload

### Rider App
- [ ] KYC document upload flow
- [ ] Camera integration for pickup/drop photos
- [ ] OTP input and local caching
- [ ] Live location sharing
- [ ] Job acceptance/rejection logic
- [ ] Earnings calculation and display
- [ ] Payment withdrawal interface

### Backend Features
- [ ] OTP generation edge function
- [ ] Distance calculation service
- [ ] Photo upload to Supabase Storage
- [ ] Real-time notifications
- [ ] Rider matching algorithm
- [ ] Payment verification workflow

### Admin Panel
- [ ] Connect to Supabase
- [ ] Rider KYC approval interface
- [ ] Dispute resolution workflow
- [ ] Live order monitoring
- [ ] Analytics and reports
- [ ] Pricing rule editor

## Phase 3: Trust & Safety

- [ ] Photo verification enforcement
- [ ] OTP expiry logic
- [ ] Strike system automation
- [ ] Verified rider badge criteria
- [ ] Restricted items validation
- [ ] Dispute escalation workflow

## Phase 4: Testing & QA

- [ ] Unit tests for critical functions
- [ ] Integration tests for order flow
- [ ] Manual testing with test accounts
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing with 50+ concurrent orders

## Phase 5: Launch Preparation

- [ ] Play Store listing and assets
- [ ] Privacy policy and terms
- [ ] Onboarding tutorial for customers
- [ ] Onboarding tutorial for riders
- [ ] Customer support system
- [ ] Pilot with 10-15 riders in Burewala

## Phase 6: Post-Launch

- [ ] Monitor crash reports
- [ ] Collect user feedback
- [ ] Iterate on UX pain points
- [ ] Add requested features
- [ ] Scale to nearby cities
- [ ] Marketing and rider recruitment

## Critical Path (MVP Launch)

1. **Week 1**: Photo upload + OTP flow
2. **Week 2**: Live tracking + ratings
3. **Week 3**: Admin KYC approval + disputes
4. **Week 4**: Testing + bug fixes
5. **Week 5**: Pilot launch

## Known Limitations (Document as Tech Debt)

- Distance calculation uses placeholder logic (needs Google Maps)
- Tab icons are placeholders (need Expo Vector Icons)
- No push notifications yet
- No offline support
- Payment screenshot review is manual
- No automated refund processing

## Environment Setup Checklist

- [ ] Install Node.js 18+
- [ ] Install Expo CLI
- [ ] Create Supabase project
- [ ] Run database schema SQL
- [ ] Create storage buckets
- [ ] Get Google Maps API key
- [ ] Configure `.env` file
- [ ] Test magic link emails
- [ ] Create test accounts (customer, rider, admin)

## Before First Customer Order

- [ ] Verify OTP generation works
- [ ] Test full order flow end-to-end
- [ ] Confirm RLS policies are correct
- [ ] Test photo uploads to storage
- [ ] Verify pricing calculation
- [ ] Test rating submission
- [ ] Confirm dispute creation works
- [ ] Have 5+ verified riders ready
