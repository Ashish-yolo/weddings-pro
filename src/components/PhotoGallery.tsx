import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Photo = Database['public']['Tables']['photos']['Row']
type Wedding = Database['public']['Tables']['weddings']['Row']

interface PhotoGalleryProps {
  wedding: Wedding
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ wedding }) => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPhotos()
  }, [wedding.id])

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('wedding_id', wedding.id)
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      setPhotos(data || [])
    } catch (error: any) {
      console.error('Error fetching photos:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getPhotoUrl = (photo: Photo) => {
    const { data } = supabase.storage
      .from('wedding-photos')
      .getPublicUrl(photo.file_path)
    return data.publicUrl
  }

  const downloadPhoto = async (photo: Photo) => {
    try {
      const { data, error } = await supabase.storage
        .from('wedding-photos')
        .download(photo.file_path)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = photo.file_name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error: any) {
      console.error('Error downloading photo:', error)
      alert('Failed to download photo')
    }
  }

  const downloadAllPhotos = async () => {
    if (photos.length === 0) return

    try {
      for (const photo of photos) {
        await downloadPhoto(photo)
        // Add small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error) {
      console.error('Error downloading all photos:', error)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">Loading photos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-red-600">Error loading photos: {error}</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Wedding Photos ({photos.length})</h2>
        {photos.length > 0 && (
          <button
            onClick={downloadAllPhotos}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Download All Photos
          </button>
        )}
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📸</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No photos yet</h3>
          <p className="text-gray-600">
            Photos uploaded by guests will appear here after your wedding day.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={getPhotoUrl(photo)}
                alt={`Wedding photo by ${photo.uploaded_by_guest}`}
                className="w-full h-48 object-cover rounded-lg"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  onClick={() => downloadPhoto(photo)}
                  className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-3 py-1 rounded text-sm transition-opacity"
                >
                  Download
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                {photo.uploaded_by_guest && `By: ${photo.uploaded_by_guest}`}
                <br />
                {new Date(photo.uploaded_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PhotoGallery