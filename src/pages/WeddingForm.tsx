import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import WeddingPhotoUpload from '../components/WeddingPhotoUpload'

const WeddingForm: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [formData, setFormData] = useState({
    title: '',
    bride_name: '',
    groom_name: '',
    wedding_date: '',
    wedding_time: '',
    venue: '',
    address: '',
    description: '',
    photo_password: '',
    cover_photo_url: '',
    cover_photo_path: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    if (isEditing) {
      fetchWedding()
    }
  }, [user, navigate, isEditing, id])

  const fetchWedding = async () => {
    if (!id) return

    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setFormData({
        title: data.title || '',
        bride_name: data.bride_name || '',
        groom_name: data.groom_name || '',
        wedding_date: data.wedding_date || '',
        wedding_time: data.wedding_time || '',
        venue: data.venue || '',
        address: data.address || '',
        description: data.description || '',
        photo_password: data.photo_password || '',
        cover_photo_url: data.cover_photo_url || '',
        cover_photo_path: data.cover_photo_path || ''
      })
    } catch (error) {
      console.error('Error fetching wedding:', error)
      setError('Failed to load wedding data')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    try {
      // Generate slug from names
      const slug = `${formData.bride_name}-${formData.groom_name}-wedding`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const weddingData = {
        ...formData,
        user_id: user.id,
        public_url_slug: isEditing ? undefined : slug
      }

      let result
      let weddingId = id
      
      if (isEditing) {
        result = await supabase
          .from('weddings')
          .update(weddingData)
          .eq('id', id)
      } else {
        result = await supabase
          .from('weddings')
          .insert([weddingData])
          .select()
        
        if (result.data && result.data[0]) {
          weddingId = result.data[0].id
        }
      }

      if (result.error) throw result.error

      // Handle cover photo in photos table
      if (formData.cover_photo_url && formData.cover_photo_path && weddingId) {
        if (!isEditing) {
          // Creating new wedding - insert cover photo
          await supabase
            .from('photos')
            .insert([{
              wedding_id: weddingId,
              file_name: 'Wedding Cover Photo',
              file_path: formData.cover_photo_path,
              file_size: null,
              mime_type: 'image/jpeg',
              uploaded_by_guest: 'Wedding Creator',
              photo_type: 'cover',
              approval_status: 'approved'
            }])
        } else {
          // Editing existing wedding - check if cover photo already exists
          const { data: existingCover } = await supabase
            .from('photos')
            .select('id')
            .eq('wedding_id', weddingId)
            .eq('photo_type', 'cover')
            .single()

          if (!existingCover) {
            // No existing cover photo, insert new one
            await supabase
              .from('photos')
              .insert([{
                wedding_id: weddingId,
                file_name: 'Wedding Cover Photo',
                file_path: formData.cover_photo_path,
                file_size: null,
                mime_type: 'image/jpeg',
                uploaded_by_guest: 'Wedding Creator',
                photo_type: 'cover',
                approval_status: 'approved'
              }])
          } else {
            // Update existing cover photo
            await supabase
              .from('photos')
              .update({
                file_path: formData.cover_photo_path,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingCover.id)
          }
        }
      } else if (isEditing && weddingId) {
        // If editing and no cover photo, remove existing cover photo from photos table
        await supabase
          .from('photos')
          .delete()
          .eq('wedding_id', weddingId)
          .eq('photo_type', 'cover')
      }

      navigate('/dashboard')
    } catch (error: any) {
      console.error('Error saving wedding:', error)
      setError(error.message || 'Failed to save wedding')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (url: string | null, path: string | null) => {
    setFormData(prev => ({
      ...prev,
      cover_photo_url: url || '',
      cover_photo_path: path || ''
    }))
  }

  const steps = [
    { number: 1, title: 'Basic Info', icon: '💒' },
    { number: 2, title: 'Photo & Details', icon: '📸' },
    { number: 3, title: 'Settings', icon: '⚙️' }
  ]

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          
          <div className="inline-flex items-center px-6 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg mb-6">
            <span className="text-2xl mr-2">✨</span>
            <span className="text-sm font-medium text-purple-600">
              {isEditing ? 'Edit Your Wedding' : 'Create Your Dream Wedding'}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isEditing ? 'Edit Wedding Details' : 'Plan Your Perfect Day'}
          </h1>
          <p className="text-xl text-gray-600">
            {isEditing ? 'Update your wedding information' : 'Let\'s create something beautiful together'}
          </p>
        </div>

        {/* Progress Steps */}
        {!isEditing && (
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              {steps.map((step) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold ${
                    currentStep >= step.number 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <span className="text-lg">{step.number <= currentStep ? step.icon : step.number}</span>
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-purple-600' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                  {step.number < steps.length && (
                    <div className={`w-8 h-0.5 mx-4 ${currentStep > step.number ? 'bg-purple-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-8">
            {/* Step 1: Basic Info */}
            {(isEditing || currentStep >= 1) && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <div className="text-3xl mr-3">💒</div>
                  <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                      Wedding Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="e.g., Sarah & Michael's Wedding"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="bride_name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Bride's Name
                      </label>
                      <input
                        type="text"
                        id="bride_name"
                        name="bride_name"
                        value={formData.bride_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="First & Last Name"
                      />
                    </div>
                    <div>
                      <label htmlFor="groom_name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Groom's Name
                      </label>
                      <input
                        type="text"
                        id="groom_name"
                        name="groom_name"
                        value={formData.groom_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="First & Last Name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="wedding_date" className="block text-sm font-semibold text-gray-700 mb-2">
                        Wedding Date *
                      </label>
                      <input
                        type="date"
                        id="wedding_date"
                        name="wedding_date"
                        value={formData.wedding_date}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="wedding_time" className="block text-sm font-semibold text-gray-700 mb-2">
                        Wedding Time
                      </label>
                      <input
                        type="time"
                        id="wedding_time"
                        name="wedding_time"
                        value={formData.wedding_time}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Photo & Details */}
            {(isEditing || currentStep >= 2) && (
              <div className="space-y-8 pt-8 border-t border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="text-3xl mr-3">📸</div>
                  <h2 className="text-2xl font-bold text-gray-900">Photo & Wedding Details</h2>
                </div>

                {/* Photo Upload Section */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                  <WeddingPhotoUpload
                    currentPhotoUrl={formData.cover_photo_url || undefined}
                    onPhotoChange={handlePhotoChange}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="venue" className="block text-sm font-semibold text-gray-700 mb-2">
                      Venue
                    </label>
                    <input
                      type="text"
                      id="venue"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="e.g., Grand Ballroom, Beach Resort"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Full address for your guests"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                      Wedding Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                      placeholder="Share your love story, special details, or any information you'd like your guests to know..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Settings */}
            {(isEditing || currentStep >= 3) && (
              <div className="space-y-6 pt-8 border-t border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="text-3xl mr-3">⚙️</div>
                  <h2 className="text-2xl font-bold text-gray-900">Privacy Settings</h2>
                </div>

                <div>
                  <label htmlFor="photo_password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Photo Upload Password *
                  </label>
                  <input
                    type="password"
                    id="photo_password"
                    name="photo_password"
                    value={formData.photo_password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Create a secure password"
                  />
                  <div className="mt-3 p-4 bg-purple-50 rounded-xl">
                    <p className="text-sm text-purple-700 flex items-start">
                      <span className="text-lg mr-2">🔒</span>
                      <span>
                        <strong>Important:</strong> Your guests will need this password to upload photos on your wedding day. 
                        Choose something memorable that you can easily share with them.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-center">
                  <span className="text-red-500 text-lg mr-2">⚠️</span>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-200 space-y-4 sm:space-y-0">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium flex items-center"
              >
                <span className="mr-2">←</span>
                Cancel
              </button>
              
              <div className="flex space-x-4">
                {!isEditing && currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 transition-all duration-200 font-medium"
                  >
                    Previous
                  </button>
                )}
                
                {!isEditing && currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold disabled:opacity-50 disabled:transform-none flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">✨</span>
                        {isEditing ? 'Update Wedding' : 'Create Wedding'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default WeddingForm