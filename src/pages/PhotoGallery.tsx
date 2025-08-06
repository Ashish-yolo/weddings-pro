import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import PhotoManagement from '../components/PhotoManagement'
import LoveStoryManager from '../components/LoveStoryManager'
import RSVPManager from '../components/RSVPManager'
import type { Database } from '../lib/supabase'

type Wedding = Database['public']['Tables']['weddings']['Row']

const PhotoGallery: React.FC = () => {
  const { user } = useAuth()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'photos' | 'timeline' | 'rsvps'>('rsvps')

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    if (id) {
      fetchWedding()
    }
  }, [user, navigate, id])

  const fetchWedding = async () => {
    if (!id) return

    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id) // Ensure user owns this wedding
        .single()

      if (error) throw error
      setWedding(data)
    } catch (error) {
      console.error('Error fetching wedding:', error)
      setError('Wedding not found or you don\'t have permission to view it')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <div className="text-xl text-gray-600">Loading photo gallery...</div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !wedding) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-6">😔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Wedding Not Found</h2>
            <p className="text-gray-600 mb-8">
              {error || 'This wedding doesn\'t exist or you don\'t have permission to view it.'}
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Wedding Management</h1>
              <p className="text-xl text-gray-600 mb-2">{wedding.title}</p>
              {wedding.bride_name && wedding.groom_name && (
                <p className="text-lg text-gray-500">
                  {wedding.bride_name} & {wedding.groom_name}
                </p>
              )}
            </div>
            
            <div className="mt-6 md:mt-0 space-y-2 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
              <a
                href={`/w/${wedding.public_url_slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
              >
                <span className="mr-2">🔗</span>
                View Public Page
              </a>
              
              <Link
                to={`/wedding/edit/${wedding.id}`}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <span className="mr-2">✏️</span>
                Edit Wedding
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-2xl">
            <button
              onClick={() => setActiveTab('rsvps')}
              className={`flex-1 px-4 py-2 rounded-md font-semibold transition-colors ${
                activeTab === 'rsvps'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">📝</span>
              RSVPs
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex-1 px-4 py-2 rounded-md font-semibold transition-colors ${
                activeTab === 'photos'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">📸</span>
              Photos
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 px-4 py-2 rounded-md font-semibold transition-colors ${
                activeTab === 'timeline'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">💕</span>
              Love Story
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'rsvps' && (
          <RSVPManager wedding={wedding} />
        )}

        {activeTab === 'photos' && (
          <>
            {/* Photo Password Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start">
                <div className="text-2xl mr-4">🔐</div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Photo Password</h3>
                  <p className="text-blue-800 mb-2">
                    Share this password with your guests so they can upload unlimited photos:
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-blue-200 inline-block">
                    <code className="text-lg font-mono text-blue-900 font-bold">
                      {wedding.photo_password}
                    </code>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    💡 Guest photos will appear here for your approval before showing on the public page.
                  </p>
                </div>
              </div>
            </div>

            {/* Photo Management Component */}
            <PhotoManagement wedding={wedding} />
          </>
        )}

        {activeTab === 'timeline' && (
          <LoveStoryManager wedding={wedding} />
        )}
      </div>
    </Layout>
  )
}

export default PhotoGallery