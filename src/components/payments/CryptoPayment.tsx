'use client'

import { useCallback } from 'react'
import { Checkout, CheckoutButton, CheckoutStatus } from '@coinbase/onchainkit/checkout'
import type { LifecycleStatus } from '@coinbase/onchainkit/checkout'

interface CryptoPaymentProps {
  eventName: string
  eventId: string
  userId: string
  amount: number // in dollars (e.g. 299)
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function CryptoPayment({
  eventName,
  eventId,
  userId,
  amount,
  onSuccess,
  onError,
}: CryptoPaymentProps) {
  const chargeHandler = useCallback(async () => {
    try {
      const response = await fetch('/api/create-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount.toString(),
          eventName,
          eventId,
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create charge')
      }

      const { data } = await response.json()
      return data.id
    } catch (err) {
      console.error('Charge creation error:', err)
      onError?.('Failed to initiate crypto payment. Please try again.')
      return undefined
    }
  }, [amount, eventName, eventId, userId, onError])

  const handleStatus = useCallback(
    (status: LifecycleStatus) => {
      if (status.statusName === 'success') {
        onSuccess?.()
      }
      if (status.statusName === 'error') {
        onError?.('Payment failed or was cancelled. Please try again.')
      }
    },
    [onSuccess, onError]
  )

  return (
    <div className="w-full">
      <Checkout chargeHandler={chargeHandler} onStatus={handleStatus}>
        <CheckoutButton
          coinbaseBranded
          className="w-full rounded-xl"
        />
        <CheckoutStatus />
      </Checkout>
    </div>
  )
}
