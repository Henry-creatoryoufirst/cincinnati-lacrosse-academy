'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Input from '@/components/ui/Input'

export default function ProfilePage() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    emergencyName: '',
    emergencyPhone: '',
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-secondary pt-[72px] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-muted hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
          <p className="text-muted mt-1">Update your personal information and emergency contact.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  id="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  value={form.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                />
                <Input
                  id="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={form.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Contact Details</h2>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                <Input
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Location</h2>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  id="city"
                  label="City"
                  placeholder="Cincinnati"
                  value={form.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
                <Input
                  id="state"
                  label="State"
                  placeholder="OH"
                  value={form.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Emergency Contact</h2>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  id="emergencyName"
                  label="Contact Name"
                  placeholder="Full name"
                  value={form.emergencyName}
                  onChange={(e) => handleChange('emergencyName', e.target.value)}
                />
                <Input
                  id="emergencyPhone"
                  label="Contact Phone"
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={form.emergencyPhone}
                  onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-foreground text-white text-base font-semibold rounded-full no-underline transition-all duration-200 hover:bg-[#333] hover:shadow-md hover:-translate-y-0.5"
            >
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
            {saved && (
              <span className="inline-flex items-center text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-1" />
                Profile updated successfully
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
