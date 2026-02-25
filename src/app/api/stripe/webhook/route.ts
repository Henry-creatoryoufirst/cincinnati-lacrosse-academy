import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const eventId = session.metadata?.event_id
        const bookingId = session.metadata?.booking_id
        const planId = session.metadata?.plan_id

        // Handle event booking payment
        if (bookingId && eventId) {
          const { error } = await adminSupabase
            .from('bookings')
            .update({
              status: 'confirmed',
              payment_status: 'paid',
              amount_paid: (session.amount_total || 0) / 100,
              stripe_payment_intent_id: session.payment_intent as string,
            })
            .eq('id', bookingId)

          if (error) {
            console.error('Failed to update booking:', error)
          } else {
            console.log(`Booking ${bookingId} confirmed for event ${eventId}`)
          }
        }

        // Handle subscription/membership payment
        if (planId && userId) {
          const subscriptionId = session.subscription as string

          const { error: membershipError } = await adminSupabase
            .from('memberships')
            .upsert({
              user_id: userId,
              plan_id: planId,
              status: 'active',
              stripe_subscription_id: subscriptionId || null,
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            }, { onConflict: 'user_id' })

          if (membershipError) {
            console.error('Failed to upsert membership:', membershipError)
          }

          const { error: profileError } = await adminSupabase
            .from('profiles')
            .update({
              membership_status: 'active',
              membership_plan: planId,
            })
            .eq('user_id', userId)

          if (profileError) {
            console.error('Failed to update profile membership:', profileError)
          } else {
            console.log(`Membership activated for user ${userId}, plan ${planId}`)
          }
        }

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const status = subscription.status === 'active' ? 'active'
          : subscription.status === 'past_due' ? 'past_due'
          : 'cancelled'

        // Period dates are on the subscription item in newer Stripe API versions
        const item = subscription.items?.data?.[0]
        const periodStart = item?.current_period_start
          ? new Date(item.current_period_start * 1000).toISOString()
          : new Date().toISOString()
        const periodEnd = item?.current_period_end
          ? new Date(item.current_period_end * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

        await adminSupabase
          .from('memberships')
          .update({
            status,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: periodStart,
            current_period_end: periodEnd,
          })
          .eq('stripe_subscription_id', subscription.id)

        const { data: membership } = await adminSupabase
          .from('memberships')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (membership) {
          await adminSupabase
            .from('profiles')
            .update({ membership_status: status })
            .eq('user_id', membership.user_id)
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        const { data: membership } = await adminSupabase
          .from('memberships')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        await adminSupabase
          .from('memberships')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', subscription.id)

        if (membership) {
          await adminSupabase
            .from('profiles')
            .update({ membership_status: 'cancelled' })
            .eq('user_id', membership.user_id)
        }

        break
      }

      case 'invoice.payment_succeeded': {
        console.log(`Payment succeeded for invoice ${(event.data.object as Stripe.Invoice).id}`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const sub = invoice.parent?.subscription_details?.subscription
        const subscriptionId = typeof sub === 'string' ? sub : sub?.id

        if (subscriptionId) {
          await adminSupabase
            .from('memberships')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', subscriptionId)

          const { data: membership } = await adminSupabase
            .from('memberships')
            .select('user_id')
            .eq('stripe_subscription_id', subscriptionId)
            .single()

          if (membership) {
            await adminSupabase
              .from('profiles')
              .update({ membership_status: 'past_due' })
              .eq('user_id', membership.user_id)
          }
        }

        console.log(`Payment failed for invoice ${invoice.id}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
