import Icon from '../common/Icon.jsx'

export default function PublishSuccessModal({ open, tenderRef, fileName, requirementCount, publishedAt, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <Icon name="check_circle" size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-[16px] font-bold text-navy mb-1">Published to GeM/CPPP Portal</h2>
        <p className="text-[12px] text-slate-500 mb-4">
          The requirement matrix for <span className="font-semibold text-slate-700">{tenderRef}</span> is now live and saved for all bidders.
        </p>
        <div className="flex flex-col gap-1.5 text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3 mb-5 text-left">
          <div className="flex justify-between gap-3"><span>Source file</span><span className="text-slate-800 truncate">{fileName}</span></div>
          <div className="flex justify-between gap-3"><span>Requirements</span><span className="text-slate-800">{requirementCount}</span></div>
          <div className="flex justify-between gap-3"><span>Published at</span><span className="text-slate-800">{publishedAt}</span></div>
        </div>
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-navy hover:bg-navy-700 text-white rounded-lg font-semibold text-[12px] shadow-sm"
        >
          <Icon name="upload_file" size={16} className="text-saffron" />
          Upload Another Tender
        </button>
      </div>
    </div>
  )
}
