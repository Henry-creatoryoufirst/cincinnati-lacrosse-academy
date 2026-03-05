'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, CreditCard, User, Calendar, Loader2, Shield, MapPin, Clock, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import { formatPrice } from '@/lib/stripe'
import type { Event } from '@/lib/types'

export default function BookEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const supabase = createClient()

  const [eventId, setEventId] = useState<string>('')
  const [event, setEvent] = useState<Event | null>(null)
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null)
  const [isMember, setIsMember] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    participantName: '',
    participantAge: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalNotes: '',
    agreeToTerms: false,
  })

  // Resolve params and fetch data
  useEffect(() => {
    const init = async () => {
      const { id } = await params
      setEventId(id)

      // Check auth
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push(`/auth/login?redirect=/events/${id}/book`)
        return
      }
      setUser(authUser)
      setFormData(prev => ({
        ...prev,
        participantName: authUser.user_metadata?.full_name || '',
      }))

      // Fetch event
      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (!eventData) {
        router.push('/events')
        return
      }
      setEvent(eventData)

      // Check membership
      const { data: profile } = await supabase
        .from('profiles')
        .select('membership_status')
        .eq('user_id', authUser.id)
        .single()

      setIsMember(profile?.membership_status === 'active')
      setIsLoading(false)
    }
    init()
  }, [params, supabase, router])

  const price = event
    ? (isMember && event.member_price != null && event.member_price < event.price
        ? event.member_price
        : event.price)
    : 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleContinue = () => {
    if (step === 1) {
      setStep(2)
    } else {
      handleStripePayment()
    }
  }

  const handleStripePayment = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          participantName: formData.participantName,
          participantAge: formData.participantAge ? parseInt(formData.participantAge) : null,
          emergencyContactName: formData.emergencyContact,
          emergencyContactPhone: formData.emergencyPhone,
          medicalNotes: formData.medicalNotes || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to process booking')
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F4F5F7', paddingTop: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 className="w-10 h-10 text-primary animate-spin" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#6B7280', fontSize: '0.9375rem' }}>Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div style={{ minHeight: '100vh', background: '#F4F5F7', paddingTop: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '16px' }}>Event Not Found</h1>
          <Link
            href="/events"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '14px 32px', background: '#1A1A1A', color: '#fff',
              fontSize: '0.9375rem', fontWeight: 600, borderRadius: '9999px',
              textDecoration: 'none',
            }}
          >
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  const spotsLeft = event.max_participants - event.current_participants

  const steps = [
    { icon: User, label: 'Details' },
    { icon: CreditCard, label: 'Payment' },
    { icon: CheckCircle, label: 'Confirm' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #F8F9FB 0%, #F1F3F5 100%)', paddingTop: '72px' }}>
      {/* Compact header bar */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 24px',
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            href={`/events/${eventId}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6B7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Back to Event
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.8125rem' }}>
            <Lock style={{ width: '13px', height: '13px' }} />
            Secure Checkout
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Progress Steps — refined horizontal stepper */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
          {steps.map((s, i) => {
            const Icon = s.icon
            const isActive = step >= i + 1
            const isComplete = step > i + 1
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isComplete ? '#059669' : isActive ? '#1A1A1A' : '#E5E7EB',
                    color: isActive || isComplete ? '#fff' : '#9CA3AF',
                    transition: 'all 0.3s ease',
                  }}>
                    {isComplete ? (
                      <CheckCircle style={{ width: '20px', height: '20px' }} />
                    ) : (
                      <Icon style={{ width: '18px', height: '18px' }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: '0.6875rem', fontWeight: 600,
                    letterSpacing: '0.05em', textTransform: 'uppercase' as const,
                    color: isActive ? '#1A1A1A' : '#9CA3AF',
                  }}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    width: '64px', height: '2px', margin: '0 16px', marginBottom: '22px',
                    background: step > i + 1 ? '#059669' : step > i ? '#1A1A1A' : '#E5E7EB',
                    borderRadius: '1px', transition: 'background 0.3s ease',
                  }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: '12px', padding: '14px 20px', marginBottom: '24px',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: '#DC2626', fontSize: '14px', fontWeight: 700 }}>!</span>
            </div>
            <p style={{ color: '#991B1B', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>{error}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="lg:!grid-cols-[1fr_340px]">
          {/* Main Form Card */}
          <div>
            <div style={{
              background: '#fff', borderRadius: '16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
              overflow: 'hidden',
            }}>
              {/* Card header with subtle accent */}
              <div style={{
                padding: '24px 28px',
                borderBottom: '1px solid #F1F3F5',
                background: 'linear-gradient(135deg, #FAFBFC 0%, #F8F9FB 100%)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: step === 1 ? '#EFF6FF' : '#F0FDF4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {step === 1 ? (
                      <User style={{ width: '18px', height: '18px', color: '#2563EB' }} />
                    ) : (
                      <CreditCard style={{ width: '18px', height: '18px', color: '#059669' }} />
                    )}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
                      {step === 1 ? 'Participant Information' : 'Review & Pay'}
                    </h2>
                    <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>
                      {step === 1 ? 'Tell us about the participant' : 'Confirm details and complete payment'}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '28px' }}>
                {step === 1 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Two-column name/age row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="max-sm:!grid-cols-1">
                      <Input
                        id="participantName"
                        name="participantName"
                        label="Participant Full Name"
                        value={formData.participantName}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        id="participantAge"
                        name="participantAge"
                        type="number"
                        label="Age"
                        value={formData.participantAge}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Section divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
                      <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9CA3AF' }}>Emergency Contact</span>
                      <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="max-sm:!grid-cols-1">
                      <Input
                        id="emergencyContact"
                        name="emergencyContact"
                        label="Contact Name"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        id="emergencyPhone"
                        name="emergencyPhone"
                        type="tel"
                        label="Phone Number"
                        value={formData.emergencyPhone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="medicalNotes" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#1A1A1A', marginBottom: '8px' }}>
                        Medical Notes / Allergies <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(Optional)</span>
                      </label>
                      <textarea
                        id="medicalNotes"
                        name="medicalNotes"
                        rows={3}
                        value={formData.medicalNotes}
                        onChange={handleChange}
                        style={{
                          width: '100%', padding: '12px 16px', borderRadius: '12px',
                          border: '1px solid #E5E7EB', background: '#fff', color: '#1A1A1A',
                          fontSize: '0.9375rem', lineHeight: 1.5, resize: 'none' as const,
                          outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)' }}
                        onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
                        placeholder="Any medical conditions or allergies we should know about..."
                      />
                    </div>

                    {/* Terms checkbox */}
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', padding: '14px 16px', borderRadius: '12px', background: '#F8F9FB', border: '1px solid #F1F3F5' }}>
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#2563EB', cursor: 'pointer' }}
                        required
                      />
                      <span style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.5 }}>
                        I agree to the{' '}
                        <Link href="/terms" style={{ color: '#2563EB', textDecoration: 'none' }}>Terms of Service</Link>,{' '}
                        <Link href="/privacy" style={{ color: '#2563EB', textDecoration: 'none' }}>Privacy Policy</Link>, and{' '}
                        <Link href="/refunds" style={{ color: '#2563EB', textDecoration: 'none' }}>Refund Policy</Link>
                      </span>
                    </label>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Booking details review */}
                    <div style={{
                      borderRadius: '12px', border: '1px solid #E5E7EB',
                      overflow: 'hidden',
                    }}>
                      <div style={{ padding: '14px 20px', background: '#F8F9FB', borderBottom: '1px solid #F1F3F5' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#6B7280' }}>
                          Booking Details
                        </span>
                      </div>
                      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                          <span style={{ color: '#6B7280' }}>Participant</span>
                          <span style={{ color: '#1A1A1A', fontWeight: 500 }}>{formData.participantName}</span>
                        </div>
                        {formData.participantAge && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span style={{ color: '#6B7280' }}>Age</span>
                            <span style={{ color: '#1A1A1A', fontWeight: 500 }}>{formData.participantAge}</span>
                          </div>
                        )}
                        {formData.emergencyContact && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span style={{ color: '#6B7280' }}>Emergency Contact</span>
                            <span style={{ color: '#1A1A1A', fontWeight: 500 }}>{formData.emergencyContact}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stripe redirect notice */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '20px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #F8F9FB 0%, #EFF6FF 100%)',
                      border: '1px solid #E0E7FF',
                    }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: '#fff', border: '1px solid #E0E7FF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        boxShadow: '0 1px 3px rgba(37,99,235,0.08)',
                      }}>
                        <Shield style={{ width: '20px', height: '20px', color: '#2563EB' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
                          Secure Payment via Stripe
                        </p>
                        <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '2px 0 0' }}>
                          You&apos;ll be redirected to Stripe&apos;s secure checkout to complete payment.
                        </p>
                      </div>
                    </div>

                    {/* Card brand badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      {['Visa', 'Mastercard', 'Amex', 'Discover'].map((brand) => (
                        <div key={brand} style={{
                          padding: '6px 12px', borderRadius: '6px',
                          border: '1px solid #E5E7EB', background: '#fff',
                          fontSize: '0.6875rem', fontWeight: 600,
                          color: '#6B7280', letterSpacing: '0.02em',
                        }}>
                          {brand}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                  {step > 1 && (
                    <button
                      onClick={() => { setStep(1); setError(null) }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        padding: '14px 28px', border: '1.5px solid #E5E7EB',
                        background: '#fff', color: '#1A1A1A', fontSize: '0.9375rem',
                        fontWeight: 600, borderRadius: '12px', cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1A1A1A' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB' }}
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={handleContinue}
                    disabled={(step === 1 && !formData.agreeToTerms) || isSubmitting}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      flex: 1, padding: '14px 28px',
                      background: step === 2 ? '#2563EB' : '#1A1A1A',
                      color: '#fff', fontSize: '0.9375rem', fontWeight: 600,
                      borderRadius: '12px', border: 'none', cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: ((step === 1 && !formData.agreeToTerms) || isSubmitting) ? 0.5 : 1,
                      boxShadow: step === 2 ? '0 4px 14px rgba(37,99,235,0.3)' : '0 4px 14px rgba(0,0,0,0.15)',
                    }}
                  >
                    {isSubmitting && <Loader2 style={{ width: '16px', height: '16px', marginRight: '8px' }} className="animate-spin" />}
                    {step === 1 ? 'Continue to Payment' : `Pay ${formatPrice(price)}`}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div style={{ position: 'sticky', top: '96px' }}>
              <div style={{
                background: '#fff', borderRadius: '16px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
                overflow: 'hidden',
              }}>
                {/* Event mini-card at top */}
                <div style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
                  color: '#fff',
                }}>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px',
                    background: 'rgba(255,255,255,0.15)', borderRadius: '6px',
                    fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase' as const,
                    letterSpacing: '0.05em', marginBottom: '10px',
                  }}>
                    {event.event_type}
                  </span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 12px', lineHeight: 1.3 }}>
                    {event.title}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)' }}>
                      <Calendar style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                      {new Date(event.start_date).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </div>
                    {event.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)' }}>
                        <MapPin style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing breakdown */}
                <div style={{ padding: '20px' }}>
                  {spotsLeft <= 5 && spotsLeft > 0 && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 12px', borderRadius: '8px',
                      background: '#FFFBEB', border: '1px solid #FDE68A',
                      marginBottom: '16px',
                    }}>
                      <Clock style={{ width: '14px', height: '14px', color: '#D97706', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#92400E' }}>
                        Only {spotsLeft} spot{spotsLeft === 1 ? '' : 's'} left
                      </span>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: '#6B7280' }}>Event Price</span>
                      <span style={{ color: '#1A1A1A', fontWeight: 500 }}>{formatPrice(event.price)}</span>
                    </div>
                    {isMember && event.member_price != null && event.member_price < event.price && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span style={{ color: '#059669' }}>Member Discount</span>
                        <span style={{ color: '#059669', fontWeight: 500 }}>-{formatPrice(event.price - event.member_price)}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ height: '1px', background: '#E5E7EB', margin: '16px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A1A' }}>Total</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563EB', letterSpacing: '-0.02em' }}>
                      {formatPrice(price)}
                    </span>
                  </div>

                  {!isMember && event.member_price != null && event.member_price < event.price && (
                    <div style={{
                      marginTop: '16px', padding: '12px 14px', borderRadius: '10px',
                      background: '#F0FDF4', border: '1px solid #BBF7D0',
                    }}>
                      <p style={{ fontSize: '0.8125rem', color: '#166534', margin: 0, fontWeight: 500 }}>
                        Members save {formatPrice(event.price - event.member_price)} on this event.{' '}
                        <Link href="/membership" style={{ color: '#059669', fontWeight: 600, textDecoration: 'underline' }}>
                          Join now
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Trust signals */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '16px', marginTop: '16px', padding: '0 8px',
              }}>
                {[
                  { icon: Shield, text: 'Secure' },
                  { icon: Lock, text: 'Encrypted' },
                  { icon: CheckCircle, text: 'Guaranteed' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon style={{ width: '12px', height: '12px', color: '#9CA3AF' }} />
                    <span style={{ fontSize: '0.6875rem', color: '#9CA3AF', fontWeight: 500 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
