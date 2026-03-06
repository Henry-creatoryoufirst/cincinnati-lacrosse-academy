'use client'

import { useState } from 'react'
import EventList from '@/components/admin/EventList'
import EventForm from '@/components/admin/EventForm'
import SubscriberList from '@/components/admin/SubscriberList'
import SmsBroadcast from '@/components/admin/SmsBroadcast'
import type { Event } from '@/lib/types'

interface AdminDashboardProps {
  firstName: string
  events: Event[]
  stats: {
    upcoming: number
    active: number
    bookings: number
    subscribers: number
  }
}

export default function AdminDashboard({ firstName, events, stats }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'community'>('events')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const statItems = [
    { value: stats.upcoming, label: 'Upcoming', color: '#059669' },
    { value: stats.active, label: 'Active', color: '#0891b2' },
    { value: stats.bookings, label: 'Bookings', color: '#7c3aed' },
    { value: stats.subscribers, label: 'Subscribers', color: '#d97706' },
  ]

  return (
    <main style={{ paddingTop: '72px', minHeight: '100vh', background: '#F8F9FA' }}>
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px' }}>

        {/* Header + Stats Row */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <div>
            <p style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#2563EB',
              marginBottom: '8px',
            }}>
              Admin
            </p>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: '#1A1A1A',
              margin: 0,
            }}>
              Hey, {firstName}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            {statItems.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: s.color,
                  lineHeight: 1,
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  color: '#6B7280',
                  marginTop: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Session Button */}
        <button
          onClick={() => setIsFormOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            borderRadius: '12px',
            border: 'none',
            background: '#1A1A1A',
            color: '#ffffff',
            cursor: 'pointer',
            marginBottom: '32px',
            transition: 'opacity 0.15s',
            fontFamily: 'inherit',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Session
        </button>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '24px',
          background: '#E5E7EB',
          borderRadius: '12px',
          padding: '4px',
          width: 'fit-content',
        }}>
          {([
            { key: 'events' as const, label: 'Events' },
            { key: 'community' as const, label: 'Community' },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '8px 20px',
                fontSize: '0.8125rem',
                fontWeight: 500,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === tab.key ? '#ffffff' : 'transparent',
                color: activeTab === tab.key ? '#1A1A1A' : '#6B7280',
                boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'events' && (
          <EventList events={events} />
        )}

        {activeTab === 'community' && (
          <>
            <SubscriberList />
            <SmsBroadcast />
          </>
        )}

        {/* Full Event Form Modal */}
        <EventForm
          event={null}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
        />
      </div>
    </main>
  )
}
