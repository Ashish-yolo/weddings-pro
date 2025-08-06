import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import PhotoGallery from '../components/PhotoGallery'
import Layout from '../components/Layout'
import type { Database } from '../lib/supabase'

type Wedding = Database['public']['Tables']['weddings']['Row']

const PhotoGalleryPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
        .single()

      if (error) throw error
      setWedding(data)
    } catch (error: any) {
      console.error('Error fetching wedding:', error)
      setError('Wedding not found or you do not have permission to view it.')
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gray-100 max-w-md mx-auto">
              <div className="text-6xl mb-6">📸</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Photos Not Available</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <span className="text-2xl mr-2">📸</span>
            <span className="text-sm font-medium text-purple-600">Wedding Photo Gallery</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{wedding.title}</h1>
          <p className="text-xl text-gray-600">
            {wedding.bride_name && wedding.groom_name && 
              `${wedding.bride_name} & ${wedding.groom_name} • `
            }
            {new Date(wedding.wedding_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Photo Gallery */}
        <PhotoGallery wedding={wedding} />
      </div>
    </Layout>
  )
}

export default PhotoGalleryPage