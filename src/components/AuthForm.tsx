import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface AuthFormProps {
  onSuccess: () => void
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { signInWithOtp, verifyOtp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (step === 'email') {
        // Send OTP to email
        const result = await signInWithOtp(email)
        
        if (result.error) {
          setError(result.error.message)
        } else {
          setSuccess(result.message || 'OTP sent to your email!')
          setStep('otp')
        }
      } else {
        // Verify OTP
        const result = await verifyOtp(email, otp)
        
        if (result.error) {
          setError(result.error.message)
        } else {
          onSuccess()
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setStep('email')
    setOtp('')
    setError('')
    setSuccess('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900">
          {step === 'email' ? 'Sign In or Sign Up' : 'Enter Verification Code'}
        </h3>
        <p className="text-gray-600 mt-1">
          {step === 'email' 
            ? 'We\'ll send you a 6-digit code to verify your email' 
            : `We sent a code to ${email}`
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 'email' ? (
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 focus:bg-white text-lg"
              placeholder="Enter your email address"
            />
            <p className="text-xs text-gray-500">
              Enter your email to receive a verification code. If you don't have an account, we'll create one for you.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-semibold text-gray-700">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 focus:bg-white text-lg text-center font-mono tracking-widest"
                placeholder="000000"
                autoComplete="one-time-code"
              />
              <p className="text-xs text-gray-500">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <button
              type="button"
              onClick={handleBack}
              className="w-full text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              ← Use different email address
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-center">
              <span className="text-red-500 text-lg mr-2">⚠️</span>
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-center">
              <span className="text-green-500 text-lg mr-2">✅</span>
              <span className="text-green-700 text-sm font-medium">{success}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (step === 'otp' && otp.length !== 6)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold disabled:opacity-50 disabled:transform-none flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {step === 'email' ? 'Sending Code...' : 'Verifying...'}
            </>
          ) : (
            <>
              <span className="mr-2">{step === 'email' ? '📧' : '🔐'}</span>
              {step === 'email' ? 'Send Verification Code' : 'Verify & Sign In'}
            </>
          )}
        </button>

        {step === 'email' && (
          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        )}
      </form>
    </div>
  )
}

export default AuthForm