import { Link } from 'react-router-dom'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import SectionCard from '../components/common/SectionCard.jsx'
import Icon from '../components/common/Icon.jsx'
import { STATUS_COUNTS } from '../data/bidders.js'
import { NAV_ITEMS, TENDER } from '../data/constants.js'
import { useAuth, ROLE } from '../context/AuthContext.jsx'

const KPIS = [
  { label: 'Active Statutory Cohort', value: STATUS_COUNTS.total, suffix: 'bids', icon: 'fact_check', tone: 'text-navy' },
  { label: 'Statutory Eligible', value: STATUS_COUNTS.eligible, suffix: 'bids', icon: 'verified', tone: 'text-emerald-700' },
  { label: 'Manual Scrutiny', value: STATUS_COUNTS.scrutiny, suffix: 'bids', icon: 'pending', tone: 'text-amber-700' },
  { label: 'High Risk / Disqualified', value: STATUS_COUNTS.risk, suffix: 'bids', icon: 'gavel', tone: 'text-rose-700' },
]

const ALL_QUICK_LINKS = NAV_ITEMS.filter((n) => n.to !== '/')

export default function HomePage() {
  const { user } = useAuth()
  const isOfficer = user?.role === ROLE.OFFICER
  const isBidder = user?.role === ROLE.BIDDER

  return (
    <>
      <Breadcrumb items={[{ label: 'Home' }]} />

      {!user && (
        <div className="bg-white border border-slate-200 rounded shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Icon name="account_circle" size={22} className="text-navy" />
            <span className="text-[12.5px] text-slate-700">
              Sign in as a <strong className="text-navy">Procurement Officer</strong> or{' '}
              <strong className="text-navy">Registered Bidder</strong> to access role-specific tools.
            </span>
          </div>
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-navy hover:bg-navy-700 text-white rounded font-medium text-[12px] shadow-sm shrink-0"
          >
            <Icon name="login" size={16} className="text-saffron" /> Sign In
          </Link>
        </div>
      )}

      <SectionCard
        eyebrow="GIGW 3.0 Autonomous Compliance"
        title="TenderVerify AI — Procurement Intelligence & Compliance Console"
        description="A single console reconciling every bidder declaration against live GSTN, MCA-21, Udyam, EPFO/ESIC, GeM and allied statutory registries — turning a manual, document-by-document eligibility check into a deterministic, auditable clearance in minutes."
        actions={
          isBidder ? (
            <Link
              to="/documents"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-navy hover:bg-navy-700 text-white rounded font-medium text-[12px] shadow-sm"
            >
              <Icon name="folder_open" size={16} className="text-saffron" />
              Submit Your Bid Documents
            </Link>
          ) : (
            <Link
              to={isOfficer ? '/evaluation-matrix' : '/login'}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-navy hover:bg-navy-700 text-white rounded font-medium text-[12px] shadow-sm"
            >
              <Icon name="fact_check" size={16} className="text-saffron" />
              Open NIT-882 Evaluation Matrix
            </Link>
          )
        }
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {KPIS.map((kpi) => (
            <div key={kpi.label} className="border border-slate-200 rounded p-3 flex flex-col gap-1 bg-[#f8fafc]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">{kpi.label}</span>
                <Icon name={kpi.icon} size={16} className={kpi.tone} />
              </div>
              <div className={`font-mono font-bold text-[24px] ${kpi.tone}`}>
                {kpi.value}
                <span className="text-[11px] text-slate-400 font-normal ml-1">{kpi.suffix}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Currently Active Tender" description={`Stage-1 statutory eligibility evaluation for ${TENDER.title}.`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#f0f4f9] border border-slate-300 rounded p-4">
          <div>
            <div className="font-mono text-[11px] text-slate-500">{TENDER.ref}</div>
            <div className="font-bold text-navy text-[15px]">{TENDER.title}</div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              NIC Node {TENDER.nicNode} • Approved Budget {TENDER.approvedBudget} • {TENDER.totalBids} bids under evaluation
            </div>
          </div>
          <Link
            to={isBidder ? '/documents' : '/evaluation-matrix'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-navy rounded font-semibold text-[12px] shadow-sm shrink-0"
          >
            {isBidder ? 'Submit Documents' : 'View Matrix'} <Icon name="arrow_forward" size={14} />
          </Link>
        </div>
      </SectionCard>

      <SectionCard title="Portal Sections">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ALL_QUICK_LINKS.filter((item) => !item.roles || (user && item.roles.includes(user.role))).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-start gap-3 border border-slate-200 rounded p-3 hover:border-navy hover:bg-[#f8fafc] transition-colors"
            >
              <div className="w-9 h-9 rounded bg-navy text-saffron flex items-center justify-center shrink-0">
                <Icon name={item.icon} size={18} />
              </div>
              <div>
                <div className="font-bold text-navy text-[12.5px] leading-tight">{item.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Open section</div>
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>
    </>
  )
}
