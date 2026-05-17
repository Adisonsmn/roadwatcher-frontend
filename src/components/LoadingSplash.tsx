import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function LoadingSplash({
  onComplete,
}: {
  onComplete: () => void
}) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'exit'>('loading')

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Speed up towards the end
        const increment = prev < 60 ? 3 : prev < 90 ? 5 : 2
        return Math.min(prev + increment, 100)
      })
    }, 40)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setPhase('exit')
        setTimeout(onComplete, 600)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [progress, onComplete])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={phase === 'exit' ? { opacity: 0, scale: 1.05 } : { opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800"
      >
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.03, 0.08, 0.03],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-navy-500"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-teal-500/30"
          >
            <span className="text-white font-bold text-2xl font-heading">RW</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl font-heading font-bold text-white mb-2 tracking-tight"
          >
            ROADWATCHER
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-navy-300 text-sm mb-10"
          >
            Better Roads, Better Future
          </motion.p>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 200 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="h-1 bg-navy-700/50 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-teal-400 to-teal-300 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>

          {/* Percentage */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
            className="text-navy-400 text-xs mt-3 font-mono"
          >
            {progress}%
          </motion.span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
