# Cincinnati Lacrosse Academy

A modern Next.js website for Cincinnati Lacrosse Academy featuring user registration, event booking, membership subscriptions, and integration with Supabase and Stripe.

## Features

- **User Authentication** - Secure registration and login with Supabase Auth
- **Event Booking** - Browse and book training sessions, camps, clinics, and tournaments
- **Membership Plans** - Monthly, quarterly, and annual subscription options via Stripe
- **Dashboard** - User dashboard to manage bookings and membership
- **Responsive Design** - Premium light design with blue/cyan accents
- **Platform Links** - Integration with YouTube, Podcast, and You.Prjct app

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication & Database**: Supabase
- **Payments**: Stripe
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your environment variables:
   ```
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Stripe
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Database Setup

1. Go to your Supabase project's SQL Editor
2. Run the contents of `supabase/schema.sql` to create tables and sample data

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/
│   ├── api/stripe/          # Stripe API routes
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # User dashboard
│   ├── events/               # Events listing and booking
│   ├── membership/           # Membership plans
│   ├── about/                # About page
│   ├── contact/              # Contact page
│   └── page.tsx              # Home page
├── components/
│   ├── layout/               # Header, Footer
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── supabase/             # Supabase client configuration
│   ├── stripe.ts             # Stripe configuration
│   └── types.ts              # TypeScript types
└── middleware.ts             # Auth middleware
```

## Stripe Setup

1. Create products and prices in your Stripe dashboard for:
   - Monthly membership ($99/month)
   - Quarterly membership ($249/quarter)
   - Annual membership ($899/year)
   - Individual event tickets

2. Set up webhook endpoint in Stripe:
   - Endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

## Supabase Setup

1. Enable Email/Password authentication in Supabase
2. Configure email templates for confirmation and password reset
3. Set up redirect URLs for authentication callbacks

## Customization

### Colors

The color scheme can be customized in `src/app/globals.css`:

```css
:root {
  --primary: #0891b2;      /* Cyan 600 */
  --primary-dark: #0e7490;  /* Cyan 700 */
  --primary-light: #22d3ee; /* Cyan 400 */
  --accent: #06b6d4;        /* Cyan 500 */
}
```

### External Links

Update the platform links in:
- `src/components/layout/Footer.tsx`
- `src/app/page.tsx` (platforms section)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build the production bundle:
```bash
npm run build
npm start
```

## License

Private - Cincinnati Lacrosse Academy
