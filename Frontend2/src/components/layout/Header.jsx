import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Icon from '../common/Icon.jsx'
import { useAuth, ROLE } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const HONORIFICS = new Set(['Shri', 'Smt', 'Dr', 'Er', 'Mr', 'Mrs', 'Ms'])

function initials(name) {
  const words = name.replace(/\./g, '').split(' ').filter((w) => w && !HONORIFICS.has(w))
  return words.slice(0, 2).map((w) => w[0].toUpperCase()).join('') || 'U'
}

// PRAMAAN mark — a verified-shield motif (navy shield, saffron check),
// standing for "proof" / verified compliance. Swap for the real logo asset
// (e.g. import PramaanLogo from '../../assets/pramaan-logo.svg') when ready.
function PramaanLogo({ className = '' }) {
  return (
    <svg viewBox="0 0 48 48" width="42" height="42" className={className} aria-label="PRAMAAN logo">
      <path d="M24 2 L44 10 V22 C44 34 36 43 24 46 C12 43 4 34 4 22 V10 Z" fill="#0a2540" />
      <path d="M14 24 L21 31 L34 16" fill="none" stroke="#FF9933" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Header() {
  const { user, logout } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()

  const handleLogout = () => {
    notify('Signed out', { tone: 'info', detail: 'Session closed. Sign in again to access role-specific sections.' })
    logout()
    navigate('/login')
  }

  return (
    <header className="site-header relative overflow-hidden bg-white border-b-2 border-navy shadow-sm">
      <div className="header-sheen absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-saffron/10 to-transparent pointer-events-none" />
      <div className="relative max-w-[1720px] mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left branding: PRAMAAN mark + title (CPCL kept minimal, below tagline) */}
        <div className="flex items-center gap-3">
          <motion.div initial={{ opacity: 0, scale: .8, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}><PramaanLogo /></motion.div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-extrabold text-navy tracking-tight leading-tight">PRAMAAN</h1>
              <span className="text-[9px] font-mono bg-navy text-white px-1.5 py-0.5 rounded tracking-wide">AI BID VERIFICATION ENGINE</span>
            </div>
            <span className="text-[11px] text-slate-600 font-medium leading-none mt-1">Compliance &amp; Integrity Platform for GeM Procurement</span>
            <span className="text-[9px] text-slate-400 font-mono mt-1">Deployed for CPCL &middot; GeM Tier-1 Ingestion Node</span>
          </div>
        </div>

        {/* Right seals + officer identity */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden lg:flex flex-col items-end text-[10px] text-slate-600 font-mono gap-0.5 border-r border-slate-200 pr-3">
            <span className="flex items-center gap-1 font-bold text-navy">
              <Icon name="verified_user" size={14} className="text-emerald-600" /> GIGW 3.0 &amp; STQC Certified
            </span>
            <span>CVC Order No: 02/2024</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-1 rounded">NIC Cloud Secured (SHA-256)</span>
          </div>

          <div className="hidden xl:flex flex-col items-center bg-[#f7f9fc] border border-slate-300 rounded p-1 text-center w-24">
            <Icon name="gavel" size={18} className="text-navy" />
            <span className="text-[8px] font-bold uppercase tracking-tight text-navy leading-none mt-0.5">CVC Vigilance</span>
            <span className="text-[7px] text-emerald-700 font-bold mt-0.5">COMPLIANCE HUB</span>
          </div>

          {user ? (
            <div className="flex items-center gap-2 bg-[#f4f7fb] border border-slate-300 p-1.5 rounded-lg shadow-sm">
              <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-[13px] border-2 border-navy shrink-0">
                {user.role === ROLE.OFFICER ? initials(user.name) : <Icon name="storefront" size={18} />}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-navy text-[12px]">{user.name}</span>
                <span className="text-[10px] text-slate-600">{user.orgLabel}</span>
                <span className="text-[9px] font-mono text-emerald-700 font-semibold flex items-center gap-0.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> {user.secondaryLabel}: {user.secondaryValue}
                </span>
              </div>
              <button onClick={handleLogout} className="ml-1 p-1 text-slate-500 hover:text-rose-700 rounded hover:bg-slate-200" title="Logout session">
                <Icon name="logout" size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-navy hover:bg-navy-700 text-white rounded-lg font-semibold text-[12px] shadow-sm"
            >
              <Icon name="login" size={16} className="text-saffron" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
