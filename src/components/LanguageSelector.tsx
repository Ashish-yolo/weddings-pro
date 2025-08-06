import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface LanguageSelectorProps {
  variant?: 'default' | 'navbar'
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'default' }) => {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', nativeName: 'हिन्दी' },
    { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', nativeName: 'Italiano' },
    { code: 'pt', name: 'Português', flag: '🇧🇷', nativeName: 'Português' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', nativeName: 'Русский' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', nativeName: '日本語' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', nativeName: '한국어' },
    { code: 'zh', name: '中文', flag: '🇨🇳', nativeName: '中文' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', nativeName: 'العربية' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    setIsOpen(false)
  }

  const buttonClasses = variant === 'navbar' 
    ? "flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 border border-gray-200"
    : "flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/95 transition-all duration-200 text-gray-700 border border-gray-200 shadow-lg"

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
        aria-label={t('nav.language')}
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:block font-medium">{currentLanguage.nativeName}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 min-w-[180px] max-h-80 overflow-y-auto">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                i18n.language === language.code ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <div className="flex-1 text-left">
                <span className="font-medium block">{language.nativeName}</span>
                {language.name !== language.nativeName && (
                  <span className="text-xs text-gray-500">{language.name}</span>
                )}
              </div>
              {i18n.language === language.code && (
                <svg className="w-4 h-4 ml-auto text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Click overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default LanguageSelector