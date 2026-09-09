async function verifyGST({ gstin, legalName, pan }) {
  // Demo connector. Replace this adapter with the authorized government/API provider.
  if (!gstin) return { status: 'NOT_FOUND', data: {} };
  const active = gstin.length >= 10;
  return { status: active ? 'PASS' : 'FAIL', data: { gstin, legalName, pan, status: active ? 'ACTIVE' : 'INVALID' } };
}
module.exports = { verifyGST };
