import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type LoveStoryEvent = Database['public']['Tables']['love_story_events']['Row']
type Wedding = Database['public']['Tables']['weddings']['Row']

interface LoveStoryManagerProps {
  wedding: Wedding
}

const LoveStoryManager: React.FC<LoveStoryManagerProps> = ({ wedding }) => {
  const [events, setEvents] = useState<LoveStoryEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEvent, setEditingEvent] = useState<LoveStoryEvent | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [wedding.id])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('love_story_events')
        .select('*')
        .eq('wedding_id', wedding.id)
        .order('order_index', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching love story events:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveEvent = async (eventData: Partial<LoveStoryEvent>) => {
    setSaving(true)
    try {
      if (editingEvent) {
        // Update existing event
        const { error } = await supabase
          .from('love_story_events')
          .update({
            title: eventData.title,
            description: eventData.description,
            event_date: eventData.event_date,
            icon: eventData.icon,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEvent.id)

        if (error) throw error
      } else {
        // Create new event
        const { error } = await supabase
          .from('love_story_events')
          .insert([{
            wedding_id: wedding.id,
            title: eventData.title!,
            description: eventData.description,
            event_date: eventData.event_date,
            icon: eventData.icon || '💕',
            order_index: events.length
          }])

        if (error) throw error
      }

      await fetchEvents()
      setEditingEvent(null)
      setShowAddForm(false)
    } catch (error) {
      console.error('Error saving event:', error)
    } finally {
      setSaving(false)
    }
  }

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return

    try {
      const { error } = await supabase
        .from('love_story_events')
        .delete()
        .eq('id', eventId)

      if (error) throw error
      await fetchEvents()
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const moveEvent = async (eventId: string, direction: 'up' | 'down') => {
    const currentIndex = events.findIndex(e => e.id === eventId)
    if (currentIndex === -1) return
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= events.length) return

    const reorderedEvents = [...events]
    const temp = reorderedEvents[currentIndex]
    reorderedEvents[currentIndex] = reorderedEvents[newIndex]
    reorderedEvents[newIndex] = temp

    // Update order_index for both events
    try {
      await Promise.all([
        supabase
          .from('love_story_events')
          .update({ order_index: newIndex })
          .eq('id', temp.id),
        supabase
          .from('love_story_events')
          .update({ order_index: currentIndex })
          .eq('id', reorderedEvents[currentIndex].id)
      ])

      await fetchEvents()
    } catch (error) {
      console.error('Error reordering events:', error)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your love story...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Love Story Timeline</h2>
          <p className="text-gray-600">
            Create a beautiful timeline of your relationship milestones that guests will see on your wedding page.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
        >
          <span className="mr-2">✨</span>
          Add Milestone
        </button>
      </div>

      {events.length === 0 && !showAddForm ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💕</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Start Your Love Story</h3>
          <p className="text-gray-600 mb-6">
            Add milestones from your relationship journey - from the first meeting to your engagement and beyond!
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Add Your First Milestone
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              totalEvents={events.length}
              onEdit={setEditingEvent}
              onDelete={deleteEvent}
              onMove={moveEvent}
            />
          ))}

          {(showAddForm || editingEvent) && (
            <EventForm
              event={editingEvent}
              onSave={saveEvent}
              onCancel={() => {
                setEditingEvent(null)
                setShowAddForm(false)
              }}
              saving={saving}
            />
          )}
        </div>
      )}
    </div>
  )
}

interface EventCardProps {
  event: LoveStoryEvent
  index: number
  totalEvents: number
  onEdit: (event: LoveStoryEvent) => void
  onDelete: (id: string) => void
  onMove: (id: string, direction: 'up' | 'down') => void
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  index,
  totalEvents,
  onEdit,
  onDelete,
  onMove
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-100 hover:border-purple-200 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="text-3xl">{event.icon}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
              {event.event_date && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium">
                  {event.event_date}
                </span>
              )}
            </div>
            {event.description && (
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {/* Reorder buttons */}
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => onMove(event.id, 'up')}
              disabled={index === 0}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Move up"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={() => onMove(event.id, 'down')}
              disabled={index === totalEvents - 1}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Move down"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {/* Action buttons */}
          <button
            onClick={() => onEdit(event)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit milestone"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete milestone"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

interface EventFormProps {
  event: LoveStoryEvent | null
  onSave: (eventData: Partial<LoveStoryEvent>) => void
  onCancel: () => void
  saving: boolean
}

const EventForm: React.FC<EventFormProps> = ({ event, onSave, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    event_date: event?.event_date || '',
    icon: event?.icon || '💕'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    onSave(formData)
  }

  const commonIcons = ['💕', '❤️', '💖', '💍', '🌟', '✨', '🎉', '💒', '👥', '🥰', '😍', '🌹']

  return (
    <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        {event ? 'Edit Milestone' : 'Add New Milestone'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Milestone Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., When We First Met"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date/Time Period
            </label>
            <input
              type="text"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              placeholder="e.g., Summer 2019, December 2020"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Tell the story of this special moment..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Icon
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {commonIcons.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setFormData({ ...formData, icon })}
                className={`p-2 text-2xl rounded-lg border-2 transition-colors ${
                  formData.icon === icon
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="Or enter custom emoji"
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={saving || !formData.title.trim()}
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : event ? 'Update Milestone' : 'Add Milestone'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoveStoryManager