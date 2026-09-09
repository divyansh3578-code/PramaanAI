import { useMemo, useState } from 'react'
import TableFilterBar from './TableFilterBar.jsx'
import BidderRow from './BidderRow.jsx'
import Pagination from './Pagination.jsx'
import { STATUS } from '../../data/bidders.js'

const PAGE_SIZE = 5

const COLUMNS = [
  { label: 'Sl No', className: 'w-12 text-center' },
  { label: 'Bidder Name, CIN & GeM Seller ID' },
  { label: 'Statutory Eligibility & Risk Score' },
  { label: 'GSTN Status & Returns' },
  { label: 'MCA-21 Status' },
  { label: 'Udyam Scale / EMD' },
  { label: 'EPFO / ESIC' },
  { label: 'Make-in-India %' },
  { label: 'Key Discrepancy / CVC Note' },
  { label: 'Statutory Action', className: 'text-right' },
]

function matchesStatus(bidder, filter) {
  if (filter === 'ALL') return true

  if (filter === 'ELIGIBLE') {
    return bidder.eligibility?.status === STATUS.ELIGIBLE
  }

  if (filter === 'SCRUTINY') {
    return bidder.eligibility?.status === STATUS.SCRUTINY
  }

  if (filter === 'RISK') {
    return (
      bidder.eligibility?.status === STATUS.DISQUALIFIED ||
      bidder.eligibility?.status === STATUS.HIGH_RISK
    )
  }

  return true
}

export default function BidderMatrixTable({
  selectedId,
  onSelectBidder,
  onAction,
  approvedIds,
  bidders = [],
}) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return bidders.filter((b) => {
      if (!matchesStatus(b, status)) return false

      if (!q) return true

      return (
        (b.pan || '').toLowerCase().includes(q) ||
        (b.gstin || '').toLowerCase().includes(q) ||
        (b.gemId || '').toLowerCase().includes(q) ||
        (b.name || '').toLowerCase().includes(q) ||
        (b.id || '').toLowerCase().includes(q) ||
        (b.cin || '').toLowerCase().includes(q)
      )
    })
  }, [search, status, bidders])

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  )

  const safePage = Math.min(page, totalPages)

  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  const handleSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  const handleStatus = (value) => {
    setStatus(value)
    setPage(1)
  }

  return (
    <div className="bg-white rounded border border-slate-300 shadow-sm flex flex-col overflow-hidden">

      <TableFilterBar
        search={search}
        onSearch={handleSearch}
        status={status}
        onStatus={handleStatus}
        resultCount={filtered.length}
        totalCount={bidders.length}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border-b border-slate-200">

          <thead>
            <tr className="bg-navy text-white text-[11px] font-mono font-semibold tracking-tight border-b-2 border-saffron">
              {COLUMNS.map((col) => (
                <th
                  key={col.label}
                  className={`py-2 px-3 border-r border-navy-600 last:border-r-0 ${
                    col.className || ''
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-[12px] divide-y divide-slate-200">

            {pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="py-10 text-center text-slate-500 text-[12px]"
                >
                  No bidders match this search / filter combination.
                </td>
              </tr>
            ) : (
              pageItems.map((bidder) => (
                <BidderRow
                  key={bidder.id}
                  bidder={bidder}
                  isSelected={bidder.id === selectedId}
                  isApproved={approvedIds.has(bidder.id)}
                  onSelect={onSelectBidder}
                  onAction={onAction}
                />
              ))
            )}

          </tbody>
        </table>
      </div>

      <Pagination
        page={safePage}
        totalPages={totalPages}
        onPage={setPage}
        totalCount={filtered.length}
        pageSize={PAGE_SIZE}
      />

    </div>
  )
}