import { useRef, useState } from 'react'
import Icon from '../common/Icon.jsx'
import { MOCK_TENDER_ANALYSIS } from '../../data/mockTenderAnalysis.js'

// ---------------------------------------------------------------------------
// TODO(backend): replace this with a real call once the Python service
// (tender_analyzer / cli.py) is exposed over HTTP, e.g.:
//
//   async function analyzeTender(file, onStage) {
//     const form = new FormData()
//     form.append('tender', file)
//     const res = await api.analyzeTender(form, { onStage })
//     return res // must match the shape in data/mockTenderAnalysis.js
//   }
//
// The three onStage(...) calls below correspond 1:1 to the CLI's
// "[1/3] Ingesting" / "[2/3] Extracting" / "[3/3] Done" lines, so the real
// backend can either poll/stream these same three stages, or just resolve
// once and this component will jump straight to "done".
// ---------------------------------------------------------------------------
function analyzeTenderMock(file, onStage) {
  return new Promise((resolve) => {
    onStage({ step: 1, label: `Ingesting ${file.name}…` })
    setTimeout(() => {
      onStage({ step: 2, label: 'Extracting requirements (LLM fallback: configured)…' })
      setTimeout(() => {
        const total = MOCK_TENDER_ANALYSIS.requirements.length
        const review = MOCK_TENDER_ANALYSIS.needsReview.length
        onStage({ step: 3, label: `Done. ${total} requirement(s) extracted, ${review} clause(s) need manual review.` })
        resolve({ ...MOCK_TENDER_ANALYSIS, meta: { ...MOCK_TENDER_ANALYSIS.meta, fileName: file.name } })
      }, 1100)
    }, 1400)
  })
}

const STAGES = [
  { step: 1, label: 'Ingest document' },
  { step: 2, label: 'Extract requirements' },
  { step: 3, label: 'Build requirement matrix' },
]

export default function TenderAnalysisUpload({ onComplete }) {
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [status, setStatus] = useState('idle') // idle | processing | error
  const [stage, setStage] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const pickFile = (f) => {
    if (!f) return
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload the tender document as a single PDF file.')
      return
    }
    setError(null)
    setFile(f)
  }

  const runAnalysis = async () => {
    if (!file) return
    setStatus('processing')
    setError(null)
    try {
      const result = await analyzeTenderMock(file, (s) => setStage(s))
      onComplete(result)
    } catch (err) {
      setStatus('error')
      setError(err?.message || 'Analysis failed. Please try again.')
    }
  }

  const reset = () => {
    setFile(null)
    setStatus('idle')
    setStage(null)
    setError(null)
  }

  if (status === 'processing') {
    return (
      <div className="border border-slate-200 rounded-lg p-6 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="picture_as_pdf" size={18} className="text-navy" />
          <span className="text-[13px] font-semibold text-navy">{file?.name}</span>
        </div>
        <div className="flex flex-col gap-3">
          {STAGES.map((s) => {
            const done = stage && stage.step > s.step
            const active = stage && stage.step === s.step
            return (
              <div key={s.step} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    done ? 'bg-emerald-600 text-white' : active ? 'bg-navy text-white animate-pulse' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {done ? <Icon name="check" size={13} /> : s.step}
                </div>
                <span className={`text-[12px] ${active ? 'font-semibold text-navy' : done ? 'text-slate-500' : 'text-slate-400'}`}>
                  {active && stage?.label ? stage.label : s.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files?.[0]) }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-navy bg-[#f4f7fb]' : 'border-slate-300 hover:border-navy hover:bg-slate-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
        {file ? (
          <div className="flex flex-col items-center gap-1.5">
            <Icon name="picture_as_pdf" size={28} className="text-navy" />
            <span className="text-[13px] font-semibold text-navy">{file.name}</span>
            <span className="text-[11px] text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB &middot; click to replace</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <Icon name="upload_file" size={28} className="text-slate-400" />
            <span className="text-[13px] font-semibold text-slate-600">Drop the tender PDF here, or click to browse</span>
            <span className="text-[11px] text-slate-400">Single PDF only &middot; scanned or digital &middot; up to ~9 pages typical</span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-[12px] text-rose-700 bg-rose-50 border border-rose-200 rounded px-3 py-2">
          <Icon name="error" size={14} />
          {error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={runAnalysis}
          disabled={!file}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded font-semibold text-[12px] shadow-sm ${
            file ? 'bg-navy hover:bg-navy-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Icon name="auto_awesome" size={16} className={file ? 'text-saffron' : 'text-slate-400'} />
          Analyze Tender Document
        </button>
        {file && (
          <button onClick={reset} className="text-[12px] font-medium text-slate-500 hover:text-slate-700">
            Clear
          </button>
        )}
      </div>
    </div>
  )
}