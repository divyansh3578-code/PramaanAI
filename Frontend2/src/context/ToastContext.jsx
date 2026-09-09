import { createContext, useCallback, useContext, useRef, useState } from 'react'
import Icon from '../components/common/Icon.jsx'

const ToastContext = createContext(null)

const TONE_STYLES = {
  success: { icon: 'check_circle', bg: 'bg-navy', border: 'border-emerald-400', accent: 'text-emerald-400' },
  info: { icon: 'info', bg: 'bg-navy', border: 'border-navy-200', accent: 'text-saffron' },
  warning: { icon: 'warning', bg: 'bg-navy', border: 'border-amber-400', accent: 'text-amber-400' },
}

let idSeq = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const notify = useCallback(
    (message, opts = {}) => {
      const id = idSeq++
      const toast = { id, message, tone: opts.tone || 'info', detail: opts.detail }
      setToasts((current) => [...current, toast])
      timers.current[id] = setTimeout(() => dismiss(id), opts.duration ?? 4200)
      return id
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ notify, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]">
        {toasts.map((t) => {
          const style = TONE_STYLES[t.tone] || TONE_STYLES.info
          return (
            <div
              key={t.id}
              role="status"
              className={`${style.bg} ${style.border} text-white border rounded shadow-lg px-3 py-2.5 flex items-start gap-2 animate-[fadeIn_0.15s_ease-out]`}
            >
              <Icon name={style.icon} size={18} className={`${style.accent} shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold leading-tight">{t.message}</p>
                {t.detail && <p className="text-[10px] font-mono text-navy-100 mt-0.5 leading-snug">{t.detail}</p>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-navy-200 hover:text-white shrink-0"
                aria-label="Dismiss notification"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
