'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, DollarSign, Calendar, ExternalLink, Loader2, Receipt } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/stripe'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'

interface Charge {
  id: string
  description: string
  date: string
  amount: number
  status: string
  receiptUrl: string | null
}

interface PaymentMethod {
  brand: string
  last4: string
  expMonth: number
  expYear: number
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export default function BillingPage() {
  const router = useRouter()
  const [charges, setCharges] = useState<Charge[]>([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?redirect=/dashboard/billing')
        return
      }

      try {
        const res = await fetch('/api/stripe/billing-history')
        if (res.ok) {
          const data = await res.json()
          setCharges(data.charges || [])
          setPaymentMethod(data.paymentMethod || null)
        }
      } catch {
        // silently fail — empty state shown
      }
      setLoading(false)
    }
    load()
  }, [router])

  const handleUpdatePayment = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/create-portal-session', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const totalPaid = charges
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="min-h-screen bg-secondary pt-[72px] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-muted hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Billing &amp; Payments</h1>
          <p className="text-muted mt-1">View your payment history and manage billing details.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatPrice(totalPaid)}</p>
                <p className="text-sm text-muted">Total Paid</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                <Receipt className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{charges.length}</p>
                <p className="text-sm text-muted">Transactions</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {charges.length > 0 ? formatDate(charges[0].date) : '—'}
                </p>
                <p className="text-sm text-muted">Last Payment</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Transaction History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-foreground">Transaction History</h2>
              </CardHeader>
              <CardContent className="p-0">
                {charges.length === 0 ? (
                  <div className="text-center py-12 px-6">
                    <Receipt className="w-12 h-12 text-muted mx-auto mb-3" />
                    <p className="text-muted">No transactions yet. Payments will appear here after your first booking or subscription.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left text-sm font-medium text-muted px-6 py-3">Description</th>
                          <th className="text-left text-sm font-medium text-muted px-6 py-3">Date</th>
                          <th className="text-left text-sm font-medium text-muted px-6 py-3">Amount</th>
                          <th className="text-left text-sm font-medium text-muted px-6 py-3">Status</th>
                          <th className="text-right text-sm font-medium text-muted px-6 py-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {charges.map((tx) => (
                          <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-foreground">{tx.description}</td>
                            <td className="px-6 py-4 text-sm text-muted">{formatDate(tx.date)}</td>
                            <td className="px-6 py-4 text-sm font-medium text-foreground">{formatPrice(tx.amount)}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                tx.status === 'paid'
                                  ? 'bg-green-100 text-green-700'
                                  : tx.status === 'refunded'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {tx.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {tx.receiptUrl && (
                                <a
                                  href={tx.receiptUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted hover:text-primary transition-colors"
                                  title="View receipt"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Method Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-foreground">Payment Method</h2>
              </CardHeader>
              <CardContent>
                {paymentMethod ? (
                  <>
                    <div className="bg-gradient-to-b from-[#111827] to-[#0a0a0b] rounded-xl p-5 text-white mb-4">
                      <div className="flex justify-between items-start mb-8">
                        <CreditCard className="w-8 h-8" />
                        <span className="text-sm font-medium uppercase">{paymentMethod.brand}</span>
                      </div>
                      <p className="text-lg font-mono tracking-widest mb-4">
                        &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; {paymentMethod.last4}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="text-cyan-200">Expires</span>
                        <span>{String(paymentMethod.expMonth).padStart(2, '0')}/{String(paymentMethod.expYear).slice(-2)}</span>
                      </div>
                    </div>
                    <button
                      className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 border-[1.5px] border-border text-foreground text-[0.9375rem] font-semibold rounded-full no-underline transition-all duration-200 hover:border-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleUpdatePayment}
                      disabled={portalLoading}
                    >
                      {portalLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Update Payment Method
                    </button>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <CreditCard className="w-10 h-10 text-muted mx-auto mb-2" />
                    <p className="text-sm text-muted mb-4">No payment method on file.</p>
                    <button
                      className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 border-[1.5px] border-border text-foreground text-[0.9375rem] font-semibold rounded-full no-underline transition-all duration-200 hover:border-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleUpdatePayment}
                      disabled={portalLoading}
                    >
                      {portalLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Add Payment Method
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
