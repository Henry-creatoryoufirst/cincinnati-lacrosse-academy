# CLA Site Rebuild — Handoff Document

**Date:** February 26, 2026
**Repo:** `cincinnati-lacrosse-academy` (main branch)
**Stack:** Next.js 16, React 19, Supabase, Stripe, Tailwind v4, Framer Motion
**Deploy:** Vercel Pro (CLI deploy, no git CI/CD)

---

## What Was Done (This Session)

### P0 — Revenue Blockers (Verified / Fixed)

| Item | Status | Notes |
|------|--------|-------|
| Stripe membership checkout | **Verified working** | `/api/stripe/create-subscription` wires up correctly. Membership page buttons call `handleSubscribe()` which hits this endpoint. |
| Session registration buttons | **Verified working** | `/get-started/sessions` links to `/events/{id}/book` which runs the full Stripe checkout flow. |
| Login/signup pages | **Verified existing** | `/auth/login` and `/auth/register` both exist and call Supabase auth. |
| `/login` redirect | **Created** | `src/app/login/page.tsx` — server-side redirect to `/auth/login` so both URLs work. |

### P1 — Visual Overhaul (Completed)

| Page | File | What Changed |
|------|------|-------------|
| Events page | `src/app/events/page.tsx` | Replaced bright blue gradient header with dark gradient (#111827 → #0a0a0b). Improved empty state with card layout and Calendar icon. Converted inline styles to Tailwind. |
| Contact page | `src/app/contact/page.tsx` | Full refactor: all inline `style={{}}` objects, `onMouseEnter`/`onMouseLeave`/`onFocus`/`onBlur` handlers, `inputStyle` constant, `handleFocus`/`handleBlur` functions, and `<style jsx global>` block removed. Replaced with Tailwind utilities (`hover:`, `focus:`, `group-hover:`). |
| Login page | `src/app/auth/login/page.tsx` | Same refactor as contact — all inline styles to Tailwind, all JS event handlers to CSS pseudo-classes, custom `@keyframes spin` replaced with `animate-spin`. |
| Register page | `src/app/auth/register/page.tsx` | Same refactor — inline styles, `inputStyle` constant, `handleFocus`/`handleBlur`, `<style jsx global>` all removed and replaced with Tailwind. |

### P2 — Functional Gaps (Completed)

| Item | Status | Notes |
|------|--------|-------|
| Billing history API | **Created** | `src/app/api/stripe/billing-history/route.ts` — GET endpoint that fetches charges and default payment method from Stripe. The billing dashboard page was already calling this endpoint. |
| Auth redirects | **Verified working** | `src/middleware.ts` + `src/lib/supabase/middleware.ts` already protect `/dashboard`, `/events/*/book`, `/membership/manage` and redirect to `/auth/login?redirect=...`. |

### P3 — Cleanup (Completed)

| Item | What Was Removed |
|------|-----------------|
| Web3 dependencies | `@coinbase/onchainkit`, `wagmi`, `viem` (598 packages), `@tanstack/react-query` (2 packages) |
| Web3 files | `src/components/providers/OnchainProviders.tsx`, `src/components/payments/CryptoPayment.tsx`, `src/app/api/create-charge/route.ts` |
| Layout cleanup | Removed `OnchainProviders` wrapper from `src/app/layout.tsx` |
| Booking page cleanup | Removed crypto payment option from `src/app/events/[id]/book/page.tsx` — now card-only via Stripe |
| Bug fix | Fixed operator precedence bug in `src/app/api/stripe/billing-history/route.ts` (ternary vs `||`) |

---

## What Still Needs To Be Done

### HIGH — Inline Style Refactors

These pages still use extensive `style={{}}` objects and JS event handlers for hover/focus effects. They should be converted to Tailwind like the auth/contact/events pages were.

**1. Header component** — `src/components/layout/Header.tsx`
- ~50 inline style properties across logo, desktop nav, mobile hamburger, mobile overlay, mobile nav links
- JS `onMouseEnter`/`onMouseLeave` handlers should become `hover:` utilities
- Mobile overlay animation should use Tailwind transitions
- Nav already uses some CSS classes from `globals.css` (`.nav`, `.nav-container`, `.desktop-nav`, `.mobile-menu-button`, `.nav-tagline`)

**2. Get Started page** — `src/app/get-started/page.tsx`
- ~40+ inline style properties
- Uses Framer Motion for card animations — those `style` props are intentional and should stay
- Triptych header layout, training cards, contact reveal sections all use inline styles
- Some CSS classes from `globals.css` already exist (`.triptych-header`, `.triptych-header-left`, etc.)

**3. Sessions page** — `src/app/get-started/sessions/page.tsx`
- ~40+ inline style properties
- Static schedule display, dynamic session cards, info cards at bottom
- All layout/spacing/typography via inline objects

**4. Admin dashboard** — `src/app/dashboard/admin/page.tsx`
- Container, header, stats grid, and StatCard component all use inline styles
- Mixed approach — some Tailwind, some inline

**5. Footer component** — `src/components/layout/Footer.tsx`
- ~10 inline style properties (grid layout, brand link, description)
- Mostly uses CSS classes from `globals.css` already — smaller lift

**6. Membership page** — `src/app/membership/page.tsx`
- Extensive inline styles for the plan cards, pricing, feature lists, FAQ accordion, hero section
- Functional — just needs style migration

### MEDIUM — Feature Gaps

**7. Event detail page** — `src/app/events/[id]/page.tsx`
- Exists but was not audited this session — verify layout matches the new events page header style

**8. About page logo** — `src/app/about/page.tsx`
- The "CLA" text-in-gradient-circle in the mission section (lines 104-112) is a generated placeholder, not a real logo image
- Replace with actual logo asset when available

**9. Image optimization**
- `public/images/` contains 67 files, many very large (e.g. `homepage-brett.jpg` at 11MB, `podcast-cover.png` at 11MB)
- Should use Next.js `<Image>` component with proper sizing/quality and consider compressing originals

### LOW — Polish

**10. Connect git CI/CD**
- Currently deployed via `vercel` CLI with no git integration
- Connect the repo to Vercel for automatic deploys on push

**11. Homepage** — `src/app/page.tsx`
- Not audited this session — may have inline styles that should be checked

---

## Architecture Reference

### Route Protection
```
Middleware (src/middleware.ts) protects:
  /dashboard/*
  /events/*/book
  /membership/manage
→ Redirects unauthenticated users to /auth/login?redirect=[path]
→ Admin pages additionally check profile.role === 'admin'
```

### Stripe Integration
```
/api/stripe/create-subscription  — Membership checkout (subscription mode)
/api/stripe/create-checkout      — Event booking checkout (payment mode)
/api/stripe/create-portal-session — Customer billing portal
/api/stripe/billing-history      — Fetch charges + payment method
/api/stripe/webhook              — Handles checkout.session.completed,
                                    subscription.updated/deleted,
                                    invoice.payment_succeeded/failed
```

### Database (Supabase)
```
Tables: profiles, events, bookings, memberships
Auth: Email/password via Supabase Auth
Admin: Service role key for webhook operations
```

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL
```

### Design Language
```
Target: Dark nav (#0a0a0b), white content areas, cards with rounded-2xl borders
Reference pages: / (landing), /dashboard/admin, /contact, /auth/login
Tailwind theme vars: primary (#2563EB), foreground (#1A1A1A), muted (#6B7280),
                     secondary (#F4F5F7), border (#E5E7EB)
Pattern: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Pages Fully on Tailwind (done)
- `/` (homepage — needs verification)
- `/about`
- `/contact`
- `/auth/login`
- `/auth/register`
- `/events`
- `/events/[id]/book`
- `/dashboard` (all 6 sub-pages except admin)
- `/login` (redirect only)

### Pages Still Using Inline Styles (remaining work)
- `Header.tsx` (layout component — affects every page)
- `Footer.tsx` (layout component — affects every page)
- `/get-started`
- `/get-started/sessions`
- `/membership`
- `/dashboard/admin`
- `/events/[id]` (needs audit)
