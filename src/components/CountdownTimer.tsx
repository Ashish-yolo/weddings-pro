import React, { useState, useEffect } from 'react'

interface CountdownTimerProps {
  targetDate: string
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, className = "" }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isWeddingDay, setIsWeddingDay] = useState(false)
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const difference = target - now

      if (difference < 0) {
        setIsPast(true)
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      if (difference < 86400000) { // Less than 24 hours
        setIsWeddingDay(true)
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      }
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    // Calculate initial time
    setTimeLeft(calculateTimeLeft())

    return () => clearInterval(timer)
  }, [targetDate])

  if (isPast) {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl shadow-lg">
          <div className="text-2xl font-bold">🎉 Congratulations! 🎉</div>
          <div className="text-lg mt-2">The wedding has taken place!</div>
        </div>
      </div>
    )
  }

  if (isWeddingDay) {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-6 rounded-2xl shadow-lg animate-pulse">
          <div className="text-3xl font-bold mb-2">💒 IT'S WEDDING DAY! 💒</div>
          <div className="text-xl">The big day is here!</div>
        </div>
      </div>
    )
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, icon: '📅' },
    { label: 'Hours', value: timeLeft.hours, icon: '🕐' },
    { label: 'Minutes', value: timeLeft.minutes, icon: '⏱️' },
    { label: 'Seconds', value: timeLeft.seconds, icon: '⚡' }
  ]

  return (
    <div className={`text-center ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Countdown to Our Special Day</h3>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {timeUnits.map((unit, index) => (
          <div
            key={unit.label}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="text-3xl mb-2">{unit.icon}</div>
            <div className="text-3xl font-bold text-gray-800 mb-1 font-mono">
              {unit.value.toString().padStart(2, '0')}
            </div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <p className="text-gray-600 text-lg">
          We can't wait to celebrate with you! 💕
        </p>
      </div>
    </div>
  )
}

export default CountdownTimer