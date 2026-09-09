import Breadcrumb from '../components/common/Breadcrumb.jsx'
import SectionCard from '../components/common/SectionCard.jsx'
import Icon from '../components/common/Icon.jsx'

const INCIDENTS = [
  {
    id: 'GEM-INC-2025-0142',
    title: 'GSTN API rate-limit throttling during Stage-1 ingestion window',
    severity: 'warning',
    time: '04-Mar-2025 09:02 IST',
    detail: 'National GSTN gateway briefly throttled batch queries above 40 req/min; ingestion queue auto-retried with backoff, no data loss.',
  },
  {
    id: 'GEM-INC-2025-0141',
    title: 'NSIC registry endpoint desync (SPRS)',
    severity: 'warning',
    time: '04-Mar-2025 07:41 IST',
    detail: 'NSIC Single Point Registration Scheme endpoint returned stale cache for 2 hrs 15 min; affects EMD exemption checks for small-scale bidders only. Retry scheduled.',
  },
  {
    id: 'GEM-INC-2025-0139',
    title: 'DigiLocker hash mismatch flagged for BID-882-049',
    severity: 'critical',
    time: '03-Mar-2025 22:18 IST',
    detail: 'Uploaded MCA-21 certificate hash did not match the DigiLocker issuer-signed original; routed to manual vigilance review and cross-referenced against ROC struck-off notice.',
  },
  {
    id: 'GEM-INC-2025-0136',
    title: 'GeM seller directory scheduled maintenance',
    severity: 'info',
    time: '02-Mar-2025 02:00 IST',
    detail: 'Planned 45-minute maintenance window on the GeM Seller Directory API; ingestion paused and resumed automatically per runbook.',
  },
]

const SEVERITY = {
  critical: { icon: 'error', className: 'bg-rose-100 text-rose-800 border-rose-300', label: 'Critical' },
  warning: { icon: 'warning', className: 'bg-amber-100 text-amber-800 border-amber-300', label: 'Warning' },
  info: { icon: 'info', className: 'bg-blue-100 text-navy border-blue-200', label: 'Info' },
}

export default function GemIncidentLogPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'GeM Incident Log' }]} />

      <SectionCard
        eyebrow="GeM / CPPP Ingestion Layer"
        title="GeM Incident Log"
        description="Operational log of connector-level anomalies, retries and data-integrity flags raised while ingesting bids from the GeM/CPPP portal — retained for CVC audit purposes."
      >
        <div className="flex flex-col gap-2.5">
          {INCIDENTS.map((inc) => {
            const s = SEVERITY[inc.severity]
            return (
              <div key={inc.id} className="border border-slate-200 rounded p-3 flex items-start gap-3">
                <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border ${s.className}`}>
                  <Icon name={s.icon} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] text-slate-500">{inc.id}</span>
                    <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${s.className}`}>
                      {s.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 ml-auto">{inc.time}</span>
                  </div>
                  <div className="font-bold text-navy text-[13px] mt-0.5">{inc.title}</div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{inc.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </SectionCard>
    </>
  )
}
