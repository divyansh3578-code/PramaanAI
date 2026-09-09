function getValue(bidder, field, verification) {
  if (field === 'gstStatus') return verification?.checks?.find(c => c.source === 'GST')?.status;
  if (field === 'udyamStatus') return verification?.checks?.find(c => c.source === 'UDYAM')?.status;
  if (field === 'mcaStatus') return verification?.checks?.find(c => c.source === 'MCA')?.status;
  if (field === 'epfoStatus') return verification?.checks?.find(c => c.source === 'EPFO')?.status;
  return bidder[field];
}

function compare(actual, operator, expected) {
  switch (operator) {
    case 'EQ': return actual === expected;
    case 'NEQ': return actual !== expected;
    case 'GT': return Number(actual) > Number(expected);
    case 'GTE': return Number(actual) >= Number(expected);
    case 'LT': return Number(actual) < Number(expected);
    case 'LTE': return Number(actual) <= Number(expected);
    case 'EXISTS': return actual !== undefined && actual !== null && actual !== '';
    default: return false;
  }
}

function evaluateTender(tender, bidder, verification) {
  const checks = tender.requirements.map(rule => {
    const actual = getValue(bidder, rule.field, verification);
    const passed = compare(actual, rule.operator, rule.value);
    return {
      field: rule.field,
      passed,
      mandatory: rule.mandatory,
      weight: rule.weight,
      expected: rule.value,
      actual,
      reason: passed ? 'Requirement satisfied' : 'Requirement not satisfied'
    };
  });

  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0) || 1;
  const score = Math.round(checks.reduce((sum, c) => sum + (c.passed ? c.weight : 0), 0) / totalWeight * 100);
  const mandatoryFailed = checks.some(c => c.mandatory && !c.passed);
  return { result: mandatoryFailed ? 'FAIL' : score === 100 ? 'PASS' : 'REVIEW', score, checks };
}

module.exports = { evaluateTender };
