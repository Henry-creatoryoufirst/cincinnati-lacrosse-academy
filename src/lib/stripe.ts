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
  monthly: {
    id: 'monthly',
    name: 'Monthly Membership',
    description: 'Full access to all training sessions and events',
    price: 99,
    interval: 'month' as const,
    features: [
      'Unlimited training sessions',
      'Access to all events',
      'Equipment rental included',
      'Priority event booking',
      'Member-only content',
    ],
    popular: false,
  },
  quarterly: {
    id: 'quarterly',
    name: 'Quarterly Membership',
    description: 'Save 15% with quarterly billing',
    price: 249,
    interval: 'quarter' as const,
    features: [
      'Everything in Monthly',
      '15% savings',
      'Free guest passes (2/quarter)',
      'Exclusive workshops',
      'Performance tracking',
    ],
    popular: false,
  },
  annual: {
    id: 'annual',
    name: 'Annual Membership',
    description: 'Best value - save 25%',
    price: 899,
    interval: 'year' as const,
    features: [
      'Everything in Quarterly',
      '25% savings',
      'Free gear package',
      'VIP event access',
      'Private coaching session',
      '1-on-1 player assessment',
    ],
    popular: true,
  },
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}
