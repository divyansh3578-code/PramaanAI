async function verifyMCA({ pan, legalName }) {
  if (!pan) return { status: 'NOT_FOUND', data: {} };
  return { status: pan.length >= 5 ? 'PASS' : 'FAIL', data: { pan, legalName, status: 'MATCHED' } };
}
module.exports = { verifyMCA };
