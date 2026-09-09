import { useEffect, useRef, useState } from 'react'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import MandateHeader from '../components/dashboard/MandateHeader.jsx'
import ConnectorGrid from '../components/dashboard/ConnectorGrid.jsx'
import BidderMatrixTable from '../components/dashboard/BidderMatrixTable.jsx'
import DisqualificationDossier from '../components/dashboard/DisqualificationDossier.jsx'
import { api, ApiError } from '../api/client.js'
import { useToast } from '../context/ToastContext.jsx'

export default function EvaluationMatrixPage() {
  const { notify } = useToast()

  const [tender, setTender] = useState(null)
  const [bidders, setBidders] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  const [approvedIds, setApprovedIds] = useState(() => new Set())
  const [confirmedIds, setConfirmedIds] = useState(() => new Set())

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const dossierRef = useRef(null)
  const hasMounted = useRef(false)

  useEffect(() => {
    loadMatrix()
  }, [])

  async function loadMatrix() {
    setLoading(true)
    setError('')

    try {
      const tenderResponse = await api.listTenders()

      const tenders = tenderResponse?.tenders || []

      if (!tenders.length) {
        throw new Error('No tender is available.')
      }

      const activeTender = tenders[0]
      setTender(activeTender)

      const matrixResponse = await api.getMatrix(activeTender._id)
const rows = matrixResponse?.bidders || []

setBidders(rows)

const persistedConfirmed = new Set(
  rows
    .filter(
      (bidder) =>
        bidder.actionStatus &&
        bidder.actionStatus !== 'NONE'
    )
    .map((bidder) => bidder.id)
)

setConfirmedIds(persistedConfirmed)

      // Prefer the first flagged bidder for the dossier,
      // otherwise select the first bidder.
      const firstSelection =
        rows.find((bidder) => bidder.flagged)?.id ||
        rows[0]?.id ||
        null

      setSelectedId(firstSelection)
    } catch (err) {
      console.error('Failed to load evaluation matrix:', err)

      const message =
        err instanceof ApiError
          ? err.message
          : err?.message || 'Could not load the evaluation matrix.'

      setError(message)

      notify('Evaluation matrix failed to load', {
        tone: 'warning',
        detail: message,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }

    if (selectedId) {
      dossierRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [selectedId])

  const selectedBidder =
    bidders.find((bidder) => bidder.id === selectedId) || null

  const handleSelect = (bidder) => {
    setSelectedId(bidder.id)
  }

  const handleRowAction = (bidder) => {
    setSelectedId(bidder.id)

    if (bidder.action?.tone === 'approve') {
      setApprovedIds((prev) => {
        const next = new Set(prev)
        next.add(bidder.id)
        return next
      })

      notify(`${bidder.name} approved for Stage-1`, {
        tone: 'success',
        detail: `${bidder.id} • Score ${bidder.eligibility?.score ?? 0}/100 • Advanced to financial bid stage.`,
      })
    } else if (bidder.action?.tone === 'query') {
      notify(`Clarification query queued for ${bidder.name}`, {
        tone: 'warning',
        detail: `${bidder.id} • 72-hour statutory response window opens on confirmation below.`,
      })
    }
  }
const handleConfirmDossierAction = async (bidderId) => {
  const bidder = bidders.find((b) => b.id === bidderId)

  if (!bidder) {
    notify('Bidder not found', {
      tone: 'warning',
      detail: 'Unable to confirm this dossier action.',
    })
    return
  }

  const actionMap = {
    blacklist: 'BLACKLIST_CONFIRMED',
    approve: 'APPROVED',
    query: 'QUERY_SENT',
    review: 'REVIEW_FLAGGED',
  }

  const action = actionMap[bidder.action?.tone]

  if (!action) {
    notify('Invalid dossier action', {
      tone: 'warning',
      detail: 'No backend action is mapped to this decision.',
    })
    return
  }

  try {
    const response = await api.confirmBidAction(bidder.bidId, action)

    const confirmedAt = response?.bid?.actionConfirmedAt || new Date().toISOString()

    setConfirmedIds((prev) => {
      const next = new Set(prev)
      next.add(bidderId)
      return next
    })

    setBidders((prev) =>
      prev.map((item) =>
        item.id === bidderId
          ? {
              ...item,
              actionStatus: action,
              actionConfirmedAt: confirmedAt,
              action: {
                ...item.action,
                status: action,
                confirmedAt,
              },
            }
          : item
      )
    )

    notify('Action recorded successfully', {
      tone: 'success',
      detail: `${bidder.name} • ${action.replace(/_/g, ' ')}`,
    })
  } catch (err) {
    console.error('Failed to confirm bid action:', err)

    notify('Could not record action', {
      tone: 'warning',
      detail: err?.message || 'Please try again.',
    })
  }
}

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-2 text-navy text-sm font-mono">
          <span className="animate-spin">◌</span>
          Loading live statutory verification matrix...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded p-6 text-center">
        <h2 className="font-bold text-red-700">
          Unable to load evaluation matrix
        </h2>

        <p className="text-sm text-slate-600 mt-2">
          {error}
        </p>

        <button
          onClick={loadMatrix}
          className="mt-4 px-4 py-2 bg-navy text-white rounded text-sm"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          {
            label: 'Central E-Procurement',
            to: '/tender-notices',
          },
          {
            label: tender
              ? `${tender.referenceNo} (Manali Refinery)`
              : 'Evaluation Matrix',
            to: '/evaluation-matrix',
          },
          {
            label: 'Stage-1 Statutory Eligibility Matrix',
          },
        ]}
        trailing={
          <>
            <span className="bg-blue-100 text-navy border border-blue-200 px-2 py-0.5 rounded font-mono font-semibold">
              NIC GeM-CPPP Node: {tender?.nicNode || '—'}
            </span>

            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-mono font-semibold">
              NIT Approved Budget:{' '}
              {tender?.approvedBudget?.toLocaleString?.('en-IN') ||
                tender?.approvedBudget ||
                '—'}
            </span>
          </>
        }
      />

      <MandateHeader />

      <ConnectorGrid />

      <BidderMatrixTable
        selectedId={selectedId}
        onSelectBidder={handleSelect}
        onAction={handleRowAction}
        approvedIds={approvedIds}
        bidders={bidders}
      />

      <DisqualificationDossier
        bidder={selectedBidder}
        isConfirmed={
          selectedId ? confirmedIds.has(selectedId) : false
        }
        onConfirm={handleConfirmDossierAction}
        dossierRef={dossierRef}
      />

      <p className="text-center text-[10px] text-slate-400 font-mono -mt-4">
        Live verification dataset — {bidders.length} bidders evaluated
        against {tender?.referenceNo || 'active tender'}.
      </p>
    </>
  )
}