# Mangwao Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MANGWAO PLATFORM                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Customer App    │  │   Rider App      │  │  Admin Panel     │
│  (React Native)  │  │  (React Native)  │  │  (Web - HTML)    │
│                  │  │                  │  │                  │
│  • Auth          │  │  • Auth          │  │  • Dashboard     │
│  • Create Order  │  │  • KYC Submit    │  │  • Rider KYC     │
│  • Track Order   │  │  • Job Feed      │  │  • Disputes      │
│  • OTP Display   │  │  • OTP Verify    │  │  • Pricing       │
│  • Rate Rider    │  │  • Photo Capture │  │  • Settings      │
│  • Disputes      │  │  • Live Track    │  │                  │
└────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                     │                     │
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                               ▼
         ┌─────────────────────────────────────────┐
         │         SUPABASE BACKEND                │
         │                                         │
         │  ┌───────────────────────────────────┐ │
         │  │  PostgreSQL Database              │ │
         │  │                                   │ │
         │  │  • users                          │ │
         │  │  • rider_profiles                 │ │
         │  │  • orders (with OTPs)             │ │
         │  │  • ratings                        │ │
         │  │  • disputes                       │ │
         │  │  • rider_locations (tracking)     │ │
         │  │  • pricing_config                 │ │
         │  │  • restricted_items               │ │
         │  │                                   │ │
         │  │  + Row Level Security (RLS)       │ │
         │  │  + Realtime subscriptions         │ │
         │  │  + OTP generation function        │ │
         │  └───────────────────────────────────┘ │
         │                                         │
         │  ┌───────────────────────────────────┐ │
         │  │  Authentication                   │ │
         │  │  • Magic link (email)             │ │
         │  │  • Session management             │ │
         │  │  • Role-based access              │ │
         │  └───────────────────────────────────┘ │
         │                                         │
         │  ┌───────────────────────────────────┐ │
         │  │  Storage Buckets                  │ │
         │  │  • rider-documents                │ │
         │  │  • order-photos                   │ │
         │  │  • dispute-evidence               │ │
         │  │  • payment-screenshots            │ │
         │  └───────────────────────────────────┘ │
         │                                         │
         │  ┌───────────────────────────────────┐ │
         │  │  Realtime (WebSocket)             │ │
         │  │  • Order status updates           │ │
         │  │  • Rider location stream          │ │
         │  │  • New job notifications          │ │
         │  └───────────────────────────────────┘ │
         └─────────────────────────────────────────┘
                               │
                               ▼
         ┌─────────────────────────────────────────┐
         │      EXTERNAL SERVICES                  │
         │                                         │
         │  • Google Maps (Live Tracking)          │
         │  • Email Provider (Magic Links)         │
         └─────────────────────────────────────────┘
```

## Data Flow: Order Lifecycle

```
CUSTOMER                    SYSTEM                      RIDER

1. Create Order
   │
   ├─ Fill Details          Generate Pickup OTP
   ├─ Seal Confirm          Generate Drop OTP
   ├─ Calculate Price       Calculate Distance
   └─ Submit                Store in Database
                                   │
                                   ▼
2. Order Pending            Broadcast to
                            Nearby Riders ──────────> See in Job Feed
                                                             │
                                                             │
3. Waiting...                                         Accept Job
                                                             │
                            Update Status <──────────────────┘
                            rider_id assigned
                                   │
                                   ▼
   Order Accepted! ◄───────  Notify Customer
   See Rider Info
                                                             │
4. Track Status                                       Go to Pickup
                                                             │
                                                       Take Photo
                                                       Ask for OTP
                                                             │
   Show Pickup OTP ────────────────────────────────> Enter OTP
   (6 digits)                                               │
                            Verify OTP <─────────────────────┘
                            Mark Picked Up
                            Cache OTP locally
                                   │
                                   ▼
   In Transit! ◄───────────  Update Status
   Live Tracking                           
                                                             │
5. Watch Map                                          Navigate
                                                       Update Location
                            Stream Location <────────────────┘
                            (Realtime)
                                                             │
6. Waiting...                                         Arrive at Drop
                                                       Take Photo
                                                       Ask for OTP
                                                             │
   Show Drop OTP ──────────────────────────────────> Enter OTP
   (6 digits)                                               │
                            Verify OTP <─────────────────────┘
                            Mark Delivered
                                   │
                                   ▼
7. Rate Rider ──────────>   Store Rating   ◄─────────  Rate Customer
   Feedback                                          Feedback
                                   │
                                   ▼
                            Update Averages
                            Calculate Earnings
                            Close Order
```

## Trust & Safety Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  TRUST ENFORCEMENT LAYERS                    │
└─────────────────────────────────────────────────────────────┘

BEFORE ORDER CREATION
├─ Seal Requirement ───> Cannot proceed if unsealed
└─ Restricted Items ───> Block prohibited items

AT PICKUP
├─ Photo Mandatory ────> Cannot skip
├─ OTP Required ───────> Server validates
└─ Timestamp Logged ───> Evidence trail

IN TRANSIT
├─ Live Location ──────> Transparency
└─ Expected Time ──────> Detect delays

AT DELIVERY
├─ Photo Mandatory ────> Cannot skip
├─ OTP Required ───────> Server validates
└─ Timestamp Logged ───> Evidence trail

POST-DELIVERY
├─ Rating System ──────> Accountability
├─ Dispute Option ─────> Evidence review
└─ Strike Counting ────> Auto-suspend at 3

RIDER VETTING
├─ KYC Documents ──────> CNIC + Selfie + Papers
├─ Deposit Paid ───────> Financial commitment
├─ Admin Approval ─────> Manual verification
└─ Tier System ────────> Performance tracking
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                          │
└─────────────────────────────────────────────────────────────┘

CLIENT SIDE
├─ No API keys in code (env variables)
├─ Session tokens in secure storage
├─ OTP cached locally (encrypted)
└─ Photo metadata stripped

NETWORK
├─ HTTPS only
├─ Supabase handles encryption
└─ WebSocket secure (wss://)

DATABASE (Row Level Security)
├─ Customers see only their orders
├─ Riders see only assigned orders
├─ Ratings visible to involved parties
└─ Admin has full access

AUTHENTICATION
├─ Magic link (no password storage)
├─ Email verification required
├─ Role-based access control
└─ Session expiry

STORAGE
├─ Private buckets
├─ Signed URLs for access
├─ File size limits
└─ Type validation

BUSINESS LOGIC
├─ OTP expires after use
├─ Cannot rate without completion
├─ Cannot dispute before delivery
├─ Strike system auto-enforces
└─ Suspended riders blocked
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT TOPOLOGY                       │
└─────────────────────────────────────────────────────────────┘

MOBILE APPS
├─ Customer App ──────> Google Play Store
├─ Rider App ─────────> Google Play Store
└─ OTA Updates ───────> Expo Updates (instant)

BACKEND
└─ Supabase Cloud
   ├─ Region: Closest to Pakistan
   ├─ Managed PostgreSQL
   ├─ CDN for Storage
   └─ Edge Functions (optional future)

ADMIN PANEL
└─ Static HTML ────────> Can host on:
   ├─ Vercel (free)
   ├─ Netlify (free)
   ├─ GitHub Pages
   └─ Or Supabase Storage

EXTERNAL SERVICES
├─ Google Maps ───────> Maps & Geocoding
└─ Email Provider ────> Magic links (Supabase default)

MONITORING (Future)
├─ Sentry ────────────> Crash reporting
├─ Analytics ─────────> User behavior
└─ Supabase Logs ─────> Database queries
```

## Scalability Considerations

```
CURRENTLY (MVP)
├─ Single city (Burewala)
├─ 20 km radius
├─ 10-15 riders
├─ Target: 50 orders/month
└─ Supabase free tier sufficient

SCALE TO 500 ORDERS/MONTH
├─ Upgrade Supabase to Pro
├─ Add Sentry for monitoring
├─ Optimize database queries
└─ Consider CDN for photos

SCALE TO MULTIPLE CITIES
├─ City-based rider routing
├─ Separate pricing per city
├─ Localized dispatch logic
└─ Database indexing critical

SCALE TO 10,000+ ORDERS/MONTH
├─ Consider backend splitting
├─ Redis for caching
├─ Queue system for jobs
├─ Load balancer if needed
└─ Cost: ~$100-200/month
```

## Technology Choices Rationale

| Decision | Reason |
|----------|--------|
| React Native | Single codebase; Pakistan is Android-heavy |
| Expo | Fast iteration; OTA updates |
| Supabase | No backend coding; built-in auth; PostgreSQL power |
| TypeScript | Type safety; better DX |
| Google Maps | Widely supported via react-native-maps |
| Magic Link | No SMS costs; secure |
| In-app OTP | No SMS gateway needed; works offline |
| Local OTP Cache | Rider can verify offline |
| Manual Payments | Stripe not available in Pakistan |
| Static Admin | Fast to build; easy to host |

## Future Architecture Evolution

### Phase 2: Enhanced Backend
- Move to custom API for complex logic
- Keep Supabase as database
- Add Redis for caching
- Implement job queue (Bull/BullMQ)

### Phase 3: Microservices (if 100k+ orders/month)
- Order service
- Rider matching service
- Payment service
- Notification service
- Analytics service

### Phase 4: Multi-Region (if national expansion)
- Database sharding by city
- Edge compute for speed
- Multi-CDN strategy
- Regional admin panels
