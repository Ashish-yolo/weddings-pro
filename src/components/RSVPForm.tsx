import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Wedding = Database['public']['Tables']['weddings']['Row']

interface RSVPFormProps {
  wedding: Wedding
}

interface PlusOne {
  firstName: string
  lastName: string
  dietaryRestrictions: string
  songRequests: string
}

const RSVPForm: React.FC<RSVPFormProps> = ({ wedding }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dietaryRestrictions: '',
    songRequests: '',
    rsvpStatus: 'accepted' as 'accepted' | 'declined'
  })
  const [plusOnes, setPlusOnes] = useState<PlusOne[]>([])
  const [photos, setPhotos] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const addPlusOne = () => {
    setPlusOnes([...plusOnes, {
      firstName: '',
      lastName: '',
      dietaryRestrictions: '',
      songRequests: ''
    }])
  }

  const removePlusOne = (index: number) => {
    setPlusOnes(plusOnes.filter((_, i) => i !== index))
  }

  const updatePlusOne = (index: number, field: keyof PlusOne, value: string) => {
    const updated = [...plusOnes]
    updated[index][field] = value
    setPlusOnes(updated)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setPhotos(prev => [...prev, ...files].slice(0, 5)) // Limit to 5 photos
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Insert main guest
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .insert([{
          wedding_id: wedding.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          plus_one_count: plusOnes.length,
          dietary_restrictions: formData.dietaryRestrictions,
          song_requests: formData.songRequests,
          rsvp_status: 'pending', // All RSVPs start as pending for wedding creator approval
          attendance_intention: formData.rsvpStatus // Store guest's attendance choice
        }])
        .select()
        .single()

      if (guestError) throw guestError

      // Insert plus ones if any
      if (plusOnes.length > 0 && guestData) {
        const plusOneData = plusOnes.map(plusOne => ({
          guest_id: guestData.id,
          first_name: plusOne.firstName,
          last_name: plusOne.lastName,
          dietary_restrictions: plusOne.dietaryRestrictions,
          song_requests: plusOne.songRequests
        }))

        const { error: plusOneError } = await supabase
          .from('plus_ones')
          .insert(plusOneData)

        if (plusOneError) throw plusOneError
      }

      // Upload photos if any
      if (photos.length > 0 && guestData) {
        const guestFullName = `${formData.firstName} ${formData.lastName}`
        
        for (const photo of photos) {
          const fileExt = photo.name.split('.').pop()
          const uniqueFileName = `${wedding.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

          // Upload to Supabase storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('wedding-photos')
            .upload(uniqueFileName, photo)

          if (uploadError) {
            console.error('Photo upload error:', uploadError)
            continue // Skip this photo but don't fail the entire RSVP
          }

          // Save photo record to database
          await supabase
            .from('photos')
            .insert([{
              wedding_id: wedding.id,
              file_name: photo.name,
              file_path: uploadData.path,
              file_size: photo.size,
              mime_type: photo.type,
              uploaded_by_guest: guestFullName,
              photo_type: 'guest',
              approval_status: 'pending'
            }])
        }
      }

      setSuccess(true)
    } catch (error: any) {
      console.error('Error submitting RSVP:', error)
      setError(error.message || 'Failed to submit RSVP')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-2xl font-semibold mb-4">RSVP Submitted!</h2>
        <p className="text-gray-600">
          Thank you for your response. We're {formData.rsvpStatus === 'accepted' ? 'excited to celebrate with you' : 'sorry you can\'t make it'}!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">RSVP</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* RSVP Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Will you be attending?
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="accepted"
                checked={formData.rsvpStatus === 'accepted'}
                onChange={(e) => setFormData({ ...formData, rsvpStatus: e.target.value as 'accepted' })}
                className="mr-2"
              />
              Yes, I'll be there!
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="declined"
                checked={formData.rsvpStatus === 'declined'}
                onChange={(e) => setFormData({ ...formData, rsvpStatus: e.target.value as 'declined' })}
                className="mr-2"
              />
              Sorry, can't make it
            </label>
          </div>
        </div>

        {/* Guest Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {formData.rsvpStatus === 'accepted' && (
          <>
            {/* Plus Ones */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Guests
                </label>
                <button
                  type="button"
                  onClick={addPlusOne}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm hover:bg-purple-200 transition-colors"
                >
                  + Add Guest
                </button>
              </div>

              {plusOnes.map((plusOne, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">Guest {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removePlusOne(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={plusOne.firstName}
                      onChange={(e) => updatePlusOne(index, 'firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={plusOne.lastName}
                      onChange={(e) => updatePlusOne(index, 'lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Dietary Restrictions"
                      value={plusOne.dietaryRestrictions}
                      onChange={(e) => updatePlusOne(index, 'dietaryRestrictions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Song Requests"
                      value={plusOne.songRequests}
                      onChange={(e) => updatePlusOne(index, 'songRequests', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Dietary Restrictions */}
            <div>
              <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-1">
                Dietary Restrictions
              </label>
              <input
                type="text"
                id="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Any allergies or dietary requirements?"
              />
            </div>

            {/* Song Requests */}
            <div>
              <label htmlFor="songRequests" className="block text-sm font-medium text-gray-700 mb-1">
                Song Requests
              </label>
              <input
                type="text"
                id="songRequests"
                value={formData.songRequests}
                onChange={(e) => setFormData({ ...formData, songRequests: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Any songs you'd like to hear?"
              />
            </div>
          </>
        )}

        {/* Photo Upload Section */}
        {formData.rsvpStatus === 'accepted' && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📸</span>
              Share Photos (Optional)
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Share up to 5 photos with the happy couple! They'll review and approve them before they appear on the wedding page.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photos
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select up to 5 images (JPG, PNG, WebP)
                </p>
              </div>

              {photos.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected Photos:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {photo.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit RSVP'}
        </button>
      </form>
    </div>
  )
}

export default RSVPForm