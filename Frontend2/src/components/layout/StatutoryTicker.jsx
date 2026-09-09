import Icon from '../common/Icon.jsx'

export default function StatutoryTicker() {
  return (
    <div className="bg-[#fff3cd] text-[#664d03] border-b border-[#ffe69c] px-4 py-1.5 flex items-center gap-2 overflow-hidden shadow-inner">
      <div className="flex items-center gap-1 bg-[#d39e00] text-white px-2 py-0.5 rounded font-bold text-[10px] uppercase shrink-0">
        <Icon name="notifications_active" size={13} />
        CVC Gazette Alert
      </div>
      <div className="overflow-hidden whitespace-nowrap flex-1">
        <div className="animate-marquee font-medium text-[12px] inline-block">
          <span className="font-bold text-[#856404]">URGENT STATUTORY DIRECTIVE:</span> CVC Circular No. 04/2025
          regarding mandatory real-time GSTN API returns reconciliation and Udyam MSME turnover re-verification prior
          to financial bid opening. • Tender Ref: CPCL/ENGG/2025/NIT-882 Stage-1 Technical Bid Evaluation is
          currently active under Independent External Monitor (IEM) oversight. • Last date for clarification
          responses: 08-Mar-2025 17:00 IST.
        </div>
      </div>
      <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-[#856404] shrink-0">
        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
        NIC-VPN SSL Sealed
      </div>
    </div>
  )
}
