import React, { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

interface WeddingPhotoUploadProps {
  currentPhotoUrl?: string
  onPhotoChange: (url: string | null, path: string | null) => void
  disabled?: boolean
}

const WeddingPhotoUpload: React.FC<WeddingPhotoUploadProps> = ({
  currentPhotoUrl,
  onPhotoChange,
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `wedding-cover-${Date.now()}.${fileExt}`
      const filePath = `covers/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('wedding-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage
        .from('wedding-images')
        .getPublicUrl(filePath)

      onPhotoChange(data.publicUrl, filePath)
    } catch (error: any) {
      console.error('Upload error:', error)
      setError(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleRemovePhoto = async () => {
    try {
      // If there's a current photo, remove it from storage
      if (currentPhotoUrl) {
        // Extract path from URL for deletion (optional - you might want to keep old photos)
        // const path = currentPhotoUrl.split('/').pop()
        // await supabase.storage.from('wedding-images').remove([path])
      }
      
      onPhotoChange(null, null)
    } catch (error) {
      console.error('Error removing photo:', error)
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Wedding Cover Photo
      </label>
      
      {currentPhotoUrl ? (
        <div className="relative group">
          <div className="aspect-video w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-lg border-4 border-white">
            <img
              src={currentPhotoUrl}
              alt="Wedding cover"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || uploading}
              className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <span>📸</span>
              <span>Change</span>
            </button>
            <button
              type="button"
              onClick={handleRemovePhoto}
              disabled={disabled || uploading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <span>🗑️</span>
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="aspect-video w-full max-w-md mx-auto border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center space-y-4 hover:border-purple-400 transition-colors cursor-pointer group"
             onClick={() => fileInputRef.current?.click()}>
          <div className="text-6xl group-hover:scale-110 transition-transform">📸</div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700 mb-2">Add Your Wedding Photo</p>
            <p className="text-sm text-gray-500">
              Upload a beautiful photo that guests will see on your invitation
            </p>
            <p className="text-xs text-gray-400 mt-2">
              JPG, PNG, WebP • Max 10MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        className="hidden"
      />

      {uploading && (
        <div className="flex items-center justify-center space-x-2 text-purple-600">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
          <span className="font-medium">Uploading photo...</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <span className="text-red-700 text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-500">
          💡 <strong>Pro tip:</strong> Choose a photo that represents your love story - it will be the first thing guests see on your wedding invitation!
        </p>
      </div>
    </div>
  )
}

export default WeddingPhotoUpload