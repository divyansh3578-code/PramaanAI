import Icon from '../common/Icon.jsx'

export default function Pagination({ page, totalPages, onPage, totalCount, pageSize, cvcBlock = '#44092' }) {
  const shown = Math.min(pageSize, totalCount - (page - 1) * pageSize)

  const pageNumbers = () => {
    const nums = [1]
    if (page > 3) nums.push('…')
    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) nums.push(p)
    if (page < totalPages - 2) nums.push('…')
    if (totalPages > 1) nums.push(totalPages)
    return [...new Set(nums)]
  }

  return (
    <div className="bg-[#f0f4f9] border-t border-slate-300 p-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600 font-mono">
      <div className="flex items-center gap-1">
        <Icon name="lock" size={15} className="text-navy" />
        <span>
          Showing {shown} of {totalCount} Verified Bidders • Cryptographically Anchored at Ingestion (CVC Block {cvcBlock})
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        {pageNumbers().map((n, i) =>
          n === '…' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={n}
              onClick={() => onPage(n)}
              className={`px-2.5 py-0.5 rounded font-bold ${n === page ? 'bg-navy text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'}`}
            >
              {n}
            </button>
          ),
        )}
        <button
          onClick={() => onPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}
