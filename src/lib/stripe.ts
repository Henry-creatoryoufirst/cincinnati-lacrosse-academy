import Stripe from 'stripe'

// Lazy initialization to avoid errors during build
let stripeInstance: Stripe | null = null

export const getStripe = () => {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    })
  }
  return stripeInstance
}

// For backward compatibility
export const stripe = {
  get customers() { return getStripe().customers },
  get checkout() { return getStripe().checkout },
  get subscriptions() { return getStripe().subscriptions },
  get webhooks() { return getStripe().webhooks },
  get billingPortal() { return getStripe().billingPortal },
  get charges() { return getStripe().charges },
  get paymentIntents() { return getStripe().paymentIntents },
  get paymentMethods() { return getStripe().paymentMethods },
}

export const MEMBERSHIP_PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for getting started with structured training',
    price: 99,
    interval: 'month' as const,
    features: [
      '4 weekly training sessions/month',
      'You.Prjct app access',
      '10% off camps & clinics',
      'Monthly skills assessment',
      'Member community access',
    ],
    popular: false,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For serious players committed to improvement',
    price: 199,
    interval: 'month' as const,
    features: [
      'Unlimited weekly sessions',
      'You.Prjct app + premium content',
      '25% off camps & clinics',
      'Video analysis (monthly)',
      'Priority event registration',
      'Quarterly 1-on-1 coaching',
    ],
    popular: true,
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    description: 'College-prep training for the dedicated athlete',
    price: 399,
    interval: 'month' as const,
    features: [
      'Everything in Pro',
      'Weekly 1-on-1 sessions',
      '50% off camps & clinics',
      'College recruiting guidance',
      'Custom training program',
      'Direct coach access',
      'Exclusive elite-only events',
    ],
    popular: false,
  },
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}
