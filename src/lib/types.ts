export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  created_at: string
}

export interface Profile {
  id: string
  user_id: string
  full_name: string
  phone?: string
  date_of_birth?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'elite'
  position?: string
  membership_status?: 'none' | 'active' | 'expired' | 'cancelled'
  membership_plan?: string
  stripe_customer_id?: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  event_type: 'training' | 'camp' | 'tournament' | 'clinic' | 'scrimmage'
  start_date: string
  end_date: string
  location: string
  address?: string
  max_participants: number
  current_participants: number
  price: number
  member_price?: number
  image_url?: string
  skill_levels: string[]
  age_groups: string[]
  is_active: boolean
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  event_id: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended'
  payment_status: 'pending' | 'paid' | 'refunded'
  amount_paid: number
  stripe_payment_intent_id?: string
  created_at: string
  event?: Event
}

export interface Membership {
  id: string
  user_id: string
  plan_id: string
  status: 'active' | 'cancelled' | 'past_due' | 'expired'
  stripe_subscription_id: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
}
