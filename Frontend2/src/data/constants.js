export const ORG = {
  nameHi: 'चेन्नई पेट्रोलियम कॉर्पोरेशन लिमिटेड (सीपीसीएल)',
  nameEn: 'Chennai Petroleum Corporation Limited (CPCL)',
  tagline: 'A Govt. of India Enterprise | Group Company of IndianOil | Manali, Chennai-600068',
  cin: 'L40101TN1965GOI005389',
  ministryHi: 'पेट्रोलियम एवं प्राकृतिक गैस मंत्रालय',
  ministryEn: 'Ministry of Petroleum & Natural Gas',
}

export const TENDER = {
  ref: 'CPCL/ENGG/2025/NIT-882',
  title: 'Manali Refinery Expansion Package IV',
  nitId: 'NIT-882',
  nitLabel: 'NIT-882 (Package IV Piping)',
  nicNode: 'SR-TN-MAA-04',
  approvedBudget: '₹420.00 Cr',
  totalBids: 100,
}

export const OFFICER = {
  name: 'Shri R. Venkatesh',
  role: 'Chief Vigilance & Procurement Officer',
  dscStatus: 'Class-3 DSC Verified (e-Token Active)',
  dscCertificate: 'CPCL-VIG-TOKEN-CLASS3',
}

// `roles` restricts a nav item to signed-in users of that role; omit it (or
// leave empty) for items visible to everyone, signed in or not.
export const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/tender-notices', label: 'Tender NIT Notices', icon: 'assignment' },
  { to: '/evaluation-matrix', label: 'E-Procurement Evaluation Matrix (100 Bids)', icon: 'fact_check', roles: ['OFFICER'] },
  { to: '/documents', label: 'Document Repository', icon: 'folder_open' },
  { to: '/statutory-bridges', label: 'Statutory Bridges (GSTN/MCA/Udyam)', icon: 'hub', roles: ['OFFICER'] },
  { to: '/disqualification-ledger', label: 'CVC Disqualification Ledger', icon: 'rule', roles: ['OFFICER'] },
  { to: '/gem-incident-log', label: 'GeM Incident Log', icon: 'storefront', roles: ['OFFICER'] },
  { to: '/rti-grievance', label: 'RTI & Grievance', icon: 'balance' },
]

export const STATUS_FILTERS = [
  { value: 'ALL', label: 'Status: All 100 Bids' },
  { value: 'ELIGIBLE', label: 'Statutory Eligible (62)' },
  { value: 'RISK', label: 'High Risk / Disqualified (26)' },
  { value: 'SCRUTINY', label: 'Manual Scrutiny (12)' },
]

export const PIPELINE_STAGES = [
  { icon: 'person_pin', title: 'CPCL Procurement Desk', subtitle: 'Tender Induction NIT-882' },
  { icon: 'input', title: 'GeM/CPPP Ingestion', subtitle: '100 Encrypted Dossiers' },
  { icon: 'psychology', title: 'AI Statutory OCR & Vision', subtitle: 'Table Parser • Clause Reconciler', active: true },
  { icon: 'hub', title: 'Govt Registry Bridges', subtitle: 'GSTN • MCA21 • EPFO • Udyam' },
  { icon: 'policy', title: 'NIT Statutory Filter', subtitle: 'Turnover & MII Evaluation' },
  { icon: 'verified_user', title: 'Class-3 DSC Approval Gate', subtitle: 'e-Token Cryptographic Seal', accent: true },
]
