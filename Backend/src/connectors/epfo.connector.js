async function verifyEPFO({ epfoCode, legalName }) {
  // Demo connector. Replace this adapter with the authorized EPFO/ESIC unified portal integration.
  if (!epfoCode) return { status: 'NOT_FOUND', data: {} };
  const active = epfoCode.length >= 8;
  return { status: active ? 'PASS' : 'FAIL', data: { epfoCode, legalName, status: active ? 'ECR_CURRENT' : 'ECR_LAPSED' } };
}
module.exports = { verifyEPFO };
