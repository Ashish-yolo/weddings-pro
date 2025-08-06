import React, { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Wedding = Database['public']['Tables']['weddings']['Row']

interface PhotoUploadProps {
  wedding: Wedding
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ wedding }) => {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState('')
  const [guestName, setGuestName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)


  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === wedding.photo_password) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer back camera on mobile
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setShowCamera(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      setError('Unable to access camera. Please upload a photo instead.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    canvas.toBlob(async (blob) => {
      if (blob) {
        await uploadPhoto(blob, `captured-${Date.now()}.jpg`)
      }
    }, 'image/jpeg', 0.8)

    stopCamera()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadPhoto(file, file.name)
    }
  }

  const uploadPhoto = async (file: Blob, fileName: string) => {
    setUploading(true)
    setError('')

    try {
      // Create a unique file path
      const fileExt = fileName.split('.').pop()
      const uniqueFileName = `${wedding.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('wedding-photos')
        .upload(uniqueFileName, file)

      if (uploadError) throw uploadError

      // Save photo record to database
      const { error: dbError } = await supabase
        .from('photos')
        .insert([{
          wedding_id: wedding.id,
          file_name: fileName,
          file_path: uploadData.path,
          file_size: file.size,
          mime_type: file.type || 'image/jpeg',
          uploaded_by_guest: guestName || 'Anonymous'
        }])

      if (dbError) throw dbError

      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (error: any) {
      console.error('Error uploading photo:', error)
      setError(error.message || 'Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-4">Share Your Photos</h2>
        <p className="text-gray-600 mb-6">
          The happy couple would love to see your photos from their special day! 
          Please enter the photo password to upload or take photos. Your photos will be reviewed before appearing on the wedding page.
        </p>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Photo Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter the photo password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-4">Share Your Photos</h2>
      
      {uploadSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Photo uploaded successfully! It will appear on the wedding page once approved by the couple.
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name (Optional)
        </label>
        <input
          type="text"
          id="guestName"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="So the couple knows who shared this photo"
        />
      </div>

      {/* Upload Info */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
          <span className="mr-2">📸</span>
          Upload as many photos as you'd like!
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Your photos will be reviewed by the couple before appearing on the wedding page.
        </p>
      </div>

      {!showCamera ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={startCamera}
              disabled={uploading}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors disabled:opacity-50"
            >
              <div className="text-3xl mb-2">📷</div>
              <span className="text-sm font-medium">Take Photo</span>
            </button>

            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors cursor-pointer">
              <div className="text-3xl mb-2">📁</div>
              <span className="text-sm font-medium">Upload Photo</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          {uploading && (
            <div className="text-center text-gray-600">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-2"></div>
              Uploading photo...
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={capturePhoto}
              disabled={uploading}
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              📷 Capture Photo
            </button>
            <button
              onClick={stopCamera}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>

          {uploading && (
            <div className="text-center text-gray-600">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-2"></div>
              Uploading photo...
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PhotoUpload