import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'

/* ─── Types ─── */
type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: number
  type: ToastType
  title: string
  message?: string
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void
}

/* ─── Config ─── */
const TOAST_CONFIG: Record<ToastType, { icon: typeof CheckCircle2; accent: string; bg: string; border: string; bar: string }> = {
  success: {
    icon: CheckCircle2,
    accent: 'text-emerald-400',
    bg: 'bg-[#0c1a1a]',
    border: 'border-emerald-500/20',
    bar: 'bg-emerald-500',
  },
  error: {
    icon: XCircle,
    accent: 'text-red-400',
    bg: 'bg-[#1a0c0c]',
    border: 'border-red-500/20',
    bar: 'bg-red-500',
  },
  warning: {
    icon: AlertTriangle,
    accent: 'text-amber-400',
    bg: 'bg-[#1a160c]',
    border: 'border-amber-500/20',
    bar: 'bg-amber-500',
  },
  info: {
    icon: Info,
    accent: 'text-blue-400',
    bg: 'bg-[#0c121a]',
    border: 'border-blue-500/20',
    bar: 'bg-blue-500',
  },
}

const TOAST_DURATION = 4000

/* ─── Context ─── */
const ToastContext = createContext<ToastContextType | null>(null)

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

/* ─── Individual Toast ─── */
function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const config = TOAST_CONFIG[toast.type]
  const Icon = config.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', damping: 22, stiffness: 300 }}
      className={`relative w-80 rounded-2xl border ${config.border} ${config.bg} shadow-2xl shadow-black/40 backdrop-blur-xl overflow-hidden`}
    >
      {/* Content */}
      <div className="flex items-start gap-3 p-4">
        <div className={`shrink-0 mt-0.5 ${config.accent}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-snug">{toast.title}</p>
          {toast.message && (
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 p-1 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-[2px] w-full bg-white/5">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: TOAST_DURATION / 1000, ease: 'linear' }}
          className={`h-full ${config.bar}`}
        />
      </div>
    </motion.div>
  )
}

/* ─── Provider ─── */
let toastCounter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = ++toastCounter
      setToasts((prev) => [...prev, { ...toast, id }])

      // Auto-dismiss
      setTimeout(() => dismiss(id), TOAST_DURATION)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container — fixed top-right */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
