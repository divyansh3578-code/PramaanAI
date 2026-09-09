function assessRisk({ compliance, verification, bidder }) {
  let score = 100;
  const factors = [];
  const subtract = (points, type, reason) => {
    score -= points;
    factors.push({ type, points: -points, reason });
  };
  if (compliance.result === 'FAIL') subtract(35, 'COMPLIANCE_FAIL', 'One or more mandatory requirements failed');
  else if (compliance.result === 'REVIEW') subtract(15, 'COMPLIANCE_REVIEW', 'Bid requires manual review');
  if (!verification.identityMatch) subtract(30, 'IDENTITY_MISMATCH', 'Identity information differs across verification sources');
  if (bidder.experienceYears < 1) subtract(10, 'LOW_EXPERIENCE', 'Very limited declared experience');
  if (bidder.turnover <= 0) subtract(10, 'TURNOVER_MISSING', 'Turnover is missing or zero');
  score = Math.max(0, Math.min(100, score));
  const level = score >= 80 ? 'LOW' : score >= 60 ? 'MEDIUM' : 'HIGH';
  return { score, level, factors };
}

module.exports = { assessRisk };
