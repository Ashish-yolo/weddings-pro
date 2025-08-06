import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import AuthForm from '../components/AuthForm'
import Layout from '../components/Layout'
import LanguageSelector from '../components/LanguageSelector'

const LandingPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showAuth, setShowAuth] = useState(false)
  const { t } = useTranslation()

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  return (
    <Layout showNavigation={false}>
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-pink-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-200 rounded-full opacity-25 animate-pulse delay-500"></div>
          </div>
        </div>

        {/* Header */}
        <header className="relative py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">💒</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t('landing.title')}
                </h1>
              </div>
              <LanguageSelector />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg mb-8">
              <span className="text-sm font-medium text-purple-600">✨ {t('landing.tagline')}</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('landing.subtitle')}
              </span>
            </h2>
            
            <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('landing.description')}
            </p>
            
            <div className="mt-16 flex justify-center">
              <button
                onClick={() => setShowAuth(true)}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white px-16 py-6 text-2xl font-bold rounded-2xl hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 hover:scale-105 animate-pulse hover:animate-none border-2 border-white/20"
              >
{t('landing.startPlanning')}
              </button>
            </div>
            
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
{t('landing.noCredit')}
              </div>
            </div>
          </div>

          {/* Wedding Image Hero Section */}
          <div className="mt-24 flex justify-center">
            <div className="relative group max-w-4xl w-full">
              {/* Main Wedding Image */}
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
                {/* Beautiful gradient background as placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200">
                  {/* Overlay pattern */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10"></div>
                  
                  {/* Wedding-themed illustration */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white drop-shadow-lg">
                      <div className="text-8xl md:text-9xl mb-4 animate-bounce-gentle">💒</div>
                      <div className="flex items-center justify-center space-x-6 text-6xl md:text-7xl">
                        <span className="animate-pulse" style={{animationDelay: '0.5s'}}>💍</span>
                        <span className="animate-bounce-gentle" style={{animationDelay: '1s'}}>💕</span>
                        <span className="animate-pulse" style={{animationDelay: '1.5s'}}>💐</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating hearts animation */}
                  <div className="absolute top-10 left-10 text-pink-300 text-2xl animate-float opacity-60">💖</div>
                  <div className="absolute top-20 right-16 text-purple-300 text-xl animate-bounce-gentle opacity-50" style={{animationDelay: '2s'}}>💝</div>
                  <div className="absolute bottom-20 left-20 text-pink-400 text-3xl animate-pulse opacity-40" style={{animationDelay: '3s'}}>🌹</div>
                  <div className="absolute bottom-16 right-12 text-purple-400 text-2xl animate-float opacity-50" style={{animationDelay: '1.5s'}}>✨</div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -top-4 -right-8 w-8 h-8 bg-purple-300 rounded-full opacity-30 animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
              <div className="absolute -bottom-8 -left-4 w-16 h-16 bg-indigo-300 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>
              <div className="absolute -bottom-6 -right-6 w-10 h-10 bg-pink-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>

          {/* Image caption */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 italic font-script text-lg">
              "{t('landing.heroCaption')}"
            </p>
          </div>
        </main>

        {/* Features Section */}
        <section className="relative z-10 bg-white/30 backdrop-blur-sm py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Features */}
          <div className="mt-16">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('landing.everythingYouNeed')}</h3>
              <p className="text-xl text-gray-600">{t('landing.featuresSubtitle')}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">💒</div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">{t('landing.features.pages.title')}</h4>
                <p className="text-gray-600 leading-relaxed">{t('landing.features.pages.description')}</p>
              </div>
              
              <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📝</div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">{t('landing.features.rsvp.title')}</h4>
                <p className="text-gray-600 leading-relaxed">{t('landing.features.rsvp.description')}</p>
              </div>
              
              <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📸</div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">{t('landing.features.photos.title')}</h4>
                <p className="text-gray-600 leading-relaxed">{t('landing.features.photos.description')}</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-32 text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white">
              <h3 className="text-4xl font-bold mb-6">{t('landing.readyToStart')}</h3>
              <p className="text-xl mb-8 opacity-90">{t('landing.joinThousands')}</p>
              <button
                onClick={() => setShowAuth(true)}
                className="bg-white text-purple-600 px-8 py-4 text-lg rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-bold"
              >
{t('landing.createPage')}
              </button>
            </div>
          </div>
          </div>
        </section>

        {/* Auth Modal */}
        {showAuth && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{t('landing.signIn')}</h3>
                <button
                  onClick={() => setShowAuth(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <AuthForm onSuccess={() => {
                setShowAuth(false)
                navigate('/dashboard')
              }} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default LandingPage