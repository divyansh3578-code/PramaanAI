import { Link } from 'react-router-dom'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import SectionCard from '../components/common/SectionCard.jsx'
import Icon from '../components/common/Icon.jsx'
import StatusBadge from '../components/common/StatusBadge.jsx'
import { BIDDERS, STATUS } from '../data/bidders.js'

const LEDGER = BIDDERS.filter((b) => b.eligibility.status === STATUS.DISQUALIFIED || b.eligibility.status === STATUS.HIGH_RISK).sort(
  (a, b) => a.eligibility.score - b.eligibility.score,
)

export default function DisqualificationLedgerPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'CVC Disqualification Ledger' }]} />

      <SectionCard
        eyebrow="CVC Vigilance Directorate"
        title="CVC Disqualification & High-Risk Ledger"
        description={`${LEDGER.length} bidders currently carrying a statutory disqualification or high-risk vigilance flag under NIT-882, ordered by ascending compliance score.`}
      >
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy text-white text-[11px] font-mono font-semibold">
                <th className="py-2 px-3 border-r border-navy-600 w-12 text-center">Sl No</th>
                <th className="py-2 px-3 border-r border-navy-600">Bidder / Dossier ID</th>
                <th className="py-2 px-3 border-r border-navy-600">Status &amp; Score</th>
                <th className="py-2 px-3 border-r border-navy-600">CVC Note</th>
                <th className="py-2 px-3 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="text-[12px] divide-y divide-slate-200">
              {LEDGER.map((b) => (
                <tr key={b.id} className="hover:bg-rose-50/40">
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-700 border-r border-slate-200">
                    {String(b.slNo).padStart(2, '0')}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200">
                    <div className="font-bold text-navy">{b.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">{b.dossierId}</div>
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200">
                    <StatusBadge status={b.eligibility.status} score={b.eligibility.score} size="sm" />
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 text-slate-700 text-[11px]">{b.discrepancy}</td>
                  <td className="py-2.5 px-3 text-right">
                    <Link
                      to="/evaluation-matrix"
                      className="inline-flex items-center gap-1 text-navy hover:underline font-semibold text-[11px]"
                    >
                      Open <Icon name="arrow_forward" size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </>
  )
}
