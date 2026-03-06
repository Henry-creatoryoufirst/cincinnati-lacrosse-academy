'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { Event } from '@/lib/types'

interface EventFormProps {
  event?: Event | null
  isOpen: boolean
  onClose: () => void
}

interface EventFormData {
  title: string
  description: string
  event_type: 'training' | 'camp' | 'tournament' | 'clinic' | 'scrimmage'
  start_date: string
  end_date: string
  location: string
  address: string
  max_participants: number
  price: number
  member_price: number
  skill_levels: string[]
  age_groups: string[]
}

interface QuickPreset {
  label: string
  type: 'training' | 'camp' | 'tournament' | 'clinic' | 'scrimmage'
  emoji: string
  color: string
  description: string
  price: number
  memberPrice: number
  maxParticipants: number
  skillLevels: string[]
  ageGroups: string[]
  defaultDuration: number
}

const PRESETS: QuickPreset[] = [
  {
    label: 'HS/MS Training',
    type: 'training',
    emoji: '🥍',
    color: '#0891B2',
    description: 'Training session focused on skill development, game IQ, and competitive play. All skill levels welcome.',
    price: 40,
    memberPrice: 0,
    maxParticipants: 30,
    skillLevels: ['beginner', 'intermediate', 'advanced'],
    ageGroups: ['8-14', '15-18'],
    defaultDuration: 2,
  },
  {
    label: 'Camp',
    type: 'camp',
    emoji: '🏕️',
    color: '#2563EB',
    description: 'Full-day camp covering stick skills, shooting, defense, and live play. Lunch included.',
    price: 75,
    memberPrice: 60,
    maxParticipants: 40,
    skillLevels: ['beginner', 'intermediate', 'advanced'],
    ageGroups: ['10-14', '15-18'],
    defaultDuration: 6,
  },
  {
    label: 'Scrimmage',
    type: 'scrimmage',
    emoji: '🏟️',
    color: '#EA580C',
    description: 'Competitive scrimmage play. Great way to get live reps and apply what you\'ve been working on.',
    price: 25,
    memberPrice: 0,
    maxParticipants: 40,
    skillLevels: ['intermediate', 'advanced', 'elite'],
    ageGroups: ['12-18'],
    defaultDuration: 2,
  },
  {
    label: 'Youth Clinic',
    type: 'clinic',
    emoji: '🎯',
    color: '#7C3AED',
    description: 'Youth clinic with focused drills, stick skills, and coaching fundamentals.',
    price: 35,
    memberPrice: 0,
    maxParticipants: 20,
    skillLevels: ['beginner', 'intermediate'],
    ageGroups: ['8-14'],
    defaultDuration: 1.5,
  },
]

const DEFAULT_LOCATION = 'CLA Training Center'

const TIME_OPTIONS = [
  '7:00 AM', '7:30 AM',
  '8:00 AM', '8:30 AM',
  '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM',
  '7:00 PM',
]

function timeTo24(timeStr: string): string {
  const [time, period] = timeStr.split(' ')
  let [hours, minutes] = time.split(':').map(Number)
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

function formatDateTimeLocal(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    const pad = (n: number) => n.toString().padStart(2, '0')
    return [
      date.getFullYear(), '-', pad(date.getMonth() + 1), '-', pad(date.getDate()),
      'T', pad(date.getHours()), ':', pad(date.getMinutes()),
    ].join('')
  } catch {
    return ''
  }
}

function to12Hour(h: number, m: number): string {
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

export default function EventForm({ event, isOpen, onClose }: EventFormProps) {
  const router = useRouter()
  const isEditMode = !!event

  // Simple state
  const [selectedPreset, setSelectedPreset] = useState<QuickPreset | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('10:00 AM')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Advanced overrides (hidden by default)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(40)
  const [memberPrice, setMemberPrice] = useState(0)
  const [maxParticipants, setMaxParticipants] = useState(30)
  const [duration, setDuration] = useState(2)
  const [location, setLocation] = useState(DEFAULT_LOCATION)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset when opening
  useEffect(() => {
    if (!isOpen) return

    if (event) {
      // Edit mode: populate from event
      const d = new Date(event.start_date)
      const endD = new Date(event.end_date)
      const pad = (n: number) => n.toString().padStart(2, '0')
      setDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`)
      setTime(to12Hour(d.getHours(), d.getMinutes()))
      setTitle(event.title)
      setDescription(event.description)
      setPrice(event.price)
      setMemberPrice(event.member_price || 0)
      setMaxParticipants(event.max_participants)
      setLocation(event.location)
      const dur = (endD.getTime() - d.getTime()) / (1000 * 60 * 60)
      setDuration(dur > 0 ? dur : 2)
      setShowAdvanced(true)
      // Try to match a preset
      const match = PRESETS.find(p => p.type === event.event_type)
      setSelectedPreset(match || PRESETS[0])
    } else {
      // New mode: reset everything
      setSelectedPreset(PRESETS[0])
      setDate('')
      setTime('10:00 AM')
      setTitle('')
      setDescription('')
      setPrice(PRESETS[0].price)
      setMemberPrice(PRESETS[0].memberPrice)
      setMaxParticipants(PRESETS[0].maxParticipants)
      setDuration(PRESETS[0].defaultDuration)
      setLocation(DEFAULT_LOCATION)
      setShowAdvanced(false)
    }
    setError(null)
  }, [event, isOpen])

  function selectPreset(preset: QuickPreset) {
    setSelectedPreset(preset)
    setTitle('')
    setDescription('')
    setPrice(preset.price)
    setMemberPrice(preset.memberPrice)
    setMaxParticipants(preset.maxParticipants)
    setDuration(preset.defaultDuration)
    setError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!selectedPreset || !date) return

    setIsLoading(true)
    setError(null)

    const time24 = timeTo24(time)
    const startDate = `${date}T${time24}`
    const startH = parseInt(time24.split(':')[0])
    const startM = parseInt(time24.split(':')[1])
    const totalMinutes = startH * 60 + startM + duration * 60
    const endH = Math.floor(totalMinutes / 60)
    const endM = totalMinutes % 60
    const endDate = `${date}T${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`

    const payload: EventFormData = {
      title: title || selectedPreset.label,
      description: description || selectedPreset.description,
      event_type: selectedPreset.type,
      start_date: startDate,
      end_date: endDate,
      location,
      address: '',
      max_participants: maxParticipants,
      price,
      member_price: memberPrice,
      skill_levels: selectedPreset.skillLevels,
      age_groups: selectedPreset.ageGroups,
    }

    try {
      const url = '/api/admin/events'
      const method = isEditMode ? 'PUT' : 'POST'
      const body = isEditMode ? { id: event!.id, ...payload } : payload

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to save')
      }

      onClose()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const canSubmit = selectedPreset && date && !isLoading

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid #E5E7EB',
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#1A1A1A',
            margin: 0,
          }}>
            {isEditMode ? 'Edit Session' : 'New Session'}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: '#F3F4F6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#FEF2F2',
              border: '1px solid #FEE2E2',
              borderRadius: '10px',
              color: '#DC2626',
              fontSize: '0.8125rem',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          {/* Step 1: Type */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#9CA3AF',
              marginBottom: '10px',
            }}>
              What type?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {PRESETS.map((preset) => {
                const selected = selectedPreset?.type === preset.type
                return (
                  <button
                    key={preset.type}
                    type="button"
                    onClick={() => selectPreset(preset)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '12px',
                      border: selected ? `2px solid ${preset.color}` : '2px solid #E5E7EB',
                      background: selected ? `${preset.color}0A` : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{preset.emoji}</div>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: selected ? preset.color : '#374151',
                    }}>
                      {preset.label}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#9CA3AF', marginTop: '2px' }}>
                      ${preset.price}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 2: Date */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#9CA3AF',
              marginBottom: '10px',
            }}>
              When?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#6B7280',
                  marginBottom: '6px',
                }}>
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    fontSize: '0.875rem',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    background: '#F9FAFB',
                    color: '#1A1A1A',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#6B7280',
                  marginBottom: '6px',
                }}>
                  Start Time
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    fontSize: '0.875rem',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    background: '#F9FAFB',
                    color: '#1A1A1A',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                  }}
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Summary line */}
          {selectedPreset && date && (
            <div style={{
              padding: '14px 16px',
              background: '#F0FDF4',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '0.8125rem',
              color: '#065F46',
              lineHeight: 1.5,
            }}>
              <strong>{title || selectedPreset.label}</strong> on{' '}
              {new Date(date + 'T12:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              {' '}at {time} &middot; {duration}hr &middot; ${price} &middot; {maxParticipants} spots
            </div>
          )}

          {/* Advanced toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0',
              border: 'none',
              background: 'none',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: '#9CA3AF',
              cursor: 'pointer',
              marginBottom: showAdvanced ? '16px' : '24px',
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: showAdvanced ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.15s',
              }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            Customize details
          </button>

          {/* Advanced fields */}
          {showAdvanced && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              marginBottom: '24px',
              padding: '16px',
              background: '#F9FAFB',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#6B7280', marginBottom: '6px' }}>
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={selectedPreset?.label || 'Session title'}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    background: '#ffffff',
                    color: '#1A1A1A',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#6B7280', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={selectedPreset?.description || 'Describe the session...'}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    background: '#ffffff',
                    color: '#1A1A1A',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#6B7280', marginBottom: '6px' }}>
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    min={0}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '0.875rem',
                      borderRadius: '10px',
                      border: '1px solid #E5E7EB',
                      background: '#ffffff',
                      color: '#1A1A1A',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#6B7280', marginBottom: '6px' }}>
                    Spots
                  </label>
                  <input
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 1)}
                    min={1}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '0.875rem',
                      borderRadius: '10px',
                      border: '1px solid #E5E7EB',
                      background: '#ffffff',
                      color: '#1A1A1A',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#6B7280', marginBottom: '6px' }}>
                    Hours
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseFloat(e.target.value) || 1)}
                    min={0.5}
                    step={0.5}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '0.875rem',
                      borderRadius: '10px',
                      border: '1px solid #E5E7EB',
                      background: '#ffffff',
                      color: '#1A1A1A',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#6B7280', marginBottom: '6px' }}>
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    background: '#ffffff',
                    color: '#1A1A1A',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#6B7280', marginBottom: '6px' }}>
                  Member Price ($)
                </label>
                <input
                  type="number"
                  value={memberPrice}
                  onChange={(e) => setMemberPrice(parseFloat(e.target.value) || 0)}
                  min={0}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    background: '#ffffff',
                    color: '#1A1A1A',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              borderRadius: '12px',
              border: 'none',
              background: canSubmit ? '#1A1A1A' : '#E5E7EB',
              color: canSubmit ? '#ffffff' : '#9CA3AF',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Session' : 'Create Session'}
          </button>
        </form>
      </div>
    </div>
  )
}
