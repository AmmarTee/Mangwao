# Mangwao Admin Panel

Simple web-based admin interface for managing Mangwao delivery operations.

## Features

- Dashboard with real-time stats
- Order monitoring
- Rider KYC approval
- Dispute resolution
- Pricing configuration
- App settings management

## Setup

This is a static HTML page for now. To run locally:

```bash
# Simple Python server
cd admin
python -m http.server 8000

# Or use Node.js
npx serve
```

Then open http://localhost:8000

## Production Setup

To connect to Supabase:

1. Add Supabase JS SDK
2. Implement authentication for admin users
3. Add real-time subscriptions for live data
4. Replace static content with dynamic queries

## Future Enhancements

- [ ] React/Next.js conversion for better UX
- [ ] Image preview for KYC documents
- [ ] Dispute evidence viewer
- [ ] Export reports (CSV/PDF)
- [ ] Analytics dashboard with charts
- [ ] Bulk operations
- [ ] Rider messaging system
