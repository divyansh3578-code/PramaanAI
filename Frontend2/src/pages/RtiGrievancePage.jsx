import { useState } from 'react'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import SectionCard from '../components/common/SectionCard.jsx'
import Icon from '../components/common/Icon.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { OFFICER } from '../data/constants.js'
import { api, ApiError } from '../api/client.js'

const CATEGORIES = ['RTI Application (RTI Act, 2005)', 'Vigilance Grievance', 'Tender Clarification Query', 'Portal Technical Issue']
const CATEGORY_TYPE = (c) => (c.startsWith('RTI') ? 'RTI' : 'GRIEVANCE')

export default function RtiGrievancePage() {
  const { notify } = useToast()
  const { user } = useAuth()
  const [form, setForm] = useState({ category: CATEGORIES[0], name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      notify('Sign in required', { tone: 'warning', detail: 'Please sign in before filing an RTI application or grievance so it can be attributed to your account.' })
      return
    }
    setSubmitting(true)
    try {
      const { grievance } = await api.createGrievance({
        type: CATEGORY_TYPE(form.category),
        subject: form.category,
        description: `Filed by ${form.name} (${form.email}). ${form.message}`,
      })
      notify(`${grievance.type === 'RTI' ? 'RTI application' : 'Grievance'} registered`, {
        tone: 'success',
        detail: `Reference ${grievance.referenceNo} • Acknowledgement will be sent to ${form.email || 'your registered email'} within 48 hours.`,
      })
      setForm({ category: CATEGORIES[0], name: '', email: '', message: '' })
    } catch (err) {
      notify('Submission failed', { tone: 'warning', detail: err instanceof ApiError ? err.message : 'Could not reach the backend. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'RTI & Grievance' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <SectionCard
          className="lg:col-span-3"
          eyebrow="Right to Information Act, 2005"
          title="RTI & Vigilance Grievance Portal"
          description="Submit an RTI application, raise a procurement vigilance grievance, or request clarification on any NIT-882 statutory eligibility decision."
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-[12px] font-semibold text-navy">
              Category
              <select
                value={form.category}
                onChange={update('category')}
                className="h-9 px-2 text-[12px] bg-white border border-slate-300 rounded focus:border-navy focus:ring-0"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-[12px] font-semibold text-navy">
                Full Name
                <input
                  required
                  value={form.name}
                  onChange={update('name')}
                  className="h-9 px-2.5 text-[12px] bg-white border border-slate-300 rounded focus:border-navy focus:ring-0"
                  placeholder="As per official ID"
                />
              </label>
              <label className="flex flex-col gap-1 text-[12px] font-semibold text-navy">
                Email Address
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  className="h-9 px-2.5 text-[12px] bg-white border border-slate-300 rounded focus:border-navy focus:ring-0"
                  placeholder="you@example.com"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-[12px] font-semibold text-navy">
              Details
              <textarea
                required
                value={form.message}
                onChange={update('message')}
                rows={5}
                className="px-2.5 py-2 text-[12px] bg-white border border-slate-300 rounded focus:border-navy focus:ring-0 resize-y"
                placeholder="Describe your RTI request or grievance, including the relevant NIT / bidder reference if applicable."
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="self-start flex items-center gap-1.5 px-4 py-2 bg-navy hover:bg-navy-700 disabled:opacity-60 text-white rounded font-medium text-[12px] shadow-sm"
            >
              <Icon name={submitting ? 'progress_activity' : 'send'} size={16} className={`text-saffron ${submitting ? 'animate-spin' : ''}`} />
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        </SectionCard>

        <SectionCard className="lg:col-span-2" title="Statutory Contacts">
          <div className="flex flex-col gap-3 text-[12px]">
            <div className="border border-slate-200 rounded p-3">
              <div className="font-bold text-navy flex items-center gap-1.5">
                <Icon name="gavel" size={16} className="text-navy" /> Central Public Information Officer
              </div>
              <p className="text-slate-600 mt-1">{OFFICER.name} — {OFFICER.role}</p>
              <p className="text-slate-500 font-mono text-[11px] mt-0.5">cpio-vigilance@cpcl.co.in</p>
            </div>
            <div className="border border-slate-200 rounded p-3">
              <div className="font-bold text-navy flex items-center gap-1.5">
                <Icon name="policy" size={16} className="text-navy" /> Whistle Blower Mechanism
              </div>
              <p className="text-slate-600 mt-1">
                Vigilance-sensitive disclosures may be routed directly and confidentially to the CVC Vigilance Directorate.
              </p>
              <p className="text-slate-500 font-mono text-[11px] mt-0.5">vigilance@cpcl.co.in</p>
            </div>
            <div className="border border-slate-200 rounded p-3">
              <div className="font-bold text-navy flex items-center gap-1.5">
                <Icon name="schedule" size={16} className="text-navy" /> Statutory Response Timelines
              </div>
              <p className="text-slate-600 mt-1">RTI applications: 30 days. Vigilance grievances: acknowledged within 48 hours.</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </>
  )
}
