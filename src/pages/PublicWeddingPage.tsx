import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import RSVPForm from '../components/RSVPForm'
import PhotoUpload from '../components/PhotoUpload'
import Layout from '../components/Layout'
import FloatingHearts from '../components/FloatingHearts'
import CountdownTimer from '../components/CountdownTimer'
import RelationshipTimeline from '../components/RelationshipTimeline'
import GuestPhotoSlideshow from '../components/GuestPhotoSlideshow'
import type { Database } from '../lib/supabase'

type Wedding = Database['public']['Tables']['weddings']['Row']

const PublicWeddingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (slug) {
      fetchWedding()
    }
  }, [slug])

  const fetchWedding = async () => {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('public_url_slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error
      setWedding(data)
    } catch (error) {
      console.error('Error fetching wedding:', error)
      setError('Wedding not found or no longer active')
    } finally {
      setLoading(false)
    }
  }

  const isWeddingDay = () => {
    if (!wedding) return false
    const today = new Date().toISOString().split('T')[0]
    return wedding.wedding_date === today
  }

  const getTimeUntilWedding = () => {
    if (!wedding) return null
    const weddingDate = new Date(wedding.wedding_date)
    const today = new Date()
    const diffTime = weddingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Past'
    if (diffDays === 0) return 'Today!'
    if (diffDays === 1) return 'Tomorrow'
    return `${diffDays} days to go`
  }

  if (loading) {
    return (
      <Layout showNavigation={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <div className="text-xl text-gray-600">Loading wedding details...</div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !wedding) {
    return (
      <Layout showNavigation={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gray-100 max-w-md mx-4">
            <div className="text-6xl mb-6">😔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Wedding Not Found</h2>
            <p className="text-gray-600 leading-relaxed">
              {error || 'This wedding page is not available or may have been deactivated.'}
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showNavigation={false}>
      <div className="relative overflow-hidden">
        {/* Floating Hearts Animation */}
        <FloatingHearts />

        {/* Romantic Background */}
        <div className="absolute inset-0 bg-love-gradient">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 via-purple-100/30 to-indigo-100/50">
            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-pink-300 rounded-full opacity-20 animate-float"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-purple-300 rounded-full opacity-30 animate-bounce-gentle"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-300 rounded-full opacity-25 animate-pulse-slow"></div>
            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-40 animate-float" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-1/3 right-1/4 w-18 h-18 bg-purple-200 rounded-full opacity-35 animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
          </div>
        </div>

        {/* Photo Slideshow at Top */}
        <section className="relative z-10 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <GuestPhotoSlideshow wedding={wedding} />
          </div>
        </section>

        {/* Hero Header */}
        <header className="relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            {/* Wedding Badge */}
            <div className="inline-flex items-center px-8 py-3 rounded-full bg-white/90 backdrop-blur-sm shadow-xl mb-8 animate-fade-in-up">
              <span className="text-3xl mr-3 animate-bounce-gentle">💒</span>
              <span className="text-lg font-semibold text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text">
                You're Invited to Our Wedding!
              </span>
            </div>
            
            {/* Wedding Title with Script Font */}
            <h1 className="font-script text-6xl md:text-8xl font-bold text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text mb-8 leading-tight animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              {wedding.title}
            </h1>
            
            {/* Couple Names */}
            {wedding.bride_name && wedding.groom_name && (
              <div className="mb-12 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                  <div className="text-center">
                    <span className="font-elegant text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text block animate-slide-in-left">
                      {wedding.bride_name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 animate-bounce-gentle">
                    <span className="text-6xl">💕</span>
                  </div>
                  <div className="text-center">
                    <span className="font-elegant text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text block animate-slide-in-right">
                      {wedding.groom_name}
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="font-script text-2xl text-gray-700 opacity-80">
                    are getting married!
                  </p>
                </div>
              </div>
            )}
            
            {/* Wedding Details Cards */}
            <div className="flex flex-col lg:flex-row gap-8 justify-center items-center mb-16 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              {/* Date Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-pink-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                <div className="text-5xl mb-4 group-hover:animate-bounce-gentle">📅</div>
                <div className="font-elegant text-xl font-bold text-gray-900 mb-2">
                  {new Date(wedding.wedding_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                {wedding.wedding_time && (
                  <div className="font-script text-lg text-gray-600 mb-3">at {wedding.wedding_time}</div>
                )}
                <div className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  {getTimeUntilWedding()}
                </div>
              </div>

              {/* Venue Card */}
              {wedding.venue && (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-purple-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                  <div className="text-5xl mb-4 group-hover:animate-bounce-gentle">📍</div>
                  <div className="font-elegant text-xl font-bold text-gray-900 mb-2">{wedding.venue}</div>
                  {wedding.address && (
                    <div className="font-script text-lg text-gray-600">{wedding.address}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Countdown Timer Section */}
        <section className="relative z-10 py-16 bg-white/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <CountdownTimer 
              targetDate={wedding.wedding_date} 
              className="animate-fade-in-up"
            />
          </div>
        </section>

        {/* Wedding Description */}
        {wedding.description && (
          <section className="relative z-10 py-16 bg-gradient-to-r from-pink-50 to-purple-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl border-2 border-pink-100 animate-fade-in-up">
                <div className="text-5xl mb-6 animate-bounce-gentle">💌</div>
                <h2 className="font-elegant text-4xl font-bold text-gray-900 mb-8">A Message From Us</h2>
                <p className="font-script text-2xl text-gray-700 leading-relaxed mb-6">{wedding.description}</p>
                <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full"></div>
              </div>
            </div>
          </section>
        )}

        {/* Relationship Timeline */}
        <RelationshipTimeline 
          weddingId={wedding.id}
          brideName={wedding.bride_name || undefined}
          groomName={wedding.groom_name || undefined}
        />


        {/* Main Content */}
        <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

          {/* Mode Toggle */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl animate-bounce-gentle">
              <span className="text-3xl mr-4">
                {isWeddingDay() ? '📸' : '📝'}
              </span>
              <span className="font-bold text-xl">
                {isWeddingDay() ? 'Share Your Photos!' : 'Please RSVP'}
              </span>
            </div>
          </div>

          {/* Dynamic Content - RSVP or Photo Upload */}
          <div className="max-w-4xl mx-auto">
            {isWeddingDay() ? (
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-pink-100 overflow-hidden animate-fade-in-up">
                <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 p-8 text-center text-white relative">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-4 animate-bounce-gentle">📸</div>
                    <h2 className="font-elegant text-3xl font-bold mb-2">Share Your Memories</h2>
                    <p className="font-script text-xl opacity-90">
                      Help us capture every beautiful moment of our special day!
                    </p>
                    <div className="flex justify-center space-x-4 mt-4">
                      <span className="animate-bounce-gentle" style={{animationDelay: '0.2s'}}>💕</span>
                      <span className="animate-bounce-gentle" style={{animationDelay: '0.4s'}}>📷</span>
                      <span className="animate-bounce-gentle" style={{animationDelay: '0.6s'}}>💖</span>
                    </div>
                  </div>
                </div>
                <div className="p-10">
                  <PhotoUpload wedding={wedding} />
                </div>
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-purple-100 overflow-hidden animate-fade-in-up">
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-8 text-center text-white relative">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-4 animate-bounce-gentle">💌</div>
                    <h2 className="font-elegant text-3xl font-bold mb-2">Please RSVP</h2>
                    <p className="font-script text-xl opacity-90">
                      We can't wait to celebrate with you! Let us know if you'll be joining us.
                    </p>
                    <div className="flex justify-center space-x-4 mt-4">
                      <span className="animate-bounce-gentle" style={{animationDelay: '0.2s'}}>💕</span>
                      <span className="animate-bounce-gentle" style={{animationDelay: '0.4s'}}>📝</span>
                      <span className="animate-bounce-gentle" style={{animationDelay: '0.6s'}}>💖</span>
                    </div>
                  </div>
                </div>
                <div className="p-10">
                  <RSVPForm wedding={wedding} />
                </div>
              </div>
            )}
          </div>

          {/* Footer Message */}
          <div className="text-center mt-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 max-w-2xl mx-auto">
              <div className="text-4xl mb-4">💕</div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Thank you for being part of our journey. Your presence (virtual or in-person) means the world to us!
              </p>
              <div className="mt-4 text-sm text-gray-500">
                — {wedding.bride_name && wedding.groom_name ? 
                  `${wedding.bride_name} & ${wedding.groom_name}` : 
                  'The Happy Couple'
                }
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default PublicWeddingPage