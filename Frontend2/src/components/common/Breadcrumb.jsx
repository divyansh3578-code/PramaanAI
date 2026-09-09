import { Link } from 'react-router-dom'

/**
 * items: [{ label, to? }] — the last item is rendered as the current page (no link).
 */
export default function Breadcrumb({ items, trailing }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-2">
      <div className="flex items-center gap-2 text-[11px] text-slate-600 font-mono flex-wrap">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <span key={item.label} className="flex items-center gap-2">
              {isLast || !item.to ? (
                <span className={isLast ? 'font-bold text-slate-800' : ''}>{item.label}</span>
              ) : (
                <Link className="hover:underline text-navy" to={item.to}>
                  {item.label}
                </Link>
              )}
              {!isLast && <span>&gt;</span>}
            </span>
          )
        })}
      </div>
      {trailing && <div className="flex items-center gap-2 text-[11px]">{trailing}</div>}
    </div>
  )
}
