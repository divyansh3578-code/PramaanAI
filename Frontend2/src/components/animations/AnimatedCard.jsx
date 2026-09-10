import { motion } from 'framer-motion'
import { cardHover, fadeUp } from '../../animations/variants.js'

export default function AnimatedCard({ children, className = '', delay = 0, onClick }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay }}
      whileHover={cardHover}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
