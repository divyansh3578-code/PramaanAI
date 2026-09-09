import Icon from '../common/Icon.jsx'
import FileDropzone from './FileDropzone.jsx'

export default function DocumentCategoryCard({ category, files, onAdd, onRemove }) {
  const hasUpload = files.length > 0
  const isSatisfied = hasUpload || (category.existing && category.existing.length > 0)

  return (
    <div className={`bg-white border rounded p-3.5 flex flex-col gap-2.5 ${category.required && !isSatisfied ? 'border-amber-300' : 'border-slate-200'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded bg-navy text-saffron flex items-center justify-center shrink-0">
            <Icon name={category.icon} size={16} />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-navy text-[12.5px] leading-tight truncate">{category.title}</div>
            {category.hint && <div className="text-[10px] text-slate-500 truncate">{category.hint}</div>}
          </div>
        </div>
        {category.required ? (
          <span
            className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${
              isSatisfied ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {isSatisfied ? 'On File' : 'Required'}
          </span>
        ) : (
          <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border bg-slate-100 text-slate-500 border-slate-300 shrink-0">
            Optional
          </span>
        )}
      </div>

      {category.existing && category.existing.length > 0 && (
        <div className="flex flex-col gap-1">
          {category.existing.map((doc) => (
            <div key={doc.name} className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded px-2 py-1.5 text-[11px]">
              <Icon name="verified" size={14} className="text-emerald-700 shrink-0" />
              <span className="truncate flex-1 text-emerald-900 font-medium">{doc.name}</span>
              <span className="text-[9px] font-mono text-emerald-700 shrink-0">{doc.date}</span>
            </div>
          ))}
        </div>
      )}

      <FileDropzone files={files} onAdd={(f) => onAdd(category.id, f)} onRemove={(i) => onRemove(category.id, i)} />
    </div>
  )
}
