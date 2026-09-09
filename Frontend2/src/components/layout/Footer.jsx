import Icon from '../common/Icon.jsx'
import { ORG } from '../../data/constants.js'

const STATUTORY_LINKS = [
  'Integrity Pact & IEM Details',
  'CVC Procurement Guidelines 2024',
  'Public Procurement (Make in India) Order',
  'Micro & Small Enterprises (MSE) Policy',
  'Whistle Blower Mechanism & Vigilance',
]

const COMPLIANCE_LINKS = [
  'Website Policies & Terms of Use',
  'Hyperlinking & Copyright Policy',
  'Security & Privacy Policy (ISO 27001)',
  'Web Information Manager: Shri R. Venkatesh',
  'Helpdesk: tenderverify-support@cpcl.co.in',
]

export default function Footer() {
  return (
    <footer className="bg-navy text-white border-t-4 border-saffron mt-8 text-[12px]">
      <div className="bg-navy-800 border-b border-navy-600 py-2 px-4">
        <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-300 font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <a className="hover:underline text-white flex items-center gap-1" href="https://india.gov.in" target="_blank" rel="noreferrer">
              <Icon name="flag" size={14} className="text-saffron" /> india.gov.in (National Portal of India)
            </a>
            <span>|</span>
            <span className="text-slate-300">Central Vigilance Commission (CVC)</span>
            <span>|</span>
            <span className="text-slate-300">Ministry of Petroleum &amp; Natural Gas</span>
            <span>|</span>
            <span className="text-slate-300">GeM (Government e-Marketplace)</span>
          </div>
          <div>
            <span className="text-teal-200">Portal Design Standard: GIGW 3.0 (STQC Audited)</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1720px] mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-[12px]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white text-navy font-bold flex items-center justify-center text-[10px]">
              CPCL
            </div>
            <span className="font-bold text-[14px]">{ORG.nameEn.replace(' (CPCL)', '')}</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            A Government of India Enterprise &amp; Group Company of IndianOil. Manali Refinery, Chennai - 600 068,
            Tamil Nadu, India.
          </p>
          <span className="font-mono text-[10px] text-saffron">CIN: {ORG.cin}</span>
        </div>

        <div className="flex flex-col gap-1.5 text-slate-300">
          <span className="font-bold text-white text-[13px] border-b border-navy-600 pb-1 uppercase">Statutory Links</span>
          {STATUTORY_LINKS.map((label) => (
            <a key={label} className="hover:text-saffron" href="#">
              {label}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-1.5 text-slate-300">
          <span className="font-bold text-white text-[13px] border-b border-navy-600 pb-1 uppercase">
            Web Compliance &amp; Helpdesk
          </span>
          {COMPLIANCE_LINKS.map((label) => (
            <a key={label} className="hover:text-saffron" href="#">
              {label}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-2 font-mono text-[11px] text-slate-300 bg-navy-800 p-3 rounded border border-navy-600">
          <span className="font-bold text-white text-[12px]">PORTAL METRICS &amp; AUDIT</span>
          <div>
            Last Reviewed &amp; Updated: <strong className="text-white">04-Mar-2025</strong>
          </div>
          <div>
            Content Owned &amp; Maintained by: <strong className="text-white">CPCL Vigilance</strong>
          </div>
          <div>
            Hosted on: <strong className="text-saffron">National Informatics Centre (NIC)</strong>
          </div>
          <div className="pt-1 border-t border-navy-600 flex items-center justify-between">
            <span>Total Portal Hits:</span>
            <span className="bg-navy text-teal-200 px-2 py-0.5 rounded font-bold">1,842,910</span>
          </div>
        </div>
      </div>

      <div className="bg-navy-900 py-2 px-4 text-center text-[10px] text-slate-400 font-mono border-t border-navy-800">
        © 2025 {ORG.nameEn}. All Rights Reserved. Portal Powered by NIC e-Procurement Engine &amp; CPCL CVC-AI
        Verification Framework.
      </div>
    </footer>
  )
}
