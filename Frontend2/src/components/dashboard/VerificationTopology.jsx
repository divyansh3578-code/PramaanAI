import Icon from '../common/Icon.jsx'
import { PIPELINE_STAGES } from '../../data/constants.js'

export default function VerificationTopology() {
  return (
    <div className="bg-navy text-white rounded border border-navy-600 p-5 overflow-x-auto shadow-sm">
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Icon name="schema" size={16} className="text-saffron" />
          <span className="font-bold text-[11px] tracking-wider uppercase text-slate-200">
            National Informatics Centre (NIC) Statutory Verification Topology
          </span>
        </div>
        <span className="text-[10px] font-mono bg-navy-700 text-teal-200 px-2 py-0.5 rounded border border-navy-600">
          Deterministic Audit Guarantee (CVC Rule 144)
        </span>
      </div>
      <div className="min-w-[900px] flex items-center justify-between text-center gap-2 py-1">
        {PIPELINE_STAGES.map((stage, i) => (
          <div key={stage.title} className="flex items-center gap-2 flex-1">
            <div
              className={`flex-1 rounded p-2 flex flex-col items-center ${
                stage.active
                  ? 'flex-[1.3] bg-[#144272] border-2 border-saffron shadow'
                  : 'bg-navy-700 border border-navy-600'
              }`}
            >
              <Icon
                name={stage.icon}
                size={stage.active ? 20 : 18}
                className={stage.accent ? 'text-teal-200' : 'text-saffron'}
              />
              <span className={`text-[11px] font-bold mt-1 ${stage.accent ? 'text-teal-200' : stage.active ? 'text-white' : ''}`}>
                {stage.title}
              </span>
              <span className={`text-[9px] font-mono ${stage.active ? 'text-amber-200' : 'text-slate-300'}`}>
                {stage.subtitle}
              </span>
            </div>
            {i < PIPELINE_STAGES.length - 1 && <Icon name="arrow_forward" size={14} className="text-slate-400 shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  )
}
