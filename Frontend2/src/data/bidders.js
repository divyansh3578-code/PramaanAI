// Deterministic mock bidder cohort for NIT-882 (Manali Refinery Expansion Package IV).
// Bidders 1–5 are hand-authored reference records (incl. the full Apex Infra
// disqualification dossier). Bidders 6–100 are procedurally generated with a
// seeded PRNG so the eligible/scrutiny/risk split (62 / 12 / 26) is stable
// across reloads without needing a backend.

export const STATUS = {
  ELIGIBLE: 'ELIGIBLE',
  DISQUALIFIED: 'DISQUALIFIED',
  HIGH_RISK: 'HIGH-RISK',
  SCRUTINY: 'SCRUTINY',
}

// ---- seeded PRNG -----------------------------------------------------
function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(882_2025)
const pick = (arr) => arr[Math.floor(rand() * arr.length)]
const int = (min, max) => Math.floor(rand() * (max - min + 1)) + min
const digits = (n) => Array.from({ length: n }, () => int(0, 9)).join('')
const letters = (n) => Array.from({ length: n }, () => String.fromCharCode(65 + int(0, 25))).join('')

const STATE_CODES = ['33', '29', '27', '19', '06', '36', '24', '09', '23', '32']
const NAME_PREFIX = [
  'Apex', 'Vertex', 'Sterling', 'Coromandel', 'Bharat', 'Sundaram', 'Meridian', 'Trident',
  'Shakti', 'Anna', 'Marina', 'Vellore', 'Kaveri', 'Ganga', 'Nilgiri', 'Pearl City',
  'Vindhya', 'Konkan', 'Deccan', 'Cauvery', 'Malabar', 'Godavari', 'Vaigai', 'Palar',
  'Suvarna', 'Ashoka', 'Ratna', 'Utkal', 'Nandi', 'Vasavi',
]
const NAME_SUFFIX = [
  'Infra Projects', 'Engineering Works', 'Constructions', 'Pipelines Ltd', 'Fabricators',
  'Industrial Corp', 'EPC Solutions', 'Process Engineers', 'Heavy Industries', 'Techno Projects',
  'Refinery Services', 'Structurals', 'Erectors Pvt Ltd', 'Turnkey Projects', 'Plant Engineers',
]
const usedNames = new Set()
function makeName() {
  let name
  do {
    name = `${pick(NAME_PREFIX)} ${pick(NAME_SUFFIX)}`
  } while (usedNames.has(name))
  usedNames.add(name)
  return name
}

function makeIdentifiers(stateCode) {
  const pan = `${letters(5)}${digits(4)}${letters(1)}`
  const gstin = `${stateCode}${pan}${int(1, 9)}Z${digits(1)}`
  const cin = `U${digits(5)}TN${int(1990, 2015)}PLC${digits(6)}`
  const gemId = `GEM/SEL/${digits(7)}`
  return { pan, gstin, cin, gemId }
}

const DISCREPANCY_BANK = {
  [STATUS.DISQUALIFIED]: [
    'GSTIN cancelled — returns not filed for 3 consecutive periods',
    'MCA-21 status shows company Struck Off under Section 248',
    'CVC PSU debarment match found on cross-registry sweep',
    'Declared turnover exceeds GSTR-3B ledger by over 40%',
  ],
  [STATUS.HIGH_RISK]: [
    'Udyam MSME scale mismatch vs Plant & Machinery investment on record',
    'Director DIN flagged as disqualified in a separate ROC filing',
    'EPFO ECR filings lapsed for the last quarter',
    'GeM seller rating below acceptable threshold for Stage-1',
  ],
  [STATUS.SCRUTINY]: [
    'Udyam re-registration in progress — category not yet confirmed',
    'Make-in-India content declaration pending source certificate',
    'Minor GSTIN address mismatch vs registered CIN address',
    'EPFO establishment code under transfer between circles',
  ],
  [STATUS.ELIGIBLE]: [
    'No material discrepancy — all registry checks reconciled',
    'Minor formatting variance in GeM ID, auto-corrected on ingestion',
  ],
}

const CHECKLIST_LABELS = [
  'PAN authenticity (CBDT)',
  'GSTIN status & return filing history',
  'MCA-21 corporate standing (ROC)',
  'Director DIN clearance',
  'Udyam MSME scale certificate',
  'EPFO/ESIC establishment compliance',
  'GeM seller debarment cross-check',
  'CVC PSU vigilance database sweep',
  'Make-in-India content certificate',
  'DigiLocker document hash verification',
]

function makeChecklist(status) {
  const failCount = status === STATUS.DISQUALIFIED ? int(1, 2) : 0
  const warnCount =
    status === STATUS.HIGH_RISK ? int(2, 3) : status === STATUS.SCRUTINY ? int(1, 2) : status === STATUS.DISQUALIFIED ? int(1, 2) : 0
  const order = [...CHECKLIST_LABELS.keys()]
  const failIdx = new Set()
  const warnIdx = new Set()
  for (let i = 0; i < failCount; i++) {
    let idx
    do idx = pick(order)
    while (failIdx.has(idx))
    failIdx.add(idx)
  }
  for (let i = 0; i < warnCount; i++) {
    let idx
    do idx = pick(order)
    while (failIdx.has(idx) || warnIdx.has(idx))
    warnIdx.add(idx)
  }
  return CHECKLIST_LABELS.map((label, i) => {
    if (failIdx.has(i)) return { label, status: 'fail', note: 'Discrepancy Found' }
    if (warnIdx.has(i)) return { label, status: 'warning', note: 'Advisory Note' }
    return { label, status: 'pass', note: 'Verified' }
  })
}

function makeContradictions(status, name) {
  if (status === STATUS.ELIGIBLE) return []
  const bank = {
    [STATUS.DISQUALIFIED]: [
      { title: 'GSTN Reconciliation Failure —', description: `${name}'s GSTIN was found cancelled on the GST Common Portal; no GSTR-3B filings on record for the last 3 tax periods, in breach of NIT-882 Clause 4.2.` },
      { title: 'MCA-21 Corporate Standing —', description: `ROC records list the company status as "Struck Off" under Section 248 of the Companies Act, 2013, rendering the bidder ineligible under CVC Procurement Guidelines.` },
    ],
    [STATUS.HIGH_RISK]: [
      { title: 'Udyam Scale Mismatch —', description: `Declared Plant & Machinery investment exceeds the Udyam-certified Micro/Small threshold, putting the claimed EMD exemption under GFR Rule 153 at risk.` },
      { title: 'Director DIN Flag —', description: `One listed director's DIN appears flagged as disqualified in a separate ROC filing, requiring clarification before Stage-2 advancement.` },
    ],
    [STATUS.SCRUTINY]: [
      { title: 'Pending Udyam Re-registration —', description: `The bidder's Udyam category re-registration is in progress; the AI engine cannot yet auto-confirm MSME scale for EMD exemption purposes.` },
    ],
  }
  const source = bank[status] || []
  const count = status === STATUS.DISQUALIFIED ? 2 : 1
  return source.slice(0, count)
}

function makeBidder(slNo, overrides = {}) {
  const status = overrides.status || pick([STATUS.ELIGIBLE, STATUS.SCRUTINY, STATUS.HIGH_RISK, STATUS.DISQUALIFIED])
  const name = overrides.name || makeName()
  const stateCode = pick(STATE_CODES)
  const ids = makeIdentifiers(stateCode)
  const score =
    status === STATUS.ELIGIBLE ? int(82, 99) : status === STATUS.SCRUTINY ? int(60, 79) : status === STATUS.HIGH_RISK ? int(35, 59) : int(5, 34)
  const gstOk = status === STATUS.ELIGIBLE || (status === STATUS.SCRUTINY && rand() > 0.3)
  const mcaOk = status !== STATUS.DISQUALIFIED
  const epfoOk = status === STATUS.ELIGIBLE || status === STATUS.SCRUTINY
  const scale = pick(['Micro', 'Small', 'Medium', 'Not MSME'])
  const id = overrides.id || `BID-882-${String(slNo).padStart(3, '0')}`

  return {
    id,
    slNo,
    name,
    flagged: status === STATUS.DISQUALIFIED || (status === STATUS.HIGH_RISK && rand() > 0.5),
    ...ids,
    dossierId: `CPCL-VIG-2025-${String(slNo).padStart(3, '0')}`,
    confidence: status === STATUS.ELIGIBLE ? 96 + rand() * 3.8 : status === STATUS.SCRUTINY ? 70 + rand() * 15 : 80 + rand() * 15,
    eligibility: { status, score },
    gst: {
      ok: gstOk,
      label: gstOk ? 'Filed & Active' : 'Return Lapse',
      note: gstOk ? '24-month history clean' : 'GSTR-3B pending ≥3 periods',
    },
    mca: { ok: mcaOk, label: mcaOk ? 'Active (ROC Verified)' : 'Struck Off (S.248)' },
    udyam: { scale, emd: scale !== 'Not MSME' ? 'EMD Exempt' : null },
    epfoEsic: { ok: epfoOk, label: epfoOk ? 'ECR Current' : 'ECR Lapsed' },
    makeInIndia: { cls: rand() > 0.4 ? 'Class-1' : 'Class-2', pct: Math.round((40 + rand() * 58) * 10) / 10 },
    discrepancy: pick(DISCREPANCY_BANK[status]),
    action: {
      tone:
        status === STATUS.ELIGIBLE ? 'approve' : status === STATUS.SCRUTINY ? 'query' : status === STATUS.HIGH_RISK ? 'review' : 'blacklist',
      label:
        status === STATUS.ELIGIBLE
          ? 'Approve Stage-1'
          : status === STATUS.SCRUTINY
            ? 'Send Query'
            : status === STATUS.HIGH_RISK
              ? 'Flag for Review'
              : 'Confirm Blacklist',
    },
    checklist: makeChecklist(status),
    contradictions: overrides.contradictions ?? makeContradictions(status, name),
  }
}

// ---- reference bidder: Apex Infra Projects (BID-882-049) --------------
// Mirrors the source dossier this console was designed against.
const APEX_INFRA = makeBidder(49, {
  id: 'BID-882-049',
  name: 'Apex Infra Projects',
  status: STATUS.DISQUALIFIED,
  contradictions: [
    {
      title: 'GSTN Reconciliation Failure —',
      description:
        "Apex Infra Projects' GSTIN was found cancelled (suo-motu) on the GST Common Portal effective 12-Dec-2024; no GSTR-3B return has been filed for the last 3 consecutive tax periods, in direct breach of NIT-882 Clause 4.2 (Statutory Compliance) and the Integrity Pact undertaking submitted at bid stage.",
    },
    {
      title: 'MCA-21 Corporate Standing —',
      description:
        "ROC records list the company's status as 'Struck Off' under Section 248 of the Companies Act, 2013, effective 03-Jan-2025 — three days after Stage-1 technical bid submission — rendering the bidder statutorily ineligible under CVC Procurement Guidelines 2024, Clause 6.1.",
    },
  ],
})
// Force the checklist to show the two hard failures the contradictions describe.
APEX_INFRA.checklist = APEX_INFRA.checklist.map((item, i) =>
  i === 1 || i === 2 ? { ...item, status: 'fail', note: 'Discrepancy Found' } : item,
)
APEX_INFRA.gst = { ok: false, label: 'Cancelled (Suo-Motu)', note: 'GSTR-3B pending 3 periods' }
APEX_INFRA.mca = { ok: false, label: 'Struck Off (S.248)' }
APEX_INFRA.eligibility = { status: STATUS.DISQUALIFIED, score: 12 }
APEX_INFRA.confidence = 98.4
APEX_INFRA.discrepancy = 'GSTIN cancelled & ROC status Struck Off — statutory disqualification'

// ---- assemble the 100-bidder cohort with a fixed status distribution --
const TARGET = { [STATUS.ELIGIBLE]: 62, [STATUS.SCRUTINY]: 12, [STATUS.HIGH_RISK]: 14, [STATUS.DISQUALIFIED]: 12 }
// HIGH_RISK (14) + DISQUALIFIED (12) = 26, matching the "High Risk / Disqualified (26)" filter label.

const statusPool = []
Object.entries(TARGET).forEach(([status, count]) => {
  for (let i = 0; i < count; i++) statusPool.push(status)
})
// Reserve slot 49 for Apex Infra (DISQUALIFIED); remove one DISQUALIFIED from the pool.
statusPool.splice(statusPool.indexOf(STATUS.DISQUALIFIED), 1)
// Shuffle deterministically.
for (let i = statusPool.length - 1; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1))
  ;[statusPool[i], statusPool[j]] = [statusPool[j], statusPool[i]]
}

export const BIDDERS = []
let poolIdx = 0
for (let slNo = 1; slNo <= 100; slNo++) {
  if (slNo === 49) {
    BIDDERS.push(APEX_INFRA)
    continue
  }
  const status = statusPool[poolIdx++]
  BIDDERS.push(makeBidder(slNo, { status }))
}

export function getBidderById(id) {
  return BIDDERS.find((b) => b.id === id)
}

export const STATUS_COUNTS = {
  total: BIDDERS.length,
  eligible: BIDDERS.filter((b) => b.eligibility.status === STATUS.ELIGIBLE).length,
  scrutiny: BIDDERS.filter((b) => b.eligibility.status === STATUS.SCRUTINY).length,
  risk: BIDDERS.filter((b) => b.eligibility.status === STATUS.HIGH_RISK || b.eligibility.status === STATUS.DISQUALIFIED).length,
}
