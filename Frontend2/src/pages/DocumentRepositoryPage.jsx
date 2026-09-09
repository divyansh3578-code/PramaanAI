import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import SectionCard from '../components/common/SectionCard.jsx'
import Icon from '../components/common/Icon.jsx'
import DocumentCategoryCard from '../components/documents/DocumentCategoryCard.jsx'
import TenderAnalysisUpload from '../components/documents/TenderAnalysisUpload.jsx'
import RequirementMatrix from '../components/documents/RequirementMatrix.jsx'
import PublishSuccessModal from '../components/documents/PublishSuccessModal.jsx'
import { useAuth, ROLE } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { BIDDER_DOCUMENT_CATEGORIES } from '../data/documentCategories.js'
import { TENDER } from '../data/constants.js'
import { api, ApiError } from '../api/client.js'

let fileSeq = 1

// Bidder document categories -> backend Document.documentType enum
// (GST, UDYAM, PAN, ITR, OEM, ESIC, EPFO, OTHER). Several UI categories share
// OTHER since the enum is coarser than the 8 categories shown here.
const CATEGORY_TO_DOC_TYPE = {
  pan: 'PAN', gst: 'GST', coi: 'OTHER', udyam: 'UDYAM',
  epfo: 'EPFO', itr: 'ITR', gem: 'OTHER', techbid: 'OTHER',
}

// Real upload/list/delete against a bidder's own document set (BIDDER role only).
function useBidderDocuments(bidderId) {
  const { notify } = useToast()
  const [uploads, setUploads] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!bidderId) return
    let cancelled = false
    api
      .listDocuments(bidderId)
      .then((res) => {
        if (cancelled) return
        const byCategory = {}
        for (const doc of res.documents || []) {
          const cat = Object.keys(CATEGORY_TO_DOC_TYPE).find((k) => CATEGORY_TO_DOC_TYPE[k] === doc.documentType) || 'coi'
          byCategory[cat] = [...(byCategory[cat] || []), { id: doc._id, name: doc.originalName, size: doc.size }]
        }
        setUploads(byCategory)
      })
      .catch((err) => notify('Could not load your documents', { tone: 'warning', detail: err instanceof ApiError ? err.message : String(err) }))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [bidderId])

  const addFiles = async (categoryId, fileList) => {
    for (const file of fileList) {
      try {
        const { document } = await api.uploadDocument(bidderId, file, CATEGORY_TO_DOC_TYPE[categoryId])
        setUploads((prev) => ({
          ...prev,
          [categoryId]: [...(prev[categoryId] || []), { id: document._id, name: document.originalName, size: document.size }],
        }))
      } catch (err) {
        notify('Upload failed', { tone: 'warning', detail: err instanceof ApiError ? err.message : `Could not upload ${file.name}` })
      }
    }
  }

  const removeFile = async (categoryId, index) => {
    const doc = (uploads[categoryId] || [])[index]
    if (!doc) return
    try {
      await api.deleteDocument(doc.id)
      setUploads((prev) => ({ ...prev, [categoryId]: (prev[categoryId] || []).filter((_, i) => i !== index) }))
    } catch (err) {
      notify('Delete failed', { tone: 'warning', detail: err instanceof ApiError ? err.message : 'Could not delete document' })
    }
  }

  const requiredTotal = BIDDER_DOCUMENT_CATEGORIES.filter((c) => c.required).length
  const requiredDone = BIDDER_DOCUMENT_CATEGORIES.filter((c) => c.required && (uploads[c.id]?.length > 0)).length

  return { uploads, addFiles, removeFile, requiredTotal, requiredDone, loading }
}

function useUploads(categories) {
  const [uploads, setUploads] = useState({})

  const addFiles = (categoryId, fileList) => {
    setUploads((prev) => ({
      ...prev,
      [categoryId]: [
        ...(prev[categoryId] || []),
        ...fileList.map((f) => ({ id: fileSeq++, name: f.name, size: f.size })),
      ],
    }))
  }

  const removeFile = (categoryId, index) => {
    setUploads((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] || []).filter((_, i) => i !== index),
    }))
  }

  const requiredTotal = categories.filter((c) => c.required).length
  const requiredDone = categories.filter(
    (c) => c.required && ((uploads[c.id] && uploads[c.id].length > 0) || (c.existing && c.existing.length > 0)),
  ).length

  return { uploads, addFiles, removeFile, requiredTotal, requiredDone }
}

function ProgressBar({ done, total }) {
  const pct = total === 0 ? 100 : Math.round((done / total) * 100)
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-emerald-600' : 'bg-navy'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] font-mono font-bold text-navy shrink-0">
        {done}/{total} required
      </span>
    </div>
  )
}

function GuestPrompt() {
  return (
    <SectionCard
      eyebrow="Authentication Required"
      title="Sign in to access the Document Repository"
      description="Tender document publishing and bidder compliance-document submission both require a signed-in session so uploads can be attributed and DSC/OTP-sealed in the audit trail."
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/login"
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-navy hover:bg-navy-700 text-white rounded font-semibold text-[12px] shadow-sm"
        >
          <Icon name="badge" size={16} className="text-saffron" /> Sign in as Procurement Officer
        </Link>
        <Link
          to="/login"
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-white border border-slate-300 hover:bg-slate-100 text-navy rounded font-semibold text-[12px] shadow-sm"
        >
          <Icon name="storefront" size={16} className="text-navy" /> Sign in as Registered Bidder
        </Link>
      </div>
    </SectionCard>
  )
}

// Officer flow: upload the tender as a single PDF, let the ML pipeline
// extract the requirement matrix, review it, then publish — which persists
// the matrix to MongoDB (see POST /api/tender-analysis) and clears the
// screen back to a fresh upload with a confirmation popup.
function OfficerPanel() {
  const { notify } = useToast()
  const [analysis, setAnalysis] = useState(null)
  const [publishing, setPublishing] = useState(false)
  const [publishedInfo, setPublishedInfo] = useState(null) // non-null while the success modal is open

  const handleAnalysisComplete = (result) => {
    setAnalysis(result)
    notify('Requirement matrix ready', {
      tone: 'success',
      detail: `${result.requirements.length} requirement(s) extracted from ${result.meta.fileName}.`,
    })
  }

  const handlePublish = () => {
    if (!analysis || publishing) return
    setPublishing(true)

    // TODO(backend): database persistence is disabled for now — this just
    // simulates a brief publish delay, then clears the screen and shows the
    // confirmation popup. To re-enable saving to MongoDB, call
    // `await api.publishTenderAnalysis({ ... })` here (see the
    // models/TenderAnalysis.js + routes/tenderAnalysis.js files from earlier)
    // before clearing `analysis`.
    setTimeout(() => {
      setPublishedInfo({
        tenderRef: TENDER.ref,
        fileName: analysis.meta.fileName,
        requirementCount: analysis.requirements.length,
        publishedAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      })
      notify('Tender document published', {
        tone: 'success',
        detail: `${TENDER.ref} dossier + requirement matrix synced to GeM/CPPP portal.`,
      })
      setAnalysis(null) // clear everything back to a fresh upload screen
      setPublishing(false)
    }, 500)
  }

  return (
    <>
      {!analysis ? (
        <SectionCard
          eyebrow="Officer Upload Console"
          title="Tender Document Repository"
          description={`Upload the official tender document for ${TENDER.ref} as a single PDF. PRAMAAN will read it and build the requirement matrix automatically — no need to split it into separate files.`}
        >
          <TenderAnalysisUpload onComplete={handleAnalysisComplete} />
        </SectionCard>
      ) : (
        <SectionCard
          eyebrow="Officer Upload Console"
          title="Requirement Matrix"
          description={`Extracted from ${analysis.meta.fileName} for ${TENDER.ref}. Review the flagged clauses below, then publish to make this the live compliance checklist for all bidders.`}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAnalysis(null)}
                disabled={publishing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-navy rounded font-medium text-[12px] disabled:opacity-50"
              >
                <Icon name="refresh" size={16} />
                Re-analyze
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-navy hover:bg-navy-700 text-white rounded font-medium text-[12px] shadow-sm disabled:opacity-60"
              >
                <Icon name={publishing ? 'sync' : 'cloud_upload'} size={16} className={`text-saffron ${publishing ? 'animate-spin' : ''}`} />
                {publishing ? 'Publishing…' : 'Publish to GeM/CPPP Portal'}
              </button>
            </div>
          }
        >
          <RequirementMatrix analysis={analysis} />
        </SectionCard>
      )}

      <PublishSuccessModal
        open={!!publishedInfo}
        tenderRef={publishedInfo?.tenderRef}
        fileName={publishedInfo?.fileName}
        requirementCount={publishedInfo?.requirementCount}
        publishedAt={publishedInfo?.publishedAt}
        onClose={() => setPublishedInfo(null)}
      />
    </>
  )
}

function BidderPanel() {
  const { notify } = useToast()
  const { user } = useAuth()
  const { uploads, addFiles, removeFile, requiredTotal, requiredDone, loading } = useBidderDocuments(user.bidderId)
  const allDone = requiredDone === requiredTotal

  if (!user.bidderId) {
    return (
      <SectionCard
        eyebrow="No Bidder Profile Linked"
        title="This account isn't linked to a bidder company profile"
        description="Bidder accounts created before this update, or via the API directly, may not have a linked profile. Re-register through the sign-in page's 'New Bidder' tab to create one."
      />
    )
  }

  const handleSubmit = () => {
    if (!allDone) {
      notify('Submission incomplete', {
        tone: 'warning',
        detail: `${requiredTotal - requiredDone} required document(s) still missing. Upload them before submitting.`,
      })
      return
    }
    notify('Bidder dossier on file for verification', {
      tone: 'success',
      detail: `An officer can now run PRAMAAN reconciliation (GSTN/MCA-21/Udyam/EPFO) against your uploaded documents.`,
    })
  }

  return (
    <>
      <SectionCard
        eyebrow="Bidder Upload Console — Live"
        title="Bidder Document Submission"
        description={`Upload your compliance documents for ${TENDER.ref}. Files are stored on the backend and linked to your bidder profile. All required documents must be on file before Stage-1 statutory verification can run.`}
        actions={
          <button
            onClick={handleSubmit}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium text-[12px] shadow-sm ${
              allDone ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            <Icon name="task_alt" size={16} className={allDone ? 'text-emerald-200' : 'text-slate-400'} />
            Mark Ready for Verification
          </button>
        }
      >
        <ProgressBar done={requiredDone} total={requiredTotal} />
      </SectionCard>

      {loading ? (
        <div className="text-center text-slate-500 text-[12px] py-8">Loading your documents…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {BIDDER_DOCUMENT_CATEGORIES.map((cat) => (
            <DocumentCategoryCard
              key={cat.id}
              category={cat}
              files={uploads[cat.id] || []}
              onAdd={addFiles}
              onRemove={removeFile}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default function DocumentRepositoryPage() {
  const { user } = useAuth()

  const panel = useMemo(() => {
    if (!user) return <GuestPrompt />
    return user.role === ROLE.OFFICER ? <OfficerPanel /> : <BidderPanel />
  }, [user])

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Document Repository' }]} />
      {panel}
    </>
  )
}