// The four connectors surfaced on the main Evaluation Matrix dashboard.
export const PRIMARY_CONNECTORS = [
  {
    id: 'gstn',
    code: 'GSTN',
    name: 'GSTN Gateway',
    endpoint: 'api.gst.gov.in/taxpayer',
    status: 'Active',
    sla: '99.98% SLA',
    description:
      'Automated validation of GSTIN status, 24-month return filing history (GSTR-3B / GSTR-1), and reconciliation of declared annual turnover vs ledger.',
    stats: [
      { label: 'Latency:', value: '118ms' },
      { label: 'Protocol:', value: 'TLS 1.3 / REST v2' },
    ],
    badgeClass: 'bg-navy text-white',
  },
  {
    id: 'udyam',
    code: 'UDY',
    name: 'Udyam MSME Registry',
    endpoint: 'udyamregistration.gov.in',
    status: 'Active',
    description:
      'Live enterprise scale categorization (Micro, Small, Medium), Plant & Machinery investment threshold audit, and EMD exemption entitlement check.',
    stats: [
      { label: 'Authority:', value: 'Min of MSME' },
      { label: 'EMD Check:', value: 'GFR Rule 153', accent: true },
    ],
    badgeClass: 'bg-saffron text-black',
  },
  {
    id: 'mca21',
    code: 'MCA',
    name: 'MCA-21 ROC Database',
    endpoint: 'mca.gov.in/v3/company',
    status: 'Active',
    description:
      'Real-time ROC ledger sync for CIN, Corporate Standing (Active vs Struck-off), Director Identification Numbers (DIN), and CVC PSU debarment cross-match.',
    stats: [
      { label: 'Sync Mode:', value: 'T+0 Real-Time' },
      { label: 'DIN Watch:', value: 'Clear', accent: true },
    ],
    badgeClass: 'bg-navy text-white',
  },
  {
    id: 'epfo-esic',
    code: 'EPF',
    name: 'EPFO / ESIC Unified',
    endpoint: 'epfindia.gov.in/ecr',
    status: 'Active',
    description:
      'Validation of establishment registration code, Electronic Challan Receipt (ECR) monthly filing regularity, and labor welfare compliance for refinery onsite works.',
    stats: [
      { label: 'ECR Status:', value: 'Jan-2025 Verified' },
      { label: 'Coverage:', value: 'Labour Codes 2020' },
    ],
    badgeClass: 'bg-emerald-700 text-white',
  },
]

// Extended statutory bridge network — surfaced on the Statutory Bridges page,
// covering the full cross-verification universe named in the problem brief.
export const ALL_CONNECTORS = [
  ...PRIMARY_CONNECTORS,
  {
    id: 'gem',
    code: 'GeM',
    name: 'GeM Seller Directory',
    endpoint: 'gem.gov.in/sellers',
    status: 'Active',
    description:
      'Seller performance rating, order fulfilment history, and cross-check of GeM debarment / suspension notices before Stage-1 shortlisting.',
    stats: [
      { label: 'Sync Mode:', value: 'T+0 Real-Time' },
      { label: 'Rating Watch:', value: 'Enabled' },
    ],
    badgeClass: 'bg-navy text-white',
  },
  {
    id: 'sap-erp',
    code: 'SAP',
    name: 'CPCL SAP ERP Bridge',
    endpoint: 'sap-erp.cpcl.internal/matrl',
    status: 'Active',
    description:
      'Internal vendor master reconciliation — prior work order history, payment holds, and material rejection flags from CPCL plant maintenance records.',
    stats: [
      { label: 'Module:', value: 'MM / SRM' },
      { label: 'Access:', value: 'Internal VPN' },
    ],
    badgeClass: 'bg-connector text-white',
  },
  {
    id: 'digilocker',
    code: 'DL',
    name: 'DigiLocker Document Bridge',
    endpoint: 'digilocker.gov.in/verify',
    status: 'Active',
    description:
      'Cryptographic authenticity check of uploaded certificates against issuer-signed originals held in DigiLocker, flagging tampered or obsolete printouts.',
    stats: [
      { label: 'Issuer Sync:', value: 'CBSE / MCA / GST' },
      { label: 'Hash Check:', value: 'SHA-256' },
    ],
    badgeClass: 'bg-connector text-white',
  },
  {
    id: 'nsic',
    code: 'NSIC',
    name: 'NSIC Registration Registry',
    endpoint: 'nsicspronline.com/registry',
    status: 'Desynced',
    description:
      'Single Point Registration Scheme (SPRS) validation for EMD / tender-fee exemption claims raised by small-scale bidders.',
    stats: [
      { label: 'Last Sync:', value: '2 hrs ago' },
      { label: 'Retry:', value: 'Scheduled' },
    ],
    badgeClass: 'bg-amber-600 text-white',
  },
  {
    id: 'startup-dpiit',
    code: 'DPIIT',
    name: 'Startup India / DPIIT',
    endpoint: 'startupindia.gov.in/dpiit',
    status: 'Active',
    description:
      'Recognition certificate validation for Startup India exemptions on turnover / prior-experience criteria under Public Procurement policy.',
    stats: [
      { label: 'Scheme:', value: 'DPIIT Recognition' },
      { label: 'EMD Waiver:', value: 'Rule 170(iv)' },
    ],
    badgeClass: 'bg-verdigris text-white',
  },
  {
    id: 'income-tax',
    code: 'ITR',
    name: 'Income Tax / CBDT (PAN)',
    endpoint: 'incometax.gov.in/pan-verify',
    status: 'Active',
    description:
      'PAN authenticity and ITR acknowledgement number cross-check for the last three assessment years declared in the financial bid.',
    stats: [
      { label: 'Authority:', value: 'CBDT' },
      { label: 'AY Coverage:', value: 'FY22 – FY25' },
    ],
    badgeClass: 'bg-navy text-white',
  },
  {
    id: 'bis',
    code: 'BIS',
    name: 'BIS Product Certification',
    endpoint: 'bis.gov.in/cert-search',
    status: 'Active',
    description:
      'Verification of ISI / BIS product certification numbers cited against ASME and piping-grade material test certificates.',
    stats: [
      { label: 'Scheme:', value: 'ISI Mark' },
      { label: 'Scope:', value: 'Piping & Vessels' },
    ],
    badgeClass: 'bg-teal text-white',
  },
]

export const CONNECTOR_STATUS_STYLES = {
  Active: { dot: 'bg-emerald-600', text: 'text-emerald-800', bg: 'bg-emerald-100' },
  Desynced: { dot: 'bg-amber-500', text: 'text-amber-800', bg: 'bg-amber-100' },
  Halted: { dot: 'bg-rose-600', text: 'text-rose-800', bg: 'bg-rose-100' },
}
