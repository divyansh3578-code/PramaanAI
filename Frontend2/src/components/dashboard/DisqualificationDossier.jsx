
import Icon from '../common/Icon.jsx'
import { STATUS } from '../../data/bidders.js'
import { useToast } from '../../context/ToastContext.jsx'

const THEME = {
  [STATUS.ELIGIBLE]: {
    border: 'border-emerald-600',
    headerBg: 'bg-emerald-50',
    headerBorder: 'border-emerald-300',
    badgeIconBg: 'bg-emerald-600',
    tagBg: 'bg-emerald-600',
    icon: 'verified',
    confidenceLabel: 'Statutory Compliance Confidence',
    confidenceColor: 'text-emerald-700',
    dossierTag: 'CVC Vigilance Clear • Bidder Compliance Dossier',
    actionLabel: 'Confirm Stage-1 Approval & Sign DSC',
    actionIcon: 'task_alt',
    actionColor: 'bg-emerald-700 hover:bg-emerald-800',
    actionDesc:
      'Confirming approval will admit this bidder to the Stage-2 Financial Bid Opening, publish the compliance dossier to the GeM/CPPP portal, and archive the audit trail under CVC Procurement Directives.',
  },
  [STATUS.SCRUTINY]: {
    border: 'border-amber-500',
    headerBg: 'bg-amber-50',
    headerBorder: 'border-amber-300',
    badgeIconBg: 'bg-amber-600',
    tagBg: 'bg-amber-600',
    icon: 'pending',
    confidenceLabel: 'Manual Scrutiny Confidence',
    confidenceColor: 'text-amber-700',
    dossierTag: 'CVC Vigilance Flag • Manual Scrutiny Dossier',
    actionLabel: 'Send Clarification Query & Sign DSC',
    actionIcon: 'contact_support',
    actionColor: 'bg-amber-700 hover:bg-amber-800',
    actionDesc:
      'Sending this query will transmit a formal clarification request to the bidder via the GeM/CPPP portal with a 72-hour statutory response window, and log the request in the audit trail.',
  },
  [STATUS.HIGH_RISK]: {
    border: 'border-rose-600',
    headerBg: 'bg-rose-50',
    headerBorder: 'border-rose-300',
    badgeIconBg: 'bg-rose-600',
    tagBg: 'bg-rose-600',
    icon: 'error',
    confidenceLabel: 'Statutory Risk Confidence',
    confidenceColor: 'text-rose-700',
    dossierTag: 'CVC Vigilance Flag • High-Risk Bidder Dossier',
    actionLabel: 'Confirm Blacklist Note & Sign DSC',
    actionIcon: 'gavel',
    actionColor: 'bg-rose-700 hover:bg-rose-800',
    actionDesc:
      'Confirming this note will attach a vigilance risk flag to the bidder\u2019s CPPP profile pending further inquiry, and notify the CVC Vigilance Directorate for review.',
  },
  [STATUS.DISQUALIFIED]: {
    border: 'border-rose-600',
    headerBg: 'bg-rose-50',
    headerBorder: 'border-rose-300',
    badgeIconBg: 'bg-rose-600',
    tagBg: 'bg-rose-600',
    icon: 'gavel',
    confidenceLabel: 'Statutory Disqualification Confidence',
    confidenceColor: 'text-rose-700',
    dossierTag: 'CVC Vigilance Flag • Bidder Ineligibility Dossier',
    actionLabel: 'Confirm Disqualification & Sign DSC',
    actionIcon: 'gavel',
    actionColor: 'bg-rose-700 hover:bg-rose-800',
    actionDesc:
      'Confirming disqualification will transmit this dossier to the CPCL Vigilance Directorate, initiate debarment protocol on GeM/CPPP portal, and issue statutory show-cause notice under CVC Procurement Directives Section 7.1.',
  },
}

const CHECKLIST_ICON = { pass: 'check_circle', warning: 'warning', fail: 'cancel' }
const CHECKLIST_COLOR = { pass: 'text-emerald-700', warning: 'text-amber-700', fail: 'text-rose-700' }

export default function DisqualificationDossier({ bidder, isConfirmed, onConfirm, dossierRef }) {
  const { notify } = useToast()


  if (!bidder) return null

  const status = bidder.eligibility.status
  const theme = THEME[status]
  const failCount = bidder.checklist.filter((c) => c.status === 'fail').length
  const warnCount = bidder.checklist.filter((c) => c.status === 'warning').length
  const dossierId = bidder.dossierId || `CPCL-VIG-2025-${bidder.id.replace('BID-882-', '')}`

  const handleConfirm = async () => {
  try {
    await onConfirm(bidder.id)
  } catch (err) {
    console.error('Dossier action failed:', err)
  }
}

  const handleClarification = () => {
    notify('GeM Clarification Notice issued', {
      tone: 'info',
      detail: `Sent to ${bidder.name} via CPPP portal — 72hr statutory response window opened.`,
    })
  }

  const handleDownload = () => {
    notify('SHA-256 audit log prepared', {
      tone: 'info',
      detail: `Dossier ${dossierId} • Evidence Hash: SHA256:${bidder.id.toLowerCase().replace(/-/g, '')}…`,
    })
  }

  return (
    <div ref={dossierRef} className={`bg-white rounded border-2 ${theme.border} shadow-sm flex flex-col overflow-hidden scroll-mt-6`}>
      {/* Dossier header */}
      <div className={`${theme.headerBg} border-b ${theme.headerBorder} p-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded ${theme.badgeIconBg} text-white flex items-center justify-center shrink-0 shadow`}>
            <Icon name={theme.icon} size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`${theme.tagBg} text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wide`}>
                {theme.dossierTag}
              </span>
              <span className={`text-[11px] font-mono font-bold ${theme.confidenceColor}`}>Dossier ID: {dossierId}</span>
            </div>
            <h3 className="text-[17px] font-bold text-navy mt-0.5">{bidder.name}</h3>
            <div className="text-[11px] font-mono text-slate-600 flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5">
              <span>
                <strong>CIN:</strong> {bidder.cin}
              </span>
              <span>
                <strong>GSTIN:</strong> {bidder.gstin}
              </span>
              <span>
                <strong>PAN:</strong> {bidder.pan}
              </span>
              <span>
                <strong>GeM Seller ID:</strong> {bidder.gemId}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-300 p-2 rounded shrink-0">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold">{theme.confidenceLabel}</span>
            <span className={`text-[16px] font-bold font-mono ${theme.confidenceColor}`}>{bidder.confidence.toFixed(1)}% Deterministic Certainty</span>
          </div>
          <Icon name="verified" size={28} className={theme.confidenceColor} />
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 10-point checklist */}
        <div className="lg:col-span-5 bg-[#f8fafc] border border-slate-300 rounded p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-300 pb-2 gap-2 flex-wrap">
            <span className="font-bold text-navy text-[12px] uppercase tracking-wide flex items-center gap-1.5">
              <Icon name="checklist" size={16} className="text-navy" />
              10-Point Statutory Ingestion Checklist
            </span>
            {failCount > 0 ? (
              <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                {failCount} Hard Failure{failCount > 1 ? 's' : ''}
              </span>
            ) : warnCount > 0 ? (
              <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                {warnCount} Advisory Note{warnCount > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                Zero Discrepancies
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 text-[11px]">
            {bidder.checklist.map((item, i) => (
              <div key={item.label} className="flex items-center justify-between p-1.5 bg-white border border-slate-200 rounded gap-2">
                <span className="font-medium text-slate-800">
                  {i + 1}. {item.label}
                </span>
                <span className={`font-mono font-bold flex items-center gap-1 shrink-0 ${CHECKLIST_COLOR[item.status]}`}>
                  <Icon name={CHECKLIST_ICON[item.status]} size={13} /> {item.note}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contradictions + officer action deck */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-3">
          {bidder.contradictions.length > 0 ? (
            <div className={`${theme.headerBg} border ${theme.headerBorder} rounded p-3 flex flex-col gap-2`}>
              <span className={`font-bold text-[12px] uppercase flex items-center gap-1.5 ${theme.confidenceColor}`}>
                <Icon name="report" size={16} />
                Statutory Cross-Verification {status === STATUS.SCRUTINY ? 'Queries' : 'Contradictions'} (CVC Non-Compliance)
              </span>
              <div className="bg-white border border-slate-200 rounded p-2.5 flex flex-col gap-2 text-[12px]">
                {bidder.contradictions.map((c, i) => (
                  <div key={c.title} className={`flex items-start gap-2 ${i > 0 ? 'pt-1 border-t border-slate-100' : ''}`}>
                    <Icon name={theme.icon} size={16} className={`${theme.confidenceColor} shrink-0 mt-0.5`} />
                    <p className="text-slate-800 leading-tight">
                      <strong className={`${theme.confidenceColor} font-bold`}>{c.title}</strong> {c.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 flex-wrap gap-1">
                <span>National Cyber Audit Timestamp: 04-Mar-2025 09:18:22 UTC</span>
                <span>Evidence Hash: SHA256:{bidder.id.toLowerCase().replace(/-/g, '')}…</span>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-300 rounded p-3 flex items-start gap-2">
              <Icon name="task_alt" size={18} className="text-emerald-700 shrink-0 mt-0.5" />
              <p className="text-[12px] text-emerald-900 leading-relaxed">
                No statutory cross-verification contradictions identified. All declarations reconcile against live
                GSTN, MCA-21, Udyam and EPFO/ESIC registry data as of the last polling cycle.
              </p>
            </div>
          )}

          {/* Officer DSC action deck */}
          <div className="bg-[#f0f4f9] border border-slate-300 rounded p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-bold text-navy text-[12px] uppercase">Officer Statutory Action &amp; Digital Signature (DSC) Gate</span>
              <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300">
                DSC Certificate: CPCL-VIG-TOKEN-CLASS3
              </span>
            </div>
            <p className="text-[11px] text-slate-600">{theme.actionDesc}</p>
{(isConfirmed || bidder.actionConfirmedAt) && (
  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1">
    <Icon name="check_circle" size={14} />
    Action Confirmed
    {bidder.actionConfirmedAt
      ? ` at ${new Date(bidder.actionConfirmedAt).toLocaleString('en-IN', {
          dateStyle: 'short',
          timeStyle: 'medium',
        })}`
      : ''}
  </div>
)}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleConfirm}
                disabled={isConfirmed}
                className={`flex-1 min-w-[200px] h-9 px-3 text-white rounded font-bold text-[12px] flex items-center justify-center gap-1.5 shadow transition-colors ${
                  isConfirmed ? 'bg-slate-300 cursor-default' : theme.actionColor
                }`}
              >
                <Icon name={isConfirmed ? 'check_circle' : theme.actionIcon} size={16} />
                <span>{isConfirmed ? 'Action Recorded' : theme.actionLabel}</span>
              </button>
              <button
                onClick={handleClarification}
                className="h-9 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded font-medium text-[12px] flex items-center gap-1 shadow-sm"
              >
                <Icon name="contact_support" size={16} className="text-amber-700" />
                <span>Issue GeM Clarification Notice</span>
              </button>
              <button
                onClick={handleDownload}
                className="h-9 px-3 bg-navy hover:bg-navy-700 text-white rounded font-medium text-[12px] flex items-center gap-1 shadow-sm"
              >
                <Icon name="download" size={16} className="text-saffron" />
                <span>Download SHA-256 Audit Log</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
