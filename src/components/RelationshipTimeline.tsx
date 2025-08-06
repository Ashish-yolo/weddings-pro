import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type LoveStoryEvent = Database['public']['Tables']['love_story_events']['Row']

interface TimelineEvent {
  date: string
  title: string
  description: string
  icon: string
}

interface RelationshipTimelineProps {
  weddingId: string
  brideName?: string
  groomName?: string
}

const RelationshipTimeline: React.FC<RelationshipTimelineProps> = ({ 
  weddingId,
  brideName = "Bride",
  groomName = "Groom"
}) => {
  const [customEvents, setCustomEvents] = useState<LoveStoryEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomEvents()
  }, [weddingId])

  const fetchCustomEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('love_story_events')
        .select('*')
        .eq('wedding_id', weddingId)
        .order('order_index', { ascending: true })

      if (error) throw error
      setCustomEvents(data || [])
    } catch (error) {
      console.error('Error fetching love story events:', error)
    } finally {
      setLoading(false)
    }
  }
  // Default timeline if none provided
  const defaultEvents: TimelineEvent[] = [
    {
      date: "First Meeting",
      title: "When We First Met",
      description: "Two hearts crossed paths and everything changed forever...",
      icon: "👥"
    },
    {
      date: "First Date", 
      title: "Our First Date",
      description: "The beginning of our beautiful journey together...",
      icon: "❤️"
    },
    {
      date: "Relationship",
      title: "We Became Official",
      description: "Making it official and choosing to walk this path together...",
      icon: "💕"
    },
    {
      date: "Proposal",
      title: "The Proposal",
      description: "The moment we decided to spend forever together...",
      icon: "💍"
    },
    {
      date: "Today",
      title: "Our Wedding Day",
      description: "Today we become one, surrounded by our loved ones...",
      icon: "💒"
    }
  ]

  // Convert custom events to timeline format, or use defaults if none exist
  const timelineEvents: TimelineEvent[] = customEvents.length > 0 
    ? customEvents.map(event => ({
        date: event.event_date || 'Special Moment',
        title: event.title,
        description: event.description || '',
        icon: event.icon || '💕'
      }))
    : defaultEvents

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading love story...</p>
        </div>
      </div>
    )
  }

  // Don't show the timeline if no custom events and using defaults would be generic
  if (customEvents.length === 0) {
    return null
  }

  return (
    <div className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Love Story</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Every love story is beautiful, but ours is our favorite. Here's how {brideName} & {groomName} found their forever...
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-pink-300 via-purple-300 to-pink-300 rounded-full hidden md:block"></div>

          {/* Timeline Events */}
          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col md:space-x-8`}
              >
                {/* Event Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-center md:justify-start mb-4">
                      <div className="text-4xl mr-3">{event.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                        <p className="text-sm font-semibold text-purple-600">{event.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{event.description}</p>
                  </div>
                </div>

                {/* Central Icon (Desktop) */}
                <div className="hidden md:flex w-2/12 justify-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg z-10">
                    <span className="text-2xl">{event.icon}</span>
                  </div>
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block md:w-5/12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Message */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-3xl p-8 shadow-xl">
            <div className="text-5xl mb-4">💕</div>
            <h3 className="text-2xl font-bold mb-4">And This Is Just The Beginning...</h3>
            <p className="text-lg opacity-90">
              Thank you for being part of our story. We can't wait to start this new chapter with all of you by our side!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RelationshipTimeline