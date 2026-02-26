import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Stripe customer ID from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      })
      if (customers.data.length === 0) {
        return NextResponse.json({ charges: [], paymentMethod: null })
      }
      customerId = customers.data[0].id
    }

    // Fetch recent charges
    const charges = await stripe.charges.list({
      customer: customerId,
      limit: 20,
    })

    // Fetch default payment method
    const customer = await stripe.customers.retrieve(customerId)
    let paymentMethod = null

    if (!('deleted' in customer) && customer.invoice_settings?.default_payment_method) {
      const pm = await stripe.paymentMethods.retrieve(
        customer.invoice_settings.default_payment_method as string
      )
      if (pm.card) {
        paymentMethod = {
          brand: pm.card.brand,
          last4: pm.card.last4,
          expMonth: pm.card.exp_month,
          expYear: pm.card.exp_year,
        }
      }
    }

    const formattedCharges = charges.data.map((charge) => ({
      id: charge.id,
      description: charge.description || (charge.metadata?.event_id ? 'Event booking' : 'Payment'),
      date: new Date(charge.created * 1000).toISOString(),
      amount: charge.amount / 100,
      status: charge.refunded ? 'refunded' : charge.status === 'succeeded' ? 'paid' : charge.status,
      receiptUrl: charge.receipt_url,
    }))

    return NextResponse.json({
      charges: formattedCharges,
      paymentMethod,
    })
  } catch (error) {
    console.error('Billing history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch billing history' },
      { status: 500 }
    )
  }
}
