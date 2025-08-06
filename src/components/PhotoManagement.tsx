import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Photo = Database['public']['Tables']['photos']['Row']
type Wedding = Database['public']['Tables']['weddings']['Row']

interface PhotoManagementProps {
  wedding: Wedding
}

const PhotoManagement: React.FC<PhotoManagementProps> = ({ wedding }) => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchPhotos()
  }, [wedding.id])

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('wedding_id', wedding.id)
        .eq('photo_type', 'guest') // Only show guest photos for management
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      setPhotos(data || [])
    } catch (error) {
      console.error('Error fetching photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePhotoStatus = async (photoId: string, status: 'approved' | 'rejected') => {
    setProcessing(photoId)
    try {
      const { error } = await supabase
        .from('photos')
        .update({ approval_status: status })
        .eq('id', photoId)

      if (error) throw error

      // Update local state
      setPhotos(prev => 
        prev.map(photo => 
          photo.id === photoId 
            ? { ...photo, approval_status: status }
            : photo
        )
      )
    } catch (error) {
      console.error('Error updating photo status:', error)
    } finally {
      setProcessing(null)
    }
  }


  const pendingPhotos = photos.filter(photo => photo.approval_status === 'pending')
  const approvedPhotos = photos.filter(photo => photo.approval_status === 'approved')
  const rejectedPhotos = photos.filter(photo => photo.approval_status === 'rejected')

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading photos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Pending Photos Section */}
      {pendingPhotos.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="text-3xl mr-3">⏳</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Pending Approval</h3>
              <p className="text-gray-600">{pendingPhotos.length} photos waiting for your review</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onApprove={() => updatePhotoStatus(photo.id, 'approved')}
                onReject={() => updatePhotoStatus(photo.id, 'rejected')}
                processing={processing === photo.id}
                showActions={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Approved Photos Section */}
      {approvedPhotos.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="text-3xl mr-3">✅</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Approved Photos</h3>
              <p className="text-gray-600">{approvedPhotos.length} photos visible on your wedding page</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {approvedPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onReject={() => updatePhotoStatus(photo.id, 'rejected')}
                processing={processing === photo.id}
                showActions={false}
                compact={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Rejected Photos Section */}
      {rejectedPhotos.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="text-3xl mr-3">❌</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Rejected Photos</h3>
              <p className="text-gray-600">{rejectedPhotos.length} photos not shown on wedding page</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rejectedPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onApprove={() => updatePhotoStatus(photo.id, 'approved')}
                processing={processing === photo.id}
                showActions={false}
                compact={true}
              />
            ))}
          </div>
        </div>
      )}

      {photos.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Guest Photos Yet</h3>
          <p className="text-gray-600">
            When guests upload photos using your photo password, they'll appear here for approval.
          </p>
        </div>
      )}
    </div>
  )
}

interface PhotoCardProps {
  photo: Photo
  onApprove?: () => void
  onReject?: () => void
  processing: boolean
  showActions: boolean
  compact?: boolean
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onApprove,
  onReject,
  processing,
  showActions,
  compact = false
}) => {
  const [imageUrl, setImageUrl] = useState<string>('')

  useEffect(() => {
    const loadImage = async () => {
      const { data } = supabase.storage
        .from('wedding-photos')
        .getPublicUrl(photo.file_path)
      setImageUrl(data.publicUrl)
    }
    loadImage()
  }, [photo.file_path])

  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className={`${compact ? 'aspect-square' : 'aspect-video'} bg-gray-200`}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`Photo by ${photo.uploaded_by_guest}`}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-900">
            {photo.uploaded_by_guest || 'Anonymous'}
          </p>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            photo.approval_status === 'approved' 
              ? 'bg-green-100 text-green-800'
              : photo.approval_status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {photo.approval_status}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 mb-3">
          {new Date(photo.uploaded_at).toLocaleDateString()}
        </p>

        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={onApprove}
              disabled={processing}
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? '...' : '✓ Approve'}
            </button>
            <button
              onClick={onReject}
              disabled={processing}
              className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? '...' : '✗ Reject'}
            </button>
          </div>
        )}

        {!showActions && photo.approval_status === 'approved' && onReject && (
          <button
            onClick={onReject}
            disabled={processing}
            className="w-full bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {processing ? '...' : 'Remove'}
          </button>
        )}

        {!showActions && photo.approval_status === 'rejected' && onApprove && (
          <button
            onClick={onApprove}
            disabled={processing}
            className="w-full bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {processing ? '...' : 'Restore'}
          </button>
        )}
      </div>
    </div>
  )
}

export default PhotoManagement