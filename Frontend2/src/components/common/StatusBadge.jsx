import Icon from './Icon.jsx'
import { STATUS } from '../../data/bidders.js'

const STYLES = {
  [STATUS.ELIGIBLE]: { icon: 'verified', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  [STATUS.DISQUALIFIED]: { icon: 'cancel', className: 'bg-rose-600 text-white border-rose-600' },
  [STATUS.HIGH_RISK]: { icon: 'error', className: 'bg-rose-100 text-rose-800 border-rose-300' },
  [STATUS.SCRUTINY]: { icon: 'pending', className: 'bg-amber-100 text-amber-800 border-amber-300' },
}

export default function StatusBadge({ status, score, size = 'md' }) {
  const style = STYLES[status] || STYLES[STATUS.SCRUTINY]
  const padding = size === 'sm' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'
  return (
    <span
      className={`inline-flex items-center gap-1 border rounded font-mono font-bold ${padding} ${style.className}`}
    >
      <Icon name={style.icon} size={12} />
      {status}
      {typeof score === 'number' && ` (${score}/100)`}
    </span>
  )
}
