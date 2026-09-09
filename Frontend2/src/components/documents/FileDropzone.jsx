import { useRef, useState } from 'react'
import Icon from '../common/Icon.jsx'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const EXT_ICON = {
  pdf: 'picture_as_pdf',
  doc: 'description',
  docx: 'description',
  xls: 'table_chart',
  xlsx: 'table_chart',
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
}

function fileIcon(name) {
  const ext = name.split('.').pop()?.toLowerCase()
  return EXT_ICON[ext] || 'draft'
}

/**
 * Controlled drag-and-drop uploader. `files` is an array of
 * { name, size, id } — the parent owns the list; this component only
 * surfaces add/remove intent via onAdd / onRemove.
 */
export default function FileDropzone({ files, onAdd, onRemove, accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx', multiple = true }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return
    onAdd(Array.from(fileList))
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-1 border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-navy bg-[#eef3fa]' : 'border-slate-300 hover:border-navy-300 bg-[#f8fafc]'
        }`}
      >
        <Icon name="upload_file" size={22} className="text-navy-300" />
        <span className="text-[11px] font-semibold text-navy">Drag &amp; drop, or click to browse</span>
        <span className="text-[9px] text-slate-400 font-mono">PDF, DOC, XLS, JPG, PNG · up to 10MB each</span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-1">
          {files.map((f, i) => (
            <div key={f.id} className="flex items-center gap-2 bg-white border border-slate-200 rounded px-2 py-1.5 text-[11px]">
              <Icon name={fileIcon(f.name)} size={15} className="text-navy shrink-0" />
              <span className="truncate flex-1 text-slate-700 font-medium">{f.name}</span>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">{formatSize(f.size)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(i)
                }}
                className="text-slate-400 hover:text-rose-600 shrink-0"
                aria-label={`Remove ${f.name}`}
                type="button"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
