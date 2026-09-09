import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Icon from '../components/common/Icon.jsx'
import AshokaEmblem from '../components/common/AshokaEmblem.jsx'
import { useAuth, ROLE } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { ApiError } from '../api/client.js'
import { ORG, TENDER } from '../data/constants.js'

const TABS = [
  { role: ROLE.OFFICER, label: 'Procurement Officer', icon: 'badge' },
  { role: ROLE.BIDDER, label: 'Registered Bidder', icon: 'storefront' },
]

function FieldLabel({ children }) {
  return <span className="text-[11px] font-semibold text-navy uppercase tracking-wide">{children}</span>
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="h-10 px-3 text-[12.5px] bg-white border border-slate-300 rounded focus:border-navy focus:ring-0 w-full"
    />
  )
}

// Shared login/register form for both roles — the backend distinguishes them
// via `role` on register, and via the returned user's role on login.
function AuthForm({ role, onSuccess }) {
  const { login, register } = useAuth()
  const { notify } = useToast()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [submitting, setSubmitting] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [legalName, setLegalName] = useState('')
  const [gstin, setGstin] = useState('')
  const [gemSellerId, setGemSellerId] = useState('')
  const [phone, setPhone] = useState('')

  const isBidder = role === ROLE.BIDDER
  const isRegister = mode === 'register'

  const resetExtras = () => {
    setName('')
    setPassword('')
    setLegalName('')
    setGstin('')
    setGemSellerId('')
    setPhone('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password || (isRegister && !name)) {
      notify('Please complete all required fields', { tone: 'warning', detail: 'Email and password are required to continue.' })
      return
    }
    if (isRegister && isBidder && !legalName) {
      notify('Bidder / Company Name is required', { tone: 'warning', detail: 'This is used to create your linked bidder company profile.' })
      return
    }
    setSubmitting(true)
    try {
      const profile = isRegister
        ? await register({
            name,
            email,
            password,
            role: isBidder ? 'BIDDER' : 'PROCUREMENT_OFFICER',
            ...(isBidder ? { legalName, gstin, gemSellerId, phone } : {}),
          })
        : await login(email, password)

      if ((profile.role === ROLE.BIDDER) !== isBidder) {
        notify('Signed in — different account type', {
          tone: 'warning',
          detail: `This login is registered as a ${profile.role === ROLE.BIDDER ? 'Bidder' : 'Officer'} account, not ${isBidder ? 'Bidder' : 'Officer'}. Continuing with that account.`,
        })
      }
      onSuccess(profile)
    } catch (err) {
      notify(isRegister ? 'Registration failed' : 'Sign-in failed', {
        tone: 'warning',
        detail: err instanceof ApiError ? err.message : 'Could not reach the backend. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      {isRegister && (
        <label className="flex flex-col gap-1">
          <FieldLabel>{isBidder ? 'Contact Person Name' : 'Full Name'}</FieldLabel>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="As per official ID" autoComplete="name" />
        </label>
      )}

      {isRegister && isBidder && (
        <>
          <label className="flex flex-col gap-1">
            <FieldLabel>Bidder / Company Name</FieldLabel>
            <TextInput value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="As registered on GeM" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <FieldLabel>GSTIN (optional)</FieldLabel>
              <TextInput value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="33AAAAA0000A1Z5" />
            </label>
            <label className="flex flex-col gap-1">
              <FieldLabel>GeM Seller ID (optional)</FieldLabel>
              <TextInput value={gemSellerId} onChange={(e) => setGemSellerId(e.target.value)} placeholder="GEM/SEL/0000000" />
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <FieldLabel>Mobile Number (optional)</FieldLabel>
            <TextInput
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile"
              inputMode="numeric"
            />
          </label>
        </>
      )}

      <label className="flex flex-col gap-1">
        <FieldLabel>{isBidder ? 'Registered Email' : 'Official Email'}</FieldLabel>
        <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="username" />
      </label>
      <label className="flex flex-col gap-1">
        <FieldLabel>Password</FieldLabel>
        <TextInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 h-11 bg-navy hover:bg-navy-700 disabled:opacity-60 text-white rounded font-bold text-[13px] flex items-center justify-center gap-2 shadow-sm"
      >
        <Icon name={submitting ? 'progress_activity' : isRegister ? 'person_add' : 'login'} size={18} className={`text-saffron ${submitting ? 'animate-spin' : ''}`} />
        {submitting ? (isRegister ? 'Creating account…' : 'Signing in…') : isRegister ? 'Register & Sign In' : 'Sign In'}
      </button>

      <button
        type="button"
        onClick={() => {
          setMode(isRegister ? 'login' : 'register')
          resetExtras()
        }}
        className="text-[11px] font-semibold text-navy hover:underline self-center"
      >
        {isRegister
          ? 'Already have an account? Sign in'
          : isBidder
            ? 'New bidder? Register a company profile'
            : 'New officer account? Register here'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  const [activeRole, setActiveRole] = useState(ROLE.OFFICER)
  const { notify } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSuccess = (profile) => {
    notify(`Welcome, ${profile.name}`, {
      tone: 'success',
      detail: `Signed in as ${profile.orgLabel} • Session started ${new Date().toLocaleTimeString('en-IN')} IST`,
    })
    const fallback = profile.role === ROLE.OFFICER ? '/' : '/documents'
    navigate(location.state?.from || fallback, { replace: true })
  }

  return (
    <div className="bg-[#f0f4f9] text-[#0d1c2e] antialiased min-h-screen flex flex-col text-[13px] font-sans">
      <div className="w-full h-1 flex shrink-0">
        <div className="h-full w-1/3 bg-saffron" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-indiagreen" />
      </div>

      <header className="bg-white border-b-2 border-navy shadow-sm">
        <div className="max-w-[1100px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <AshokaEmblem className="pr-3 border-r border-slate-300" />
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-navy text-saffron font-bold flex flex-col items-center justify-center border-2 border-saffron shrink-0">
                <span className="text-[13px] leading-tight font-extrabold tracking-tight">CPCL</span>
                <span className="text-[7px] text-white tracking-widest leading-none">IOCL-GRP</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[12px] font-bold text-[#992200]">{ORG.nameHi}</span>
                <span className="text-[15px] font-bold text-navy">{ORG.nameEn}</span>
                <span className="text-[10px] text-slate-500 font-mono">TENDERVERIFY AI ENGINE — SECURE SIGN-IN</span>
              </div>
            </div>
          </div>
          <Link to="/" className="text-[11px] font-mono text-navy hover:underline hidden sm:flex items-center gap-1">
            <Icon name="arrow_back" size={14} /> Back to Portal
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[460px] flex flex-col gap-4">
          <div className="text-center">
            <span className="bg-navy text-saffron font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              NIT Ref: {TENDER.ref}
            </span>
            <h1 className="text-[19px] font-bold text-navy mt-2">Statutory Compliance Console — Sign In</h1>
            <p className="text-slate-600 text-[12px] mt-1">
              Access is role-based. Choose your account type to continue.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
            <div className="grid grid-cols-2 border-b border-slate-200">
              {TABS.map((t) => (
                <button
                  key={t.role}
                  onClick={() => setActiveRole(t.role)}
                  className={`flex items-center justify-center gap-1.5 py-3 text-[12px] font-bold transition-colors ${
                    activeRole === t.role ? 'bg-navy text-white' : 'bg-[#f8fafc] text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon name={t.icon} size={16} className={activeRole === t.role ? 'text-saffron' : 'text-slate-400'} />
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-5" key={activeRole}>
              <AuthForm role={activeRole} onSuccess={handleSuccess} />
            </div>
          </div>

          <div className="bg-[#fff3cd] border border-[#ffe69c] text-[#664d03] rounded p-3 flex items-start gap-2 text-[11px] leading-relaxed">
            <Icon name="gpp_maybe" size={16} className="shrink-0 mt-0.5 text-[#856404]" />
            <p>
              This is a secure Government of India e-Procurement portal. Unauthorized access, attempted tampering, or
              misuse of credentials is an offence under the Information Technology Act, 2000 and will be reported to
              the CVC Vigilance Directorate.
            </p>
          </div>

          <p className="text-center text-[10px] text-slate-400 font-mono">
            Live backend authentication — accounts are created via Register and persisted in MongoDB.
          </p>
        </div>
      </main>

      <footer className="bg-navy text-navy-100 text-[10px] font-mono text-center py-3 border-t-4 border-saffron">
        © 2025 {ORG.nameEn}. Portal Powered by NIC e-Procurement Engine &amp; CPCL CVC-AI Verification Framework.
      </footer>
    </div>
  )
}
