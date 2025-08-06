import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import WeddingForm from './pages/WeddingForm'
import PublicWeddingPage from './pages/PublicWeddingPage'
import PhotoGallery from './pages/PhotoGallery'
import './App.css'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/wedding/new" element={<WeddingForm />} />
      <Route path="/wedding/edit/:id" element={<WeddingForm />} />
      <Route path="/wedding/:id/photos" element={<PhotoGallery />} />
      <Route path="/w/:slug" element={<PublicWeddingPage />} />
    </Routes>
  )
}

export default App
