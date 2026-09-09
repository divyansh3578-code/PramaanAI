const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluateTender } = require('../src/services/compliance.service');

test('compliance rule engine passes valid bidder', () => {
  const tender = { requirements: [
    { field: 'turnover', operator: 'GTE', value: 100, mandatory: true, weight: 50 },
    { field: 'experienceYears', operator: 'GTE', value: 5, mandatory: true, weight: 50 }
  ] };
  const result = evaluateTender(tender, { turnover: 150, experienceYears: 7 }, null);
  assert.equal(result.result, 'PASS');
  assert.equal(result.score, 100);
});

test('compliance rule engine fails mandatory rule', () => {
  const tender = { requirements: [
    { field: 'turnover', operator: 'GTE', value: 100, mandatory: true, weight: 100 }
  ] };
  const result = evaluateTender(tender, { turnover: 50 }, null);
  assert.equal(result.result, 'FAIL');
  assert.equal(result.score, 0);
});
