import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import SectionCard from '../components/common/SectionCard.jsx'
import Icon from '../components/common/Icon.jsx'
import CountUp from '../components/animations/CountUp.jsx'
import AnimatedCard from '../components/animations/AnimatedCard.jsx'
import { staggerContainer, fadeUp, iconHover } from '../animations/variants.js'
import { STATUS_COUNTS } from '../data/bidders.js'
import { NAV_ITEMS, TENDER } from '../data/constants.js'
import { useAuth, ROLE } from '../context/AuthContext.jsx'

const KPIS = [
  { label: 'Active Statutory Cohort', value: STATUS_COUNTS.total, suffix: 'bids', icon: 'fact_check', tone: 'text-navy', accent: 'bg-navy' },
  { label: 'Statutory Eligible', value: STATUS_COUNTS.eligible, suffix: 'bids', icon: 'verified', tone: 'text-emerald-700', accent: 'bg-emerald-600' },
  { label: 'Manual Scrutiny', value: STATUS_COUNTS.scrutiny, suffix: 'bids', icon: 'pending', tone: 'text-amber-700', accent: 'bg-amber-500' },
  { label: 'High Risk / Disqualified', value: STATUS_COUNTS.risk, suffix: 'bids', icon: 'gavel', tone: 'text-rose-700', accent: 'bg-rose-600' },
]

const ALL_QUICK_LINKS = NAV_ITEMS.filter((n) => n.to !== '/')

export default function HomePage() {
  const { user } = useAuth()
  const isOfficer = user?.role === ROLE.OFFICER
  const isBidder = user?.role === ROLE.BIDDER

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-8">
      <motion.div variants={fadeUp}><Breadcrumb items={[{ label: 'Home' }]} /></motion.div>

      {!user && (
        <motion.div variants={fadeUp} className="relative overflow-hidden bg-white border border-slate-200 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-saffron" />
          <div className="flex items-center gap-2.5 pl-2"><Icon name="account_circle" size={22} className="text-navy" /><span className="text-[12.5px] text-slate-700">Sign in as a <strong className="text-navy">Procurement Officer</strong> or <strong className="text-navy">Registered Bidder</strong> to access role-specific tools.</span></div>
          <Link to="/login" className="flex items-center gap-1.5 px-3 py-1.5 bg-navy hover:bg-navy-700 text-white rounded font-medium text-[12px] shadow-sm shrink-0"><Icon name="login" size={16} className="text-saffron" /> Sign In</Link>
        </motion.div>
      )}

      <motion.div variants={fadeUp} className="relative overflow-hidden rounded-xl bg-navy text-white p-6 md:p-8 shadow-lg shadow-navy/10">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_90%_10%,#FF9933,transparent_30%),radial-gradient(circle_at_10%_100%,#0F766E,transparent_28%)]" />
        <div className="relative max-w-4xl"><span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-widest text-saffron"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> GIGW 3.0 Autonomous Compliance</span><h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-balance">TenderVerify AI <span className="text-saffron">—</span> Procurement Intelligence &amp; Compliance Console</h2><p className="mt-4 max-w-3xl text-sm leading-6 text-navy-100">A single console reconciling every bidder declaration against live GSTN, MCA-21, Udyam, EPFO/ESIC, GeM and allied statutory registries — turning a manual, document-by-document eligibility check into a deterministic, auditable clearance in minutes.</p><div className="mt-6 flex flex-wrap gap-3"><Link to={isBidder ? '/documents' : isOfficer ? '/evaluation-matrix' : '/login'} className="flex items-center gap-1.5 px-4 py-2.5 bg-saffron hover:bg-orange-300 text-navy rounded-md font-bold text-[12px] shadow-sm"><Icon name={isBidder ? 'folder_open' : 'fact_check'} size={16} /> {isBidder ? 'Submit Your Bid Documents' : 'Open NIT-882 Evaluation Matrix'} <Icon name="arrow_forward" size={15} /></Link><Link to="/tender-notices" className="flex items-center gap-1.5 px-4 py-2.5 border border-white/25 hover:bg-white/10 text-white rounded-md font-semibold text-[12px]">View tender notices</Link></div></div>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {KPIS.map((kpi, index) => <AnimatedCard key={kpi.label} delay={index * 0.05} className="relative overflow-hidden bg-white border border-slate-200 rounded-lg p-4 shadow-sm"><div className={`absolute left-0 top-0 bottom-0 w-1 ${kpi.accent}`} /><div className="flex items-center justify-between pl-1"><span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">{kpi.label}</span><motion.span whileHover={iconHover}><Icon name={kpi.icon} size={18} className={kpi.tone} /></motion.span></div><div className={`pl-1 mt-2 font-mono font-bold text-3xl ${kpi.tone}`}><CountUp value={kpi.value} /> <span className="text-[11px] text-slate-400 font-normal">{kpi.suffix}</span></div><div className="mt-2 h-1 rounded-full bg-slate-100 overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: `${Math.min(100, Math.max(18, kpi.value / STATUS_COUNTS.total * 100))}%` }} viewport={{ once: true }} transition={{ duration: .8, delay: .2 }} className={`h-full ${kpi.accent}`} /></div></AnimatedCard>)}
      </motion.div>

      <SectionCard title="Currently Active Tender" description={`Stage-1 statutory eligibility evaluation for ${TENDER.title}.`}><div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#f0f4f9] border border-slate-300 rounded-lg p-4"><div><div className="font-mono text-[11px] text-slate-500">{TENDER.ref}</div><div className="font-bold text-navy text-[15px]">{TENDER.title}</div><div className="text-[11px] text-slate-600 mt-0.5">NIC Node {TENDER.nicNode} • Approved Budget {TENDER.approvedBudget} • {TENDER.totalBids} bids under evaluation</div></div><Link to={isBidder ? '/documents' : '/evaluation-matrix'} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-navy rounded font-semibold text-[12px] shadow-sm shrink-0">{isBidder ? 'Submit Documents' : 'View Matrix'} <Icon name="arrow_forward" size={14} /></Link></div></SectionCard>

      <SectionCard title="Portal Sections" description="Navigate the audit-ready workspace by workflow."><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{ALL_QUICK_LINKS.filter((item) => !item.roles || (user && item.roles.includes(user.role))).map((item, index) => <motion.div key={item.to} variants={fadeUp} transition={{ delay: index * .04 }}><Link to={item.to} className="group flex items-start gap-3 border border-slate-200 rounded-lg p-3 hover:border-teal hover:bg-[#f8fafc] hover:shadow-md"><div className="w-9 h-9 rounded-md bg-navy text-saffron flex items-center justify-center shrink-0 group-hover:bg-teal"><Icon name={item.icon} size={18} /></div><div><div className="font-bold text-navy text-[12.5px] leading-tight">{item.label}</div><div className="text-[11px] text-slate-500 mt-0.5">Open section <Icon name="arrow_forward" size={12} className="inline opacity-0 group-hover:opacity-100 transition-opacity" /></div></div></Link></motion.div>)}</div></SectionCard>
    </motion.div>
  )
}
