export default function ConnectorCard({ connector }) {
  return (
    <div className="bg-white border border-slate-200 rounded p-4 flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-8 h-8 rounded font-mono font-bold text-[11px] flex items-center justify-center shrink-0 ${connector.badgeClass}`}>
              {connector.code}
            </span>
            <div className="min-w-0">
              <div className="font-bold text-navy text-[12px] leading-tight truncate">{connector.name}</div>
              <div className="text-[10px] text-slate-500 font-mono truncate">{connector.endpoint}</div>
            </div>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0">
            {connector.sla || connector.status}
          </span>
        </div>
        <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">{connector.description}</p>
      </div>
      <div className="mt-3 pt-2 bg-[#f8fafc] border-t border-slate-200 flex items-center justify-between text-[10px] font-mono gap-2">
        {connector.stats.map((s) => (
          <div key={s.label} className="truncate">
            <span className="text-slate-500">{s.label}</span>{' '}
            <strong className={s.accent ? 'text-emerald-700' : 'text-slate-800'}>{s.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
