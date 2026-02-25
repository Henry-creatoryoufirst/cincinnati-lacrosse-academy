import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { amount, eventName, eventId, userId } = await req.json()

    if (!amount || !eventName) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, eventName' },
        { status: 400 }
      )
    }

    const apiKey = process.env.COINBASE_COMMERCE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Coinbase Commerce is not configured' },
        { status: 503 }
      )
    }

    const response = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CC-Api-Key': apiKey,
      },
      body: JSON.stringify({
        local_price: {
          amount: amount.toString(),
          currency: 'USD',
        },
        pricing_type: 'fixed_price',
        name: eventName,
        description: `Payment for ${eventName} — Cincinnati Lacrosse Academy`,
        metadata: {
          event_id: eventId || '',
          user_id: userId || '',
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Coinbase Commerce error:', errorData)
      return NextResponse.json(
        { error: 'Failed to create charge' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Create charge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
