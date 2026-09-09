import { useMemo, useState } from 'react'
import Icon from '../common/Icon.jsx'
import { CATEGORY_META } from '../../data/mockTenderAnalysis.js'

function ConfidencePill({ confidence }) {
  const pct = Math.round(confidence * 100)
  const tone = pct >= 90 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : pct >= 70 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-rose-700 bg-rose-50 border-rose-200'
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-mono font-bold ${tone}`}>
      {pct}%
    </span>
  )
}

function MethodBadge({ method }) {
  const isLlm = method === 'llm'
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wide ${
        isLlm ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-600 border border-slate-300'
      }`}
    >
      <Icon name={isLlm ? 'auto_awesome' : 'data_object'} size={11} />
      {isLlm ? 'LLM' : 'Regex'}
    </span>
  )
}

function RequirementRow({ req }) {
  const [expanded, setExpanded] = useState(false)
  const meta = CATEGORY_META[req.category]

  return (
    <div className={`border ${meta.border} ${meta.bg} rounded-lg overflow-hidden`}>
      <button onClick={() => setExpanded((v) => !v)} className="w-full flex items-start gap-3 p-3 text-left">
        <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${meta.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-1.5 mb-1">
            <span className="text-[10px] font-mono font-bold text-slate-500">{req.id}</span>
            <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${meta.text} bg-white border ${meta.border}`}>
              {meta.label}
            </span>
            {req.mandatory ? (
              <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-rose-600 text-white">Mandatory</span>
            ) : (
              <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-slate-300 text-slate-700">Optional</span>
            )}
            <MethodBadge method={req.method} />
            <ConfidencePill confidence={req.confidence} />
          </div>
          <p className="text-[13px] font-semibold text-navy leading-snug">{req.statement}</p>
        </div>
        <Icon name={expanded ? 'expand_less' : 'expand_more'} size={18} className="text-slate-400 shrink-0 mt-0.5" />
      </button>

      {expanded && (
        <div className="px-3 pb-3 pl-8">
          <div className="flex items-start gap-1.5 text-[11px] text-slate-600 bg-white/70 border border-slate-200 rounded p-2">
            <Icon name="format_quote" size={14} className="text-slate-400 shrink-0 mt-0.5" />
            <span className="italic leading-snug">{req.source}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function NeedsReviewPanel({ items }) {
  if (!items || items.length === 0) return null
  return (
    <div className="border border-amber-300 bg-amber-50 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon name="flag" size={16} className="text-amber-700" />
        <h3 className="text-[12px] font-bold text-amber-800 uppercase tracking-wide">
          Needs Officer Review ({items.length})
        </h3>
      </div>
      <p className="text-[11px] text-amber-800/80 mb-2">
        These clauses could not be auto-structured into a requirement. Review and convert them manually if they affect eligibility.
      </p>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 bg-white border border-amber-200 rounded p-2">
            <Icon name="description" size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[12px] text-slate-700 leading-snug flex-1">{item.text}</p>
            <button className="shrink-0 text-[10px] font-semibold text-navy border border-slate-300 rounded px-2 py-1 hover:bg-slate-50">
              Convert manually
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RequirementMatrix({ analysis }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [query, setQuery] = useState('')

  const counts = useMemo(() => {
    const c = { all: analysis.requirements.length }
    for (const key of Object.keys(CATEGORY_META)) {
      c[key] = analysis.requirements.filter((r) => r.category === key).length
    }
    return c
  }, [analysis.requirements])

  const filtered = useMemo(() => {
    return analysis.requirements.filter((r) => {
      const matchesCategory = activeCategory === 'all' || r.category === activeCategory
      const matchesQuery = query.trim() === '' || r.statement.toLowerCase().includes(query.toLowerCase()) || r.id.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [analysis.requirements, activeCategory, query])

  return (
    <div className="flex flex-col gap-4">
      {/* Ingestion summary strip */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
        <span className="flex items-center gap-1"><Icon name="picture_as_pdf" size={14} className="text-navy" /> {analysis.meta.fileName}</span>
        <span>{analysis.meta.pages} pages</span>
        <span className="capitalize">{analysis.meta.sourceType.replace('_', ' ')}</span>
        <span className="text-emerald-700 font-semibold">{analysis.requirements.length} requirements extracted</span>
        {analysis.needsReview.length > 0 && (
          <span className="text-amber-700 font-semibold">{analysis.needsReview.length} needs review</span>
        )}
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
            activeCategory === 'all' ? 'bg-navy text-white border-navy' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
          }`}
        >
          All ({counts.all})
        </button>
        {Object.entries(CATEGORY_META).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              activeCategory === key ? `${meta.text} ${meta.bg} ${meta.border}` : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Icon name={meta.icon} size={12} />
            {meta.label} ({counts[key] || 0})
          </button>
        ))}

        <div className="ml-auto flex items-center gap-1.5 bg-white border border-slate-300 rounded-full px-2.5 py-1">
          <Icon name="search" size={13} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search requirements…"
            className="text-[11px] outline-none w-36"
          />
        </div>
      </div>

      {/* Requirement list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="text-center text-slate-400 text-[12px] py-6">No requirements match this filter.</div>
        ) : (
          filtered.map((req) => <RequirementRow key={req.id} req={req} />)
        )}
      </div>

      <NeedsReviewPanel items={analysis.needsReview} />
    </div>
  )
}