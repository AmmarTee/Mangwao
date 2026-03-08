# Mangwao Database Schema

## Tables

### users
- id: uuid (PK, references auth.users)
- email: text
- full_name: text
- phone: text
- role: enum ('customer', 'rider', 'admin')
- avatar_url: text
- created_at: timestamp
- updated_at: timestamp

### addresses
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- label: text (e.g., 'Home', 'Work')
- address_line: text
- latitude: decimal
- longitude: decimal
- is_default: boolean
- created_at: timestamp

### rider_profiles
- id: uuid (PK)
- user_id: uuid (FK -> users.id, unique)
- tier: enum ('basic', 'premium', 'gold')
- deposit_amount: decimal
- deposit_status: enum ('pending', 'paid', 'refunded')
- cnic_number: text
- cnic_photo_url: text
- selfie_url: text
- bike_papers_url: text
- verification_status: enum ('pending', 'approved', 'rejected')
- is_online: boolean
- rating_avg: decimal
- total_deliveries: integer
- strike_count: integer
- is_suspended: boolean
- created_at: timestamp
- updated_at: timestamp

### orders
- id: uuid (PK)
- customer_id: uuid (FK -> users.id)
- rider_id: uuid (FK -> users.id, nullable)
- pickup_address: text
- pickup_lat: decimal
- pickup_lng: decimal
- pickup_contact_name: text
- pickup_contact_phone: text
- drop_address: text
- drop_lat: decimal
- drop_lng: decimal
- drop_contact_name: text
- drop_contact_phone: text
- item_description: text
- is_sealed: boolean
- pickup_photo_url: text
- drop_photo_url: text
- pickup_otp: text (6 digits)
- drop_otp: text (6 digits)
- pickup_otp_verified_at: timestamp
- drop_otp_verified_at: timestamp
- distance_km: decimal
- base_fee: decimal
- distance_fee: decimal
- total_fee: decimal
- payment_method: enum ('cod', 'transfer')
- payment_status: enum ('pending', 'paid', 'refunded')
- payment_screenshot_url: text
- status: enum ('pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled')
- accepted_at: timestamp
- picked_up_at: timestamp
- delivered_at: timestamp
- cancelled_at: timestamp
- cancellation_reason: text
- created_at: timestamp
- updated_at: timestamp

### ratings
- id: uuid (PK)
- order_id: uuid (FK -> orders.id)
- rater_id: uuid (FK -> users.id)
- rated_id: uuid (FK -> users.id)
- rater_type: enum ('customer', 'rider')
- rating: integer (1-5)
- feedback: text
- safety_flag: boolean
- created_at: timestamp

### disputes
- id: uuid (PK)
- order_id: uuid (FK -> orders.id)
- reporter_id: uuid (FK -> users.id)
- issue_type: enum ('missing_item', 'wrong_item', 'damaged', 'late', 'other')
- description: text
- evidence_photo_urls: text[] (array)
- status: enum ('open', 'investigating', 'resolved', 'closed')
- resolution_notes: text
- resolved_by: uuid (FK -> users.id, nullable)
- resolved_at: timestamp
- created_at: timestamp
- updated_at: timestamp

### rider_locations
- id: uuid (PK)
- rider_id: uuid (FK -> users.id)
- order_id: uuid (FK -> orders.id, nullable)
- latitude: decimal
- longitude: decimal
- heading: decimal
- speed: decimal
- created_at: timestamp

### pricing_config
- id: uuid (PK)
- base_fee: decimal
- per_km_fee: decimal
- surge_multiplier: decimal
- is_surge_active: boolean
- effective_from: timestamp
- created_at: timestamp

### restricted_items
- id: uuid (PK)
- item_name: text
- description: text
- is_active: boolean
- created_at: timestamp

## Row Level Security (RLS) Policies

### users
- SELECT: authenticated users can see their own profile
- UPDATE: users can update their own profile

### orders
- SELECT: customers see their orders; riders see assigned orders; admins see all
- INSERT: authenticated customers only
- UPDATE: riders can update status/photos; admins can update all

### rider_profiles
- SELECT: public (limited fields); full access for owner and admin
- INSERT: authenticated users
- UPDATE: owner can update availability; admin can update verification

### ratings
- SELECT: rated user can see their ratings; rater can see their submissions
- INSERT: authenticated users who completed an order

### disputes
- SELECT: reporter and admin only
- INSERT: authenticated users
- UPDATE: admin only

## Storage Buckets

1. **rider-documents**: CNIC, selfie, bike papers
2. **order-photos**: pickup and delivery photos
3. **dispute-evidence**: dispute-related photos
4. **payment-screenshots**: manual transfer proofs

## Edge Functions (Optional)

1. **generate-otp**: Generate and store OTPs for orders
2. **calculate-pricing**: Distance-based pricing calculation
3. **send-notifications**: In-app notification delivery
