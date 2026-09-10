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
  { label: 'Active statutory cohort', value: STATUS_COUNTS.total, suffix: 'bids', icon: 'fact_check', tone: 'text-navy', accent: 'bg-navy' },
  { label: 'Statutory eligible', value: STATUS_COUNTS.eligible, suffix: 'bids', icon: 'verified', tone: 'text-emerald-700', accent: 'bg-emerald-600' },
  { label: 'Manual scrutiny', value: STATUS_COUNTS.scrutiny, suffix: 'bids', icon: 'pending', tone: 'text-amber-700', accent: 'bg-amber-500' },
  { label: 'High risk / disqualified', value: STATUS_COUNTS.risk, suffix: 'bids', icon: 'gavel', tone: 'text-rose-700', accent: 'bg-rose-600' },
]

const PIPELINE = [
  ['Tender intake', 'file_upload', 'DOCUMENT'],
  ['OCR extraction', 'document_scanner', 'OCR'],
  ['Requirement rules', 'rule', 'RULES'],
  ['Registry checks', 'account_balance', 'REGISTRY'],
  ['Cross-document', 'hub', 'MATCH'],
  ['Risk & evidence', 'analytics', 'RISK'],
  ['Audit decision', 'fact_check', 'AUDIT'],
]

const ACTIVITY = [
  ['verified', 'GST verified — Bidder #1024', '12 sec ago'],
  ['link', 'Udyam matched — Bidder #1024', '28 sec ago'],
  ['warning', 'Turnover mismatch routed to review', '1 min ago'],
  ['lock', 'Audit hash generated for NIT-882', '2 min ago'],
]

const ALL_QUICK_LINKS = NAV_ITEMS.filter((n) => n.to !== '/')

export default function HomePage() {
  const { user } = useAuth()
  const isOfficer = user?.role === ROLE.OFFICER
  const isBidder = user?.role === ROLE.BIDDER
  const workspacePath = isBidder ? '/documents' : isOfficer ? '/evaluation-matrix' : '/login'

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-6 sm:gap-8">
      <motion.div variants={fadeUp}><Breadcrumb items={[{ label: 'Home' }]} /></motion.div>

      {!user && (
        <motion.div variants={fadeUp} className="relative overflow-hidden bg-white border border-slate-200 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-saffron" />
          <div className="flex items-start gap-2.5 pl-2"><Icon name="account_circle" size={22} className="text-navy shrink-0" /><span className="text-[12.5px] text-slate-700">Sign in as a <strong className="text-navy">Procurement Officer</strong> or <strong className="text-navy">Registered Bidder</strong> to access role-specific tools.</span></div>
          <Link to="/login" className="flex items-center gap-1.5 px-3 py-1.5 bg-navy hover:bg-navy-700 text-white rounded font-medium text-[12px] shadow-sm shrink-0"><Icon name="login" size={16} className="text-saffron" /> Sign in</Link>
        </motion.div>
      )}

      <motion.section variants={fadeUp} className="hero-console command-hero relative overflow-hidden rounded-xl bg-navy text-white p-5 sm:p-7 lg:p-10 shadow-lg shadow-navy/15">
        <div className="hero-grid absolute inset-0 opacity-30" />
        <div className="hero-scan absolute inset-x-0 top-0 h-px bg-saffron/70" />
        <motion.div animate={{ rotate: [0, 3, 0], scale: [1, 1.04, 1] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} className="absolute -right-24 -top-28 h-72 w-72 rounded-full border border-saffron/20 bg-saffron/10 blur-sm" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_90%_10%,#FF9933,transparent_30%),radial-gradient(circle_at_10%_100%,#0F766E,transparent_28%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-widest text-saffron"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> AI verification command center</span>
            <h2 className="mt-4 max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-balance">From tender intake to an <span className="text-saffron">audit-ready</span> decision.</h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-navy-100">PRAMAAN reconciles bidder declarations across statutory sources, identifies risk, and assembles evidence for an officer-led procurement decision.</p>
            <div className="mt-6 flex flex-col xs:flex-row flex-wrap gap-3"><Link to={workspacePath} className="magnetic-button flex items-center justify-center gap-1.5 px-4 py-2.5 bg-saffron hover:bg-orange-300 text-navy rounded-md font-bold text-[12px] shadow-sm"><Icon name={isBidder ? 'folder_open' : 'fact_check'} size={16} /> {isBidder ? 'Submit bid documents' : 'Open evaluation matrix'} <Icon name="arrow_forward" size={15} /></Link><Link to="/tender-notices" className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-white/25 hover:bg-white/10 text-white rounded-md font-semibold text-[12px]">View tender notices</Link></div>
          </div>
          <div className="command-orbit rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[10px] font-mono text-navy-100"><span>LIVE CLEARANCE</span><span className="text-emerald-300">● ONLINE</span></div>
            <div className="mt-5 flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} className="relative flex h-32 w-32 items-center justify-center rounded-full border border-dashed border-saffron/50"><div className="absolute inset-2 rounded-full border border-white/10" /><div className="absolute inset-7 rounded-full border border-emerald-300/30" /><Icon name="verified" size={42} className="text-saffron" /></motion.div></div>
            <div className="mt-4 text-center"><div className="font-mono text-xl font-bold text-white">99.8%</div><div className="text-[10px] text-navy-100">registry match confidence</div></div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={fadeUp} className="pipeline-shell rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm"><div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2"><div><span className="eyebrow">PROCESS TELEMETRY</span><h3 className="mt-1 text-lg font-bold text-navy">Verification pipeline</h3></div><span className="status-live"><span /> Sandbox integrations active</span></div><div className="pipeline-track mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">{PIPELINE.map(([label, icon, code], index) => <motion.div key={label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }} className="pipeline-step"><div className={`pipeline-node ${index < 5 ? 'is-complete' : index === 5 ? 'is-active' : ''}`}><Icon name={icon} size={18} /></div><div className="mt-2 text-[11px] font-bold text-navy">{label}</div><div className="mt-0.5 font-mono text-[9px] text-slate-400">{code}</div></motion.div>)}</div></motion.section>

      <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} className="grid grid-cols-2 lg:grid-cols-4 gap-3">{KPIS.map((kpi, index) => <AnimatedCard key={kpi.label} delay={index * 0.05} className="relative overflow-hidden bg-white border border-slate-200 rounded-lg p-4 shadow-sm"><div className={`absolute left-0 top-0 bottom-0 w-1 ${kpi.accent}`} /><div className="flex items-center justify-between pl-1 gap-2"><span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">{kpi.label}</span><motion.span whileHover={iconHover}><Icon name={kpi.icon} size={18} className={kpi.tone} /></motion.span></div><div className={`pl-1 mt-2 font-mono font-bold text-2xl sm:text-3xl ${kpi.tone}`}><CountUp value={kpi.value} /> <span className="text-[11px] text-slate-400 font-normal">{kpi.suffix}</span></div><div className="mt-2 h-1 rounded-full bg-slate-100 overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: `${Math.min(100, Math.max(18, kpi.value / STATUS_COUNTS.total * 100))}%` }} viewport={{ once: true }} transition={{ duration: .8, delay: .2 }} className={`h-full ${kpi.accent}`} /></div></AnimatedCard>)}</motion.div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,.55fr)]">
        <SectionCard title="Currently active tender" description={`Stage-1 statutory eligibility evaluation for ${TENDER.title}.`}><div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#f0f4f9] border border-slate-300 rounded-lg p-4"><div><div className="font-mono text-[11px] text-slate-500">{TENDER.ref}</div><div className="font-bold text-navy text-[15px]">{TENDER.title}</div><div className="text-[11px] text-slate-600 mt-0.5">NIC Node {TENDER.nicNode} · Approved Budget {TENDER.approvedBudget} · {TENDER.totalBids} bids under evaluation</div></div><Link to={workspacePath} className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-navy rounded font-semibold text-[12px] shadow-sm shrink-0">{isBidder ? 'Submit documents' : 'View matrix'} <Icon name="arrow_forward" size={14} /></Link></div></SectionCard>
        <SectionCard title="Live activity" description="Recent verification events from the command center."><div className="space-y-3">{ACTIVITY.map(([icon, text, time], index) => <motion.div key={text} initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className="flex items-start gap-2.5"><div className={`activity-icon ${icon === 'warning' ? 'is-warning' : ''}`}><Icon name={icon} size={14} /></div><div className="min-w-0"><div className="text-[11px] font-semibold text-navy leading-tight">{text}</div><div className="mt-0.5 font-mono text-[9px] text-slate-400">{time}</div></div></motion.div>)}</div></SectionCard>
      </div>

      <SectionCard title="Portal sections" description="Navigate the audit-ready workspace by workflow."><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{ALL_QUICK_LINKS.filter((item) => !item.roles || (user && item.roles.includes(user.role))).map((item, index) => <motion.div key={item.to} variants={fadeUp} transition={{ delay: index * .04 }}><Link to={item.to} className="group flex items-start gap-3 border border-slate-200 rounded-lg p-3 hover:border-teal hover:bg-[#f8fafc] hover:shadow-md"><div className="w-9 h-9 rounded-md bg-navy text-saffron flex items-center justify-center shrink-0 group-hover:bg-teal"><Icon name={item.icon} size={18} /></div><div><div className="font-bold text-navy text-[12.5px] leading-tight">{item.label}</div><div className="text-[11px] text-slate-500 mt-0.5">Open section <Icon name="arrow_forward" size={12} className="inline opacity-0 group-hover:opacity-100 transition-opacity" /></div></div></Link></motion.div>)}</div></SectionCard>
    </motion.div>
  )
}
        
