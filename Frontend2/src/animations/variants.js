export const easeOut = [0.22, 1, 0.36, 1]

export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
}

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
}

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
}

export const cardHover = { y: -4, scale: 1.01, transition: { duration: 0.2, ease: easeOut } }

export const reducedMotion = { duration: 0 }

export function getMotionProps(shouldReduce) {
  return shouldReduce ? { initial: false, animate: false, whileHover: undefined } : {}
}

export function usePrefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useInView(options = {}) {
  return { once: true, margin: '-48px', ...options }
}

export function useStaggerChildren() {
  return staggerContainer
}

export const fadeInUp = fadeUp
export const slideInLeft = fadeUp
export const scaleIn = fadeUp
export const modalVariants = pageVariants
export const toastVariants = pageVariants
export const listItemVariants = fadeUp
export const buttonTap = { scale: 0.97 }
export const iconHover = { rotate: 5, scale: 1.08, transition: { duration: 0.2 } }
export const dropdownVariants = { hidden: { opacity: 0, y: -8, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: easeOut } } }
export const pageTransition = pageVariants
export const staggerChildren = staggerContainer
export const slideInRight = fadeUp
export const pulseSubtle = { scale: [1, 1.03, 1], transition: { duration: 2, repeat: Infinity } }
export const glow = { boxShadow: ['0 0 0 rgba(255,153,51,0)', '0 0 24px rgba(255,153,51,.18)', '0 0 0 rgba(255,153,51,0)'], transition: { duration: 2.4, repeat: Infinity } }
export const getMotionVariants = (variants) => variants
export const useMotionConfig = () => ({ reducedMotion: 'user' })
export const useReducedMotion = usePrefersReducedMotion
export const useAnimationOnView = useInView
export const ANIMATION_DURATION = { fast: 0.15, normal: 0.3, slow: 0.5 }
export const ANIMATION_EASE = easeOut
export const viewportOnce = { once: true, margin: '-48px' }
export const spring = { type: 'spring', stiffness: 400, damping: 28 }
export const hoverLift = cardHover
export const tapScale = buttonTap
export const navIndicator = { layoutId: 'nav-active-indicator', transition: spring }
export const listStagger = staggerContainer
export const heroReveal = fadeUp
export const kpiReveal = fadeUp
export const portalReveal = fadeUp
export const modalReveal = pageVariants
export const toastReveal = pageVariants
export const loadingPulse = pulseSubtle
export const safeMotion = { initial: 'hidden', whileInView: 'show', viewport: viewportOnce }
export const motionTokens = { duration: ANIMATION_DURATION, ease: ANIMATION_EASE }
export const withReducedMotion = (value, reduce) => (reduce ? undefined : value)
export const fade = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
export const scaleReveal = { hidden: { opacity: 0, scale: 0.96 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easeOut } } }
export const slideReveal = { hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: easeOut } } }
export const bounceIn = { hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 18 } } }
export const noMotion = { initial: false, animate: false }
export const motionSafe = (value, shouldReduce) => shouldReduce ? noMotion : value
export const createStagger = (delay = 0.08) => ({ hidden: {}, show: { transition: { staggerChildren: delay } } })
export const createFade = (distance = 18) => ({ hidden: { opacity: 0, y: distance }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } } })
export const createSlide = (distance = 20) => ({ hidden: { opacity: 0, x: -distance }, show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: easeOut } } })
export const createScale = () => scaleReveal
export const createHover = (amount = -4) => ({ y: amount, transition: { duration: 0.2, ease: easeOut } })
export const createTap = (amount = 0.97) => ({ scale: amount })
export const createSpring = (stiffness = 400, damping = 28) => ({ type: 'spring', stiffness, damping })
export const motionDefaults = { viewport: viewportOnce, transition: { duration: 0.45, ease: easeOut } }
export const animationNames = ['fade-in-up', 'scale-in', 'slide-in-left', 'slide-in-right', 'pulse-subtle', 'glow']
export const isAnimationReady = true
export default { pageVariants, staggerContainer, fadeUp, cardHover }
