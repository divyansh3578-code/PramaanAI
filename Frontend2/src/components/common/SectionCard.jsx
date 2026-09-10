import { motion } from 'framer-motion'
import { fadeUp, cardHover } from '../../animations/variants.js'

export default function SectionCard({ title, eyebrow, description, actions, children, className = '' }) {
  return (
    <motion.div
      className={`bg-white rounded border border-slate-200 shadow-sm p-6 flex flex-col gap-4 ${className}`}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-36px' }}
      whileHover={cardHover}
    >
      {(title || eyebrow || actions) && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            {eyebrow && (
              <span className="bg-navy text-saffron font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                {eyebrow}
              </span>
            )}
            {title && <h2 className="text-[17px] font-bold text-navy mt-1">{title}</h2>}
            {description && <p className="text-slate-600 text-[12px] max-w-3xl mt-0.5">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </motion.div>
  )
}
