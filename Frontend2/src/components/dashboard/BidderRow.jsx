import Icon from '../common/Icon.jsx'
import StatusBadge from '../common/StatusBadge.jsx'
import { STATUS } from '../../data/bidders.js'

const ROW_TONE = {
  [STATUS.DISQUALIFIED]: 'bg-rose-50/80 border-l-4 border-rose-600 hover:bg-rose-100/60',
  [STATUS.SCRUTINY]: 'bg-amber-50/60 hover:bg-amber-100/50',
  [STATUS.ELIGIBLE]: 'hover:bg-slate-50',
  [STATUS.HIGH_RISK]: 'hover:bg-slate-50',
}

const SL_TONE = {
  [STATUS.DISQUALIFIED]: 'text-rose-700',
  [STATUS.SCRUTINY]: 'text-amber-800',
  [STATUS.ELIGIBLE]: 'text-slate-500',
  [STATUS.HIGH_RISK]: 'text-slate-500',
}

const ACTION_BTN = {
  approve: 'bg-[#026635] text-white hover:bg-emerald-800',
  review: 'bg-rose-700 text-white hover:bg-rose-800 shadow-sm',
  query: 'bg-amber-700 text-white hover:bg-amber-800',
  blacklist: 'bg-slate-200 text-rose-800 hover:bg-slate-300',
}

export default function BidderRow({ bidder, isSelected, isApproved, onSelect, onAction }) {
  const status = bidder.eligibility.status
  const gstIcon = bidder.gst.ok ? 'check_circle' : 'block'
  const gstColor = bidder.gst.ok ? 'text-emerald-700' : 'text-rose-700'

  return (
    <tr
      onClick={() => onSelect(bidder)}
      className={`transition-colors cursor-pointer ${ROW_TONE[status]} ${isSelected ? 'ring-2 ring-inset ring-teal' : ''}`}
    >
      <td className={`py-2.5 px-3 text-center font-mono font-bold border-r border-slate-200 ${SL_TONE[status]}`}>
        {String(bidder.slNo).padStart(2, '0')}
      </td>
      <td className="py-2.5 px-3 border-r border-slate-200">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`font-bold ${bidder.flagged ? 'text-rose-700' : 'text-navy'}`}>{bidder.name}</span>
          {bidder.flagged && (
            <span className="bg-rose-600 text-white font-mono text-[9px] px-1 rounded font-bold uppercase">Flagged</span>
          )}
        </div>
        <div className={`text-[10px] font-mono ${bidder.flagged ? 'text-rose-800' : 'text-slate-500'}`}>
          {bidder.id} • GeM-ID: {bidder.gemId} • PAN: {bidder.pan}
        </div>
      </td>
      <td className="py-2.5 px-3 border-r border-slate-200">
        <StatusBadge status={status} score={bidder.eligibility.score} />
      </td>
      <td className="py-2.5 px-3 border-r border-slate-200 font-mono text-[11px]">
        <span className={`font-bold flex items-center gap-1 ${gstColor}`}>
          <Icon name={gstIcon} size={13} /> {bidder.gst.label} ({bidder.gstin})
        </span>
        <span className={`text-[9px] ${bidder.gst.ok ? 'text-slate-500' : 'text-rose-600'}`}>{bidder.gst.note}</span>
      </td>
      <td className={`py-2.5 px-3 border-r border-slate-200 font-mono text-[11px] font-semibold ${bidder.mca.ok ? 'text-emerald-700' : 'text-amber-700'}`}>
        {bidder.mca.label}
      </td>
      <td className="py-2.5 px-3 border-r border-slate-200 text-slate-600 text-[11px]">
        {bidder.udyam.scale} {bidder.udyam.emd ? `(${bidder.udyam.emd})` : ''}
      </td>
      <td className={`py-2.5 px-3 border-r border-slate-200 font-mono text-[11px] font-semibold ${bidder.epfoEsic.ok ? 'text-emerald-700' : 'text-amber-700'}`}>
        {bidder.epfoEsic.label}
      </td>
      <td className={`py-2.5 px-3 border-r border-slate-200 font-mono font-bold ${bidder.makeInIndia.cls === 'Class-2' && !bidder.gst.ok ? 'text-rose-700' : 'text-navy'}`}>
        {bidder.makeInIndia.cls} ({bidder.makeInIndia.pct.toFixed ? bidder.makeInIndia.pct.toFixed(1) : bidder.makeInIndia.pct}%)
      </td>
      <td className={`py-2.5 px-3 border-r border-slate-200 text-[11px] ${status === STATUS.DISQUALIFIED ? 'text-rose-800 font-medium' : status === STATUS.SCRUTINY ? 'text-amber-900 font-medium' : status === STATUS.HIGH_RISK ? 'text-rose-800' : 'text-slate-600'}`}>
        {bidder.discrepancy}
      </td>
      <td className="py-2.5 px-3 text-right">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAction(bidder)
          }}
          disabled={isApproved}
          className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${isApproved ? 'bg-emerald-100 text-emerald-800 cursor-default' : ACTION_BTN[bidder.action.tone]}`}
        >
          {isApproved ? 'Approved ✓' : bidder.action.label}
        </button>
      </td>
    </tr>
  )
}
