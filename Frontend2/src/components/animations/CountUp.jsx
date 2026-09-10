import { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function CountUp({ value, duration = 900, className = '' }) {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, margin: '-30px' })
  const [count, setCount] = useState(0)
  const target = Number(value) || 0

  useEffect(() => {
    if (!visible) return undefined
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setCount(Math.round(target * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    return undefined
  }, [visible, target, duration])

  return <motion.span ref={ref} className={className} initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }}>{count}</motion.span>
}
