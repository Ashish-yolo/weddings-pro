import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Guest = Database['public']['Tables']['guests']['Row']
type PlusOne = Database['public']['Tables']['plus_ones']['Row']
type Wedding = Database['public']['Tables']['weddings']['Row']

interface RSVPManagerProps {
  wedding: Wedding
}

interface GuestWithPlusOnes extends Guest {
  plus_ones?: PlusOne[]
}

const RSVPManager: React.FC<RSVPManagerProps> = ({ wedding }) => {
  const [guests, setGuests] = useState<GuestWithPlusOnes[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchRSVPs()
  }, [wedding.id])

  const fetchRSVPs = async () => {
    try {
      const { data: guestsData, error: guestsError } = await supabase
        .from('guests')
        .select(`
          *,
          plus_ones (*)
        `)
        .eq('wedding_id', wedding.id)
        .order('created_at', { ascending: false })

      if (guestsError) throw guestsError

      setGuests(guestsData || [])
    } catch (error) {
      console.error('Error fetching RSVPs:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateRSVPStatus = async (guestId: string, status: 'accepted' | 'declined', currentStatus: string) => {
    if (currentStatus === status) return // Already in this status

    setProcessing(guestId)
    try {
      const { error } = await supabase
        .from('guests')
        .update({ 
          rsvp_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', guestId)

      if (error) throw error

      // If approving RSVP, also approve any photos uploaded by this guest
      if (status === 'accepted') {
        const guest = guests.find(g => g.id === guestId)
        if (guest) {
          const guestFullName = `${guest.first_name} ${guest.last_name}`
          console.log('Auto-approving photos for guest:', guestFullName)
          
          // Use case-insensitive matching to be more robust
          const { data: updateResult, error: photoError } = await supabase
            .from('photos')
            .update({ approval_status: 'approved' })
            .eq('wedding_id', wedding.id)
            .ilike('uploaded_by_guest', guestFullName)
            .eq('approval_status', 'pending')
            .select()

          if (photoError) {
            console.error('Error auto-approving photos:', photoError)
          } else {
            console.log(`Auto-approved ${updateResult?.length || 0} photos for ${guestFullName}:`, updateResult)
          }
        }
      }

      // Update local state
      setGuests(prev => 
        prev.map(guest => 
          guest.id === guestId 
            ? { ...guest, rsvp_status: status }
            : guest
        )
      )

      // TODO: Send email confirmation (would need email service integration)
      console.log(`RSVP ${status} for guest. Email confirmation would be sent here.`)

    } catch (error) {
      console.error('Error updating RSVP status:', error)
    } finally {
      setProcessing(null)
    }
  }

  const deleteRSVP = async (guestId: string) => {
    if (!confirm('Are you sure you want to delete this RSVP? This action cannot be undone.')) return

    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId)

      if (error) throw error
      await fetchRSVPs()
    } catch (error) {
      console.error('Error deleting RSVP:', error)
    }
  }

  const pendingRSVPs = guests.filter(guest => guest.rsvp_status === 'pending')
  const acceptedRSVPs = guests.filter(guest => guest.rsvp_status === 'accepted')
  const declinedRSVPs = guests.filter(guest => guest.rsvp_status === 'declined')

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading RSVPs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-100">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold text-gray-900">{guests.length}</div>
          <div className="text-gray-600">Total RSVPs</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-yellow-100">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingRSVPs.length}</div>
          <div className="text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-100">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600">{acceptedRSVPs.length}</div>
          <div className="text-gray-600">Accepted</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-100">
          <div className="text-3xl mb-2">❌</div>
          <div className="text-2xl font-bold text-red-600">{declinedRSVPs.length}</div>
          <div className="text-gray-600">Declined</div>
        </div>
      </div>

      {/* Pending RSVPs Section */}
      {pendingRSVPs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="text-3xl mr-3">⏳</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Pending RSVPs</h3>
              <p className="text-gray-600">{pendingRSVPs.length} RSVPs waiting for your response</p>
            </div>
          </div>

          <div className="space-y-4">
            {pendingRSVPs.map((guest) => (
              <RSVPCard
                key={guest.id}
                guest={guest}
                onApprove={() => updateRSVPStatus(guest.id, 'accepted', guest.rsvp_status || 'pending')}
                onDecline={() => updateRSVPStatus(guest.id, 'declined', guest.rsvp_status || 'pending')}
                onDelete={() => deleteRSVP(guest.id)}
                processing={processing === guest.id}
                showActions={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Accepted RSVPs Section */}
      {acceptedRSVPs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="text-3xl mr-3">✅</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Accepted RSVPs</h3>
              <p className="text-gray-600">{acceptedRSVPs.length} guests confirmed attending</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acceptedRSVPs.map((guest) => (
              <RSVPCard
                key={guest.id}
                guest={guest}
                onDecline={() => updateRSVPStatus(guest.id, 'declined', guest.rsvp_status || 'accepted')}
                onDelete={() => deleteRSVP(guest.id)}
                processing={processing === guest.id}
                showActions={false}
                compact={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Declined RSVPs Section */}
      {declinedRSVPs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="text-3xl mr-3">❌</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Declined RSVPs</h3>
              <p className="text-gray-600">{declinedRSVPs.length} guests unable to attend</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {declinedRSVPs.map((guest) => (
              <RSVPCard
                key={guest.id}
                guest={guest}
                onApprove={() => updateRSVPStatus(guest.id, 'accepted', guest.rsvp_status || 'declined')}
                onDelete={() => deleteRSVP(guest.id)}
                processing={processing === guest.id}
                showActions={false}
                compact={true}
              />
            ))}
          </div>
        </div>
      )}

      {guests.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No RSVPs Yet</h3>
          <p className="text-gray-600">
            When guests RSVP through your wedding page, they'll appear here for your review.
          </p>
        </div>
      )}
    </div>
  )
}

interface RSVPCardProps {
  guest: GuestWithPlusOnes
  onApprove?: () => void
  onDecline?: () => void
  onDelete?: () => void
  processing: boolean
  showActions: boolean
  compact?: boolean
}

const RSVPCard: React.FC<RSVPCardProps> = ({
  guest,
  onApprove,
  onDecline,
  onDelete,
  processing,
  showActions,
  compact = false
}) => {
  const totalGuests = 1 + (guest.plus_one_count || 0)
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800'
  }

  return (
    <div className={`bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow ${compact ? '' : 'border-l-4 border-purple-400'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h4 className="text-lg font-bold text-gray-900">
              {guest.first_name} {guest.last_name}
            </h4>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[guest.rsvp_status as keyof typeof statusColors] || statusColors.pending}`}>
              {guest.rsvp_status || 'pending'}
            </span>
            {(guest as any).attendance_intention && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                Wants to {(guest as any).attendance_intention === 'accepted' ? 'attend' : 'decline'}
              </span>
            )}
            {totalGuests > 1 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                +{guest.plus_one_count} guest{guest.plus_one_count !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            {guest.email && (
              <div className="flex items-center">
                <span className="mr-2">📧</span>
                <span>{guest.email}</span>
              </div>
            )}
            {guest.phone && (
              <div className="flex items-center">
                <span className="mr-2">📱</span>
                <span>{guest.phone}</span>
              </div>
            )}
            {guest.dietary_restrictions && (
              <div className="flex items-start">
                <span className="mr-2">🥗</span>
                <span>{guest.dietary_restrictions}</span>
              </div>
            )}
            {guest.song_requests && (
              <div className="flex items-start">
                <span className="mr-2">🎵</span>
                <span>{guest.song_requests}</span>
              </div>
            )}
          </div>

          {guest.plus_ones && guest.plus_ones.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Plus Ones:</h5>
              {guest.plus_ones.map((plusOne, index) => (
                <div key={plusOne.id} className="text-sm text-gray-600 ml-4">
                  <span className="font-medium">{plusOne.first_name} {plusOne.last_name}</span>
                  {plusOne.dietary_restrictions && (
                    <span className="ml-2 text-gray-500">• {plusOne.dietary_restrictions}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 text-xs text-gray-500">
            RSVP'd on {new Date(guest.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="ml-4 flex flex-col space-y-2">
          {showActions && guest.rsvp_status === 'pending' && (
            <>
              <button
                onClick={onApprove}
                disabled={processing}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? '...' : '✓ Accept'}
              </button>
              <button
                onClick={onDecline}
                disabled={processing}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? '...' : '✗ Decline'}
              </button>
            </>
          )}

          {!showActions && guest.rsvp_status === 'accepted' && onDecline && (
            <button
              onClick={onDecline}
              disabled={processing}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? '...' : 'Decline'}
            </button>
          )}

          {!showActions && guest.rsvp_status === 'declined' && onApprove && (
            <button
              onClick={onApprove}
              disabled={processing}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? '...' : 'Re-accept'}
            </button>
          )}

          <button
            onClick={onDelete}
            className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default RSVPManager