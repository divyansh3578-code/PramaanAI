const Verification = require('../models/Verification');
const { verifyGST } = require('../connectors/gst.connector');
const { verifyUdyam } = require('../connectors/udyam.connector');
const { verifyMCA } = require('../connectors/mca.connector');
const { verifyEPFO } = require('../connectors/epfo.connector');

async function verifyBidder(bidder) {
  const [gst, udyam, mca, epfo] = await Promise.all([
    verifyGST(bidder), verifyUdyam(bidder), verifyMCA(bidder), verifyEPFO(bidder)
  ]);

  const pans = [];
  if (bidder.pan) pans.push(['submitted', bidder.pan]);
  if (gst.data?.pan) pans.push(['gst', gst.data.pan]);
  if (mca.data?.pan) pans.push(['mca', mca.data.pan]);
  const distinctPans = new Set(pans.map(([, value]) => value));
  const identityMatch = distinctPans.size <= 1;
  const anomalies = identityMatch ? [] : [{ severity: 'HIGH', type: 'IDENTITY_MISMATCH', message: 'PAN mismatch across sources' }];

  return Verification.create({
    bidder: bidder._id,
    checks: [
      { source: 'GST', ...gst },
      { source: 'UDYAM', ...udyam },
      { source: 'MCA', ...mca },
      { source: 'EPFO', ...epfo }
    ],
    identityMatch,
    anomalies
  });
}

module.exports = { verifyBidder };
