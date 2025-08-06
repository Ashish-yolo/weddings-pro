import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import type { Database } from '../lib/supabase'

type Wedding = Database['public']['Tables']['weddings']['Row']

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [weddings, setWeddings] = useState<Wedding[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    fetchWeddings()
  }, [user, navigate])

  const fetchWeddings = async () => {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setWeddings(data || [])
    } catch (error) {
      console.error('Error fetching weddings:', error)
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
            <div className="text-xl text-gray-600">Loading your weddings...</div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Wedding Dashboard</h1>
              <p className="text-xl text-gray-600">Manage all your special moments in one place</p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link
                to="/wedding/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="mr-2">✨</span>
                Create New Wedding
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <span className="text-2xl">💒</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{weddings.length}</p>
                <p className="text-gray-600">Total Weddings</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{weddings.filter(w => w.is_active).length}</p>
                <p className="text-gray-600">Active Events</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-pink-100 rounded-xl">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {weddings.filter(w => new Date(w.wedding_date) >= new Date()).length}
                </p>
                <p className="text-gray-600">Upcoming</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weddings Grid */}
        {weddings.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gray-100 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">💒</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Plan Your Dream Wedding?</h3>
              <p className="text-lg text-gray-600 mb-8">
                Create your first wedding page and start collecting RSVPs and memories from your special day.
              </p>
              <Link
                to="/wedding/new"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="mr-2">✨</span>
                Create Your First Wedding
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Your Wedding Events</h2>
              <div className="text-sm text-gray-500">
                {weddings.length} event{weddings.length !== 1 ? 's' : ''} total
              </div>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {weddings.map((wedding) => (
                <div key={wedding.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  {/* Wedding Cover Photo */}
                  {wedding.cover_photo_url ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={wedding.cover_photo_url}
                        alt={`${wedding.title} cover`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">{wedding.title}</h3>
                        {wedding.bride_name && wedding.groom_name && (
                          <p className="text-white/90 text-sm">
                            {wedding.bride_name} & {wedding.groom_name}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Wedding Card Header - fallback for no photo */
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">{wedding.title}</h3>
                      {wedding.bride_name && wedding.groom_name && (
                        <p className="text-purple-100">
                          {wedding.bride_name} & {wedding.groom_name}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Wedding Card Content */}
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">📅</span>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {new Date(wedding.wedding_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        {wedding.wedding_time && (
                          <p className="text-gray-600 text-sm">at {wedding.wedding_time}</p>
                        )}
                      </div>
                    </div>
                    
                    {wedding.venue && (
                      <div className="flex items-center mb-4">
                        <span className="text-lg mr-3">📍</span>
                        <p className="text-gray-600">{wedding.venue}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center mb-6">
                      <span className={`w-2 h-2 rounded-full mr-2 ${wedding.is_active ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                      <span className={`text-sm font-medium ${wedding.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                        {wedding.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 gap-3">
                      <Link
                        to={`/wedding/edit/${wedding.id}`}
                        className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        <span className="mr-2">✏️</span>
                        Edit Details
                      </Link>
                      
                      <a
                        href={`/w/${wedding.public_url_slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                      >
                        <span className="mr-2">🔗</span>
                        View Public Page
                      </a>
                      
                      <Link
                        to={`/wedding/${wedding.id}/photos`}
                        className="flex items-center justify-center px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors font-medium"
                      >
                        <span className="mr-2">💕</span>
                        Manage Content
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export default Dashboard