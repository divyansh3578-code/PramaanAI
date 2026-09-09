import Icon from '../common/Icon.jsx'
import VerificationTopology from './VerificationTopology.jsx'
import { TENDER } from '../../data/constants.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function MandateHeader() {
  const { notify } = useToast()

  return (
    <div className="bg-white rounded border border-slate-200 shadow-sm p-6 flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-navy text-saffron font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              GIGW 3.0 Autonomous Compliance
            </span>
            <span className="text-slate-500 font-medium text-[11px]">
              NIT Ref: {TENDER.ref} • {TENDER.title}
            </span>
          </div>
          <h2 className="text-[18px] font-bold text-navy mt-1">
            Automated Statutory Eligibility &amp; Vigilance Risk Assessment Matrix
          </h2>
          <p className="text-slate-600 text-[12px] max-w-4xl mt-0.5">
            Real-time deterministic verification reconciling bidder declarations against GSTN, MCA-21, Udyam MSME,
            and EPFO/ESIC repositories under CVC Guidelines &amp; MoP&amp;NG Public Procurement (Preference to Make
            in India) Order.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() =>
              notify('Master NIC Dossier export queued', {
                tone: 'info',
                detail: 'Generating 100-row .xlsx — will download to your browser downloads folder.',
              })
            }
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f8fafc] border border-slate-300 hover:bg-slate-100 text-slate-800 rounded font-medium text-[12px] shadow-sm"
          >
            <Icon name="file_download" size={16} className="text-navy" />
            <span>Master NIC Dossier (.xlsx)</span>
          </button>
          <button
            onClick={() =>
              notify('Stage-1 Matrix frozen & DSC-signed', {
                tone: 'success',
                detail: `Class-3 e-Token seal applied • ${new Date().toLocaleTimeString('en-IN')} IST`,
              })
            }
            className="flex items-center gap-1.5 px-3 py-1.5 bg-navy hover:bg-navy-700 text-white rounded font-medium text-[12px] shadow-sm"
          >
            <Icon name="verified" size={16} className="text-saffron" />
            <span>Freeze Stage-1 Matrix (DSC Sign)</span>
          </button>
        </div>
      </div>

      <VerificationTopology />
    </div>
  )
}
