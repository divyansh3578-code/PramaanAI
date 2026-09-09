async function verifyUdyam({ udyamNo, legalName }) {
  if (!udyamNo) return { status: 'NOT_FOUND', data: {} };
  return { status: udyamNo.length >= 5 ? 'PASS' : 'FAIL', data: { udyamNo, legalName, status: 'VALID' } };
}
module.exports = { verifyUdyam };
