import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      eventId,
      participantName,
      participantAge,
      emergencyContactName,
      emergencyContactPhone,
      medicalNotes,
    } = await request.json()

    if (!eventId || !participantName) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId, participantName' },
        { status: 400 }
      )
    }

    // Fetch event to get price and check availability
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .eq('is_active', true)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check capacity
    if (event.current_participants >= event.max_participants) {
      return NextResponse.json({ error: 'Event is sold out' }, { status: 409 })
    }

    // Check for duplicate booking
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .single()

    if (existingBooking && existingBooking.status !== 'cancelled') {
      return NextResponse.json(
        { error: 'You already have a booking for this event' },
        { status: 409 }
      )
    }

    // Check membership for member pricing
    const { data: profile } = await supabase
      .from('profiles')
      .select('membership_status, stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    const isMember = profile?.membership_status === 'active'
    const price = isMember && event.member_price != null && event.member_price < event.price
      ? event.member_price
      : event.price

    // Create pending booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .upsert({
        user_id: user.id,
        event_id: eventId,
        participant_name: participantName,
        participant_age: participantAge || null,
        emergency_contact_name: emergencyContactName || null,
        emergency_contact_phone: emergencyContactPhone || null,
        medical_notes: medicalNotes || null,
        status: 'pending',
        payment_status: 'pending',
        amount_paid: price,
      }, { onConflict: 'user_id,event_id' })
      .select()
      .single()

    if (bookingError || !booking) {
      console.error('Booking creation error:', bookingError)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    // Create or retrieve Stripe customer
    let customerId: string | undefined = profile?.stripe_customer_id || undefined

    if (!customerId) {
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      })

      if (customers.data.length > 0) {
        customerId = customers.data[0].id
      } else {
        const customer = await stripe.customers.create({
          email: user.email!,
          metadata: { supabase_user_id: user.id },
        })
        customerId = customer.id
      }

      // Save Stripe customer ID to profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', user.id)
    }

    // Create Stripe checkout session with dynamic price_data
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: event.title,
              description: `${event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)} — Cincinnati Lacrosse Academy`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?booking=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}`,
      metadata: {
        user_id: user.id,
        event_id: eventId,
        booking_id: booking.id,
      },
    })

    return NextResponse.json({ url: session.url, bookingId: booking.id })
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    )
  }
}
