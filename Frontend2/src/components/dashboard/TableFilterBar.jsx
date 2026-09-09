import Icon from '../common/Icon.jsx'
import { STATUS_FILTERS } from '../../data/constants.js'

export default function TableFilterBar({ search, onSearch, status, onStatus, resultCount, totalCount }) {
  return (
    <div className="bg-[#f0f4f9] border-b border-slate-300 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 bg-navy shrink-0" />
        <div>
          <h3 className="font-bold text-navy text-[13px] leading-tight">
            Stage-1 Bidder Statutory Eligibility &amp; Compliance Matrix
          </h3>
          <span className="text-[11px] text-slate-600">
            Cohort Sample: {resultCount} of {totalCount} Technical Bids Evaluated per CVC Vigilance Standard
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Icon name="search" size={16} className="absolute left-2 top-2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="h-8 pl-7 pr-2.5 text-[11px] font-mono bg-white border border-slate-300 rounded focus:border-navy focus:ring-0 w-60"
            placeholder="Search PAN, GSTIN, GeM ID..."
            type="text"
          />
        </div>
        <select
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          className="h-8 px-2 text-[11px] font-mono bg-white border border-slate-300 rounded focus:border-navy"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <button className="h-8 px-3 bg-navy text-white rounded text-[11px] font-medium flex items-center gap-1 hover:bg-navy-700">
          <Icon name="filter_alt" size={14} /> Filter
        </button>
      </div>
    </div>
  )
}
