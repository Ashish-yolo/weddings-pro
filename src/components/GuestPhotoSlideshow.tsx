import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Photo = Database['public']['Tables']['photos']['Row']
type Wedding = Database['public']['Tables']['weddings']['Row']

interface GuestPhotoslideshowProps {
  wedding: Wedding
}

const GuestPhotoSlideshow: React.FC<GuestPhotoslideshowProps> = ({ wedding }) => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [photoUrls, setPhotoUrls] = useState<string[]>([])

  const fetchPhotos = React.useCallback(async () => {
    console.log('🔄 [GuestPhotoSlideshow] Fetching photos for wedding:', wedding.id)
    console.log('🔄 [GuestPhotoSlideshow] Current component state - photos count:', photos.length, 'loading:', loading)
    try {
      // Fetch approved photos from database (includes both cover photos and approved guest photos)
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .eq('wedding_id', wedding.id)
        .eq('approval_status', 'approved')
        .order('photo_type', { ascending: true }) // Cover photos first
        .order('uploaded_at', { ascending: false })

      if (photosError) {
        console.error('❌ [GuestPhotoSlideshow] Database error:', photosError)
        throw photosError
      }

      console.log('📸 [GuestPhotoSlideshow] Query result - Found photos:', photosData?.length || 0)
      console.log('📸 [GuestPhotoSlideshow] Photo details:', photosData)
      
      setPhotos(photosData || [])
      
      // Reset slideshow index if current index is out of bounds
      if (currentPhotoIndex >= (photosData?.length || 0)) {
        console.log('🔄 [GuestPhotoSlideshow] Resetting slideshow index from', currentPhotoIndex, 'to 0')
        setCurrentPhotoIndex(0)
      }

      // Get public URLs for each photo
      if (photosData && photosData.length > 0) {
        console.log('🌐 [GuestPhotoSlideshow] Generating public URLs for', photosData.length, 'photos')
        const urls = await Promise.all(
          photosData.map(async (photo, index) => {
            // Use different storage bucket based on photo type
            const bucket = photo.photo_type === 'cover' ? 'wedding-images' : 'wedding-photos'
            console.log(`🗂️ [GuestPhotoSlideshow] Photo ${index + 1}:`, {
              filename: photo.file_name,
              bucket: bucket,
              path: photo.file_path,
              photoType: photo.photo_type,
              approvalStatus: photo.approval_status
            })
            
            const { data } = supabase.storage
              .from(bucket)
              .getPublicUrl(photo.file_path)
            
            console.log(`🔗 [GuestPhotoSlideshow] Generated URL ${index + 1}:`, data.publicUrl)
            return data.publicUrl
          })
        )
        console.log('✅ [GuestPhotoSlideshow] All photo URLs generated successfully:', urls.length, 'URLs')
        setPhotoUrls(urls)
      } else {
        // Clear photos and URLs if no approved photos
        console.log('⚠️ [GuestPhotoSlideshow] No approved photos found, clearing slideshow')
        setPhotos([])
        setPhotoUrls([])
      }
    } catch (error) {
      console.error('❌ [GuestPhotoSlideshow] Error in fetchPhotos:', error)
      setPhotos([])
      setPhotoUrls([])
    } finally {
      console.log('🔄 [GuestPhotoSlideshow] Setting loading to false')
      setLoading(false)
    }
  }, [wedding.id])

  useEffect(() => {
    fetchPhotos()

    // Set up real-time subscription for photo changes
    const photoSubscription = supabase
      .channel(`photos-${wedding.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'photos',
          filter: `wedding_id=eq.${wedding.id}`
        },
        (payload) => {
          console.log('📡 [GuestPhotoSlideshow] Photo change detected:', payload.eventType, 'for wedding:', wedding.id)
          console.log('📡 [GuestPhotoSlideshow] Realtime payload:', payload)
          
          // Log the specific change
          if (payload.new && payload.old) {
            console.log('📡 [GuestPhotoSlideshow] Photo updated from:', payload.old.approval_status, 'to:', payload.new.approval_status)
          } else if (payload.new) {
            console.log('📡 [GuestPhotoSlideshow] New photo added with approval status:', payload.new.approval_status)
          } else if (payload.old) {
            console.log('📡 [GuestPhotoSlideshow] Photo deleted:', payload.old.file_name)
          }
          
          console.log('📡 [GuestPhotoSlideshow] Refetching photos due to realtime change...')
          fetchPhotos()
        }
      )
      .subscribe()

    return () => {
      photoSubscription.unsubscribe()
    }
  }, [wedding.id, fetchPhotos])

  useEffect(() => {
    if (photos.length > 0) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
      }, 4000) // Change photo every 4 seconds

      return () => clearInterval(interval)
    }
  }, [photos.length])

  console.log('🖼️ [GuestPhotoSlideshow] Render state:', {
    loading,
    photosCount: photos.length,
    urlsCount: photoUrls.length,
    currentIndex: currentPhotoIndex,
    weddingId: wedding.id
  })

  if (loading) {
    console.log('🔄 [GuestPhotoSlideshow] Rendering loading state')
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-pink-100 animate-fade-in-up">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading guest photos...</p>
        </div>
      </div>
    )
  }

  if (photos.length === 0) {
    console.log('📷 [GuestPhotoSlideshow] Rendering no photos state')
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-pink-100 animate-fade-in-up">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-gentle">📸</div>
          <h3 className="font-elegant text-2xl font-bold text-gray-900 mb-2">Guest Photos</h3>
          <p className="text-gray-600 font-script text-lg">
            No photos shared yet. Be the first to share a memory!
          </p>
        </div>
      </div>
    )
  }

  console.log('🎬 [GuestPhotoSlideshow] Rendering slideshow with', photos.length, 'photos and', photoUrls.length, 'URLs')
  console.log('🎬 [GuestPhotoSlideshow] Current photo URL:', photoUrls[currentPhotoIndex])

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-pink-100 overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 p-6 text-center text-white relative">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="text-5xl mb-3 animate-bounce-gentle">📷</div>
          <h3 className="font-elegant text-2xl font-bold mb-1">Guest Uploaded Photos</h3>
          <p className="font-script text-lg opacity-90">
            Upload memories of us together
          </p>
          <div className="flex justify-center space-x-3 mt-3">
            <span className="animate-bounce-gentle" style={{animationDelay: '0.2s'}}>💕</span>
            <span className="animate-bounce-gentle" style={{animationDelay: '0.4s'}}>📸</span>
            <span className="animate-bounce-gentle" style={{animationDelay: '0.6s'}}>💖</span>
          </div>
        </div>
      </div>

      {/* Slideshow */}
      <div className="p-8">
        <div className="relative">
          {/* Main Photo Display */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl group">
            <img
              src={photoUrls[currentPhotoIndex]}
              alt={`Guest photo ${currentPhotoIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Photo Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                <p className="font-script text-lg">
                  Shared by: {photos[currentPhotoIndex].uploaded_by_guest || 'Anonymous'}
                </p>
                <p className="text-sm opacity-80">
                  {new Date(photos[currentPhotoIndex].uploaded_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Navigation Arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {photos.length > 1 && (
            <div className="flex justify-center space-x-3 mt-6">
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-3 transition-all duration-200 ${
                    index === currentPhotoIndex
                      ? 'border-purple-500 shadow-lg scale-110'
                      : 'border-gray-300 hover:border-purple-300 hover:scale-105'
                  }`}
                >
                  <img
                    src={photoUrls[index]}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Photo Counter */}
          <div className="text-center mt-4">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
              <span className="mr-2">📸</span>
              {photos.length} wedding {photos.length === 1 ? 'photo' : 'photos'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuestPhotoSlideshow