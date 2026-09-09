// Mock shape of what the ML pipeline (tender_analyzer / cli.py) will eventually
// return from a real endpoint, e.g. POST /api/tenders/:id/analyze.
// Swap `analyzeTenderMock()` in TenderAnalysisUpload.jsx for a real
// `api.analyzeTender(file)` call once the Python service is wired in — the
// shape below is exactly what that response should match.

export const CATEGORY_META = {
  financial: { label: 'Financial', icon: 'payments', text: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200', dot: 'bg-sky-500' },
  experience: { label: 'Experience', icon: 'workspace_premium', text: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200', dot: 'bg-violet-500' },
  safety: { label: 'Safety', icon: 'health_and_safety', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-500' },
  legal: { label: 'Legal', icon: 'gavel', text: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-300', dot: 'bg-slate-500' },
  eligibility: { label: 'Eligibility', icon: 'checklist', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
}

export const MOCK_TENDER_ANALYSIS = {
  meta: {
    fileName: 'tsttender.pdf',
    sourceType: 'digital_pdf',
    pages: 9,
    docTypeGuess: 'tender',
    llmFallback: 'configured',
    llmCalls: 1,
  },
  requirements: [
    { id: 'REQ-0001', category: 'financial', mandatory: true, method: 'regex', confidence: 0.95, statement: 'Average Annual Turnover >= 250000.0 INR', source: 'Minimum Average Annual Turnover of the 2.5 Lakh' },
    { id: 'REQ-0002', category: 'financial', mandatory: true, method: 'regex', confidence: 0.97, statement: 'EMD == 12750.0 INR', source: 'EMD Amount 12750' },
    { id: 'REQ-0003', category: 'financial', mandatory: true, method: 'regex', confidence: 0.97, statement: 'ePBG / Performance Security == 5.0 %', source: 'ePBG Percentage(%) 5.00' },
    { id: 'REQ-0004', category: 'financial', mandatory: true, method: 'regex', confidence: 0.96, statement: 'ePBG Duration == 14.0 months', source: 'Duration of ePBG 14 required (Months)' },
    { id: 'REQ-0005', category: 'experience', mandatory: true, method: 'regex', confidence: 0.93, statement: 'Similar Service / Work Domain contains RO/Water Purification Systems and/or Water Coolers', source: 'successfully completed similar CMC/AMC work for RO/Water Purification Systems and/or Water Coolers ...' },
    { id: 'REQ-0006', category: 'experience', mandatory: true, method: 'regex', confidence: 0.96, statement: 'Similar Service Experience >= 5.0 year', source: 'Years of Past Experience Required for 5 Year(s) same/similar service' },
    { id: 'REQ-0007', category: 'experience', mandatory: true, method: 'regex', confidence: 0.96, statement: 'Similar Completed Works (3) >= 40.0 % of estimated cost', source: 'Three similar completed services costing not less than the amount equal to 40% (forty percent) of th...' },
    { id: 'REQ-0008', category: 'experience', mandatory: true, method: 'regex', confidence: 0.96, statement: 'Similar Completed Works (2) >= 50.0 % of estimated cost', source: 'Two similar completed services costing not less than the amount equal to 50% (fifty percent) of the ...' },
    { id: 'REQ-0009', category: 'experience', mandatory: true, method: 'regex', confidence: 0.96, statement: 'Similar Completed Works (1) >= 80.0 % of estimated cost', source: 'One similar completed service costing not less than the amount equal to 80% (eighty percent) of the ...' },
    { id: 'REQ-0010', category: 'safety', mandatory: true, method: 'regex', confidence: 0.90, statement: 'Product Safety contains nontoxic', source: 'Products supplied shall be nontoxic and harmless to health. In the case of toxic materials, Material...' },
    { id: 'REQ-0011', category: 'legal', mandatory: true, method: 'regex', confidence: 0.90, statement: 'Contract Assignment/Subcontracting contains assign', source: 'The Seller shall not assign the Contract in whole or part without obtaining the prior written consen...' },
    { id: 'REQ-0012', category: 'legal', mandatory: true, method: 'regex', confidence: 0.90, statement: 'Contract Assignment/Subcontracting contains sub-contract', source: 'The Seller shall not sub-contract the Contract in whole or part to any entity without obtaining the ...' },
    { id: 'REQ-0013', category: 'eligibility', mandatory: true, method: 'regex', confidence: 0.93, statement: 'Service Provider Office Location present — Office location as specified in tender', source: 'AVAILABILITY OF OFFICE OF SERVICE PROVIDER: An office of the Service Provider must be located in the' },
    { id: 'REQ-0014', category: 'eligibility', mandatory: true, method: 'regex', confidence: 0.96, statement: 'Dedicated / Toll-Free Support Number present', source: 'Dedicated /toll-free Telephone No. for Service Support: BIDDER/OEM must have Dedicated/toll-free' },
    { id: 'REQ-0015', category: 'eligibility', mandatory: true, method: 'regex', confidence: 0.96, statement: 'Escalation Matrix present — Service support escalation matrix', source: 'Escalation Matrix For Service Support: Bidder/OEM must provide Escalation Matrix of Telephone Numbe...' },
    { id: 'REQ-0016', category: 'experience', mandatory: true, method: 'regex', confidence: 0.96, statement: 'Minimum Similar Work Value >= 250000.0 INR', source: 'The bidder should have successfully completed at least one similar work of minimum value of Rs. 2.50...' },
    { id: 'REQ-0017', category: 'eligibility', mandatory: true, method: 'regex', confidence: 0.96, statement: 'Service Availability contains 24x7', source: 'The Bidder should be in a position to offer 24x7 seamless services as per requirement of the Institu...' },
    { id: 'REQ-0018', category: 'eligibility', mandatory: true, method: 'regex', confidence: 0.96, statement: 'Blacklisting Status != Must not be blacklisted', source: 'The Bidder should not have been blacklisted by any Government Department / PSU / Bank / Central Aut...' },
    { id: 'REQ-0019', category: 'financial', mandatory: true, method: 'llm', confidence: 1.0, statement: 'Average Annual Turnover >= 2.5 INR (Cr)', source: 'GENERAL ELIGIBILITY CRITERIA - 2' },
    { id: 'REQ-0020', category: 'experience', mandatory: true, method: 'llm', confidence: 1.0, statement: 'Years of Past Experience >= 5.0 Years', source: 'Years of Past Experience Required' },
    { id: 'REQ-0021', category: 'experience', mandatory: true, method: 'llm', confidence: 1.0, statement: 'Similar Completed Service >= 2.5 INR (Cr)', source: 'GENERAL ELIGIBILITY CRITERIA - 3' },
    { id: 'REQ-0022', category: 'experience', mandatory: true, method: 'llm', confidence: 1.0, statement: 'Past Experience of Similar Services (Option 1) >= 40.0 %', source: 'Past Experience of Similar Services - Point 1' },
    { id: 'REQ-0023', category: 'experience', mandatory: true, method: 'llm', confidence: 1.0, statement: 'Past Experience of Similar Services (Option 2) >= 50.0 %', source: 'Past Experience of Similar Services - Point 2' },
    { id: 'REQ-0024', category: 'experience', mandatory: true, method: 'llm', confidence: 1.0, statement: 'Past Experience of Similar Services (Option 3) >= 80.0 %', source: 'Past Experience of Similar Services - Point 3' },
    { id: 'REQ-0025', category: 'eligibility', mandatory: true, method: 'llm', confidence: 1.0, statement: 'Office Location present', source: 'Service & Support - Point 5' },
    { id: 'REQ-0026', category: 'legal', mandatory: true, method: 'llm', confidence: 1.0, statement: 'Blacklisting Status != Blacklisted', source: 'GENERAL ELIGIBILITY CRITERIA - 5' },
    { id: 'REQ-0027', category: 'financial', mandatory: true, method: 'llm', confidence: 1.0, statement: 'EMD == 12750.0 INR', source: 'EMD Detail' },
    { id: 'REQ-0028', category: 'financial', mandatory: true, method: 'llm', confidence: 1.0, statement: 'ePBG == 5.0 %', source: 'ePBG Detail' },
  ],
  needsReview: [
    {
      text: 'The period shall be extendable by another 24 Months (2 Year) with each extension of 1 Year duration OR decided by Competent Authority on same terms & conditions subject to appraisal & performance review by the Institute Authorities.',
    },
  ],
}