import React, { useEffect, useState } from 'react'

interface Heart {
  id: number
  left: number
  animationDuration: number
  size: number
  opacity: number
  delay: number
}

const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<Heart[]>([])

  useEffect(() => {
    const createHearts = () => {
      const newHearts: Heart[] = []
      for (let i = 0; i < 15; i++) {
        newHearts.push({
          id: i,
          left: Math.random() * 100,
          animationDuration: 15 + Math.random() * 10,
          size: 0.5 + Math.random() * 1,
          opacity: 0.3 + Math.random() * 0.4,
          delay: Math.random() * 10
        })
      }
      setHearts(newHearts)
    }

    createHearts()
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-up"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}rem`,
            opacity: heart.opacity,
            animationDuration: `${heart.animationDuration}s`,
            animationDelay: `${heart.delay}s`
          }}
        >
          💕
        </div>
      ))}
      
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up linear infinite;
        }
      `}</style>
    </div>
  )
}

export default FloatingHearts