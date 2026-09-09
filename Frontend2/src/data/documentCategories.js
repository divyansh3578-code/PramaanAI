// Category definitions for the Document Repository page. Split by role:
// officers publish tender-side documents, bidders submit compliance docs
// that feed the statutory checklist shown in DisqualificationDossier.

export const TENDER_DOCUMENT_CATEGORIES = [
  {
    id: 'nit',
    title: 'Notice Inviting Tender (NIT)',
    icon: 'assignment',
    required: true,
    hint: 'Master NIT document, signed & DSC-sealed',
    existing: [{ name: 'NIT-882-Master-Document.pdf', date: '18-Jan-2025' }],
  },
  {
    id: 'corrigendum',
    title: 'Corrigendum / Addendum',
    icon: 'edit_note',
    required: false,
    hint: 'Amendments issued after publication',
    existing: [],
  },
  {
    id: 'boq',
    title: 'Bill of Quantities (BOQ)',
    icon: 'request_quote',
    required: true,
    hint: 'Priced & unpriced BOQ',
    existing: [{ name: 'NIT-882-BOQ-Unpriced.xlsx', date: '18-Jan-2025' }],
  },
  {
    id: 'techspec',
    title: 'Technical Specifications',
    icon: 'engineering',
    required: true,
    hint: 'Piping & vessel technical spec package',
    existing: [{ name: 'NIT-882-TechSpec-PackageIV.pdf', date: '18-Jan-2025' }],
  },
  {
    id: 'drawings',
    title: 'Reference Drawings (GA / P&ID)',
    icon: 'architecture',
    required: false,
    hint: 'General arrangement & P&ID drawings',
    existing: [],
  },
  {
    id: 'integrity-pact',
    title: 'Integrity Pact & IEM Panel',
    icon: 'handshake',
    required: true,
    hint: 'Signed Integrity Pact template',
    existing: [{ name: 'NIT-882-Integrity-Pact.pdf', date: '18-Jan-2025' }],
  },
]

export const BIDDER_DOCUMENT_CATEGORIES = [
  { id: 'pan', title: 'PAN Card', icon: 'badge', required: true, hint: 'CBDT-issued PAN, bidder entity' },
  { id: 'gst', title: 'GST Registration Certificate', icon: 'receipt_long', required: true, hint: 'GSTIN registration certificate' },
  { id: 'coi', title: 'MCA-21 Certificate of Incorporation', icon: 'apartment', required: true, hint: 'ROC-issued COI / CIN proof' },
  { id: 'udyam', title: 'Udyam MSME Registration', icon: 'storefront', required: false, hint: 'For EMD exemption claims only' },
  { id: 'epfo', title: 'EPFO / ESIC Registration', icon: 'shield_person', required: true, hint: 'Establishment code proof' },
  { id: 'itr', title: 'Income Tax Returns (Last 3 AY)', icon: 'account_balance', required: true, hint: 'ITR acknowledgement, FY22–FY25' },
  { id: 'gem', title: 'GeM Seller Profile Extract', icon: 'hub', required: true, hint: 'Seller rating & fulfilment history' },
  { id: 'techbid', title: 'Technical Bid Dossier', icon: 'folder_zip', required: true, hint: 'Complete technical proposal set' },
]
