import { Link } from 'react-router-dom'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import SectionCard from '../components/common/SectionCard.jsx'
import Icon from '../components/common/Icon.jsx'
import { TENDER } from '../data/constants.js'

const NOTICES = [
  {
    ref: TENDER.ref,
    title: TENDER.title,
    stage: 'Stage-1 Technical Bid Evaluation — Active',
    published: '18-Jan-2025',
    closing: '02-Mar-2025',
    budget: TENDER.approvedBudget,
    status: 'active',
    to: '/evaluation-matrix',
  },
  {
    ref: 'CPCL/ENGG/2024/NIT-861',
    title: 'Manali Refinery — Cooling Tower Revamp Package II',
    stage: 'Stage-2 Financial Bid Opening — Completed',
    published: '02-Sep-2024',
    closing: '30-Sep-2024',
    budget: '₹86.40 Cr',
    status: 'closed',
  },
  {
    ref: 'CPCL/ENGG/2024/NIT-847',
    title: 'CDU-II Instrumentation Upgrade — DCS Migration',
    stage: 'Contract Awarded',
    published: '11-Jun-2024',
    closing: '15-Jul-2024',
    budget: '₹41.20 Cr',
    status: 'closed',
  },
  {
    ref: 'CPCL/ENGG/2025/NIT-890',
    title: 'Marine Terminal Pipeline Corrosion Audit (SIA)',
    stage: 'Draft NIT — Pending Vigilance Clearance',
    published: '—',
    closing: 'To be notified',
    budget: '₹12.75 Cr',
    status: 'draft',
  },
]

const STATUS_STYLE = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  closed: { label: 'Closed', className: 'bg-slate-100 text-slate-600 border-slate-300' },
  draft: { label: 'Draft', className: 'bg-amber-100 text-amber-800 border-amber-300' },
}

export default function TenderNoticesPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Tender NIT Notices' }]} />

      <SectionCard
        eyebrow="Central e-Procurement Portal (CPPP) Mirror"
        title="Tender NIT Notices"
        description="All Notice Inviting Tender (NIT) publications issued by CPCL Manali Refinery, mirrored from the GeM/CPPP portal for statutory transparency."
      >
        <div className="flex flex-col divide-y divide-slate-200 border border-slate-200 rounded overflow-hidden">
          {NOTICES.map((n) => {
            const style = STATUS_STYLE[n.status]
            const Wrapper = n.to ? Link : 'div'
            return (
              <Wrapper
                key={n.ref}
                {...(n.to ? { to: n.to } : {})}
                className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 ${
                  n.to ? 'hover:bg-[#f8fafc] transition-colors' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded bg-navy text-saffron flex items-center justify-center shrink-0">
                    <Icon name="assignment" size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] text-slate-500">{n.ref}</span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${style.className}`}>
                        {style.label}
                      </span>
                    </div>
                    <div className="font-bold text-navy text-[13px] leading-tight mt-0.5">{n.title}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">{n.stage}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-mono text-slate-600 shrink-0 pl-12 md:pl-0">
                  <div className="flex flex-col">
                    <span className="text-slate-400">Published</span>
                    <span>{n.published}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400">Closing</span>
                    <span>{n.closing}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400">Budget</span>
                    <span className="font-bold text-navy">{n.budget}</span>
                  </div>
                  {n.to && <Icon name="arrow_forward" size={16} className="text-navy" />}
                </div>
              </Wrapper>
            )
          })}
        </div>
      </SectionCard>
    </>
  )
}
