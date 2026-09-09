// One-shot seed script. Run with: npm run seed
// Creates a procurement officer login, the NIT-882 tender, a cohort of sample
// bidders (including one deliberately-disqualified reference bidder), and runs
// verification/compliance/risk for each so the dashboards have real data on
// first load.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Bidder = require('./models/Bidder');
const Tender = require('./models/Tender');
const Bid = require('./models/Bid');
const Compliance = require('./models/Compliance');
const RiskAssessment = require('./models/RiskAssessment');
const { verifyBidder } = require('./services/verification.service');
const { evaluateTender } = require('./services/compliance.service');
const { assessRisk } = require('./services/risk.service');

const SAMPLE_BIDDERS = [
  { legalName: 'Apex Infra Projects', pan: 'AAACA1234A', gstin: '', cin: 'U45201TN1998PLC012345', gemSellerId: 'GEM/SEL/1000001', epfoCode: '', udyamScale: 'Not MSME', turnover: 8500000, experienceYears: 12, makeInIndiaClass: 'Class-1', makeInIndiaPercent: 62 },
  { legalName: 'Sterling Engineering Works', pan: 'AAACS5678B', gstin: '33AAACS5678B1Z5', cin: 'U29100TN2005PLC054321', gemSellerId: 'GEM/SEL/1000002', epfoCode: 'TNMAS0001234000', udyamScale: 'Small', turnover: 42000000, experienceYears: 18, makeInIndiaClass: 'Class-1', makeInIndiaPercent: 78 },
  { legalName: 'Coromandel Pipelines Ltd', pan: 'AAACC9012C', gstin: '33AAACC9012C1Z5', cin: 'U27310TN2010PLC067890', gemSellerId: 'GEM/SEL/1000003', epfoCode: 'TNMAS0005678000', udyamScale: 'Medium', turnover: 210000000, experienceYears: 22, makeInIndiaClass: 'Class-2', makeInIndiaPercent: 45 },
  { legalName: 'Trident Fabricators', pan: 'AAACT3456D', gstin: '33AAACT3456D1Z5', cin: 'U28920TN2012PLC034567', gemSellerId: 'GEM/SEL/1000004', epfoCode: 'TNMAS0009012000', udyamScale: 'Micro', turnover: 6000000, experienceYears: 6, makeInIndiaClass: 'Class-1', makeInIndiaPercent: 55 },
  { legalName: 'Meridian Process Engineers', pan: 'AAACM7890E', gstin: '33AAACM7890E1Z5', cin: '', gemSellerId: 'GEM/SEL/1000005', epfoCode: '', udyamScale: null, turnover: 15000000, experienceYears: 9, makeInIndiaClass: null, makeInIndiaPercent: null }
];

async function run() {
  await connectDB();

  let officer = await User.findOne({ email: 'officer@cpcl.gov.in' });
  if (!officer) {
    const passwordHash = await bcrypt.hash('ChangeMe123!', 12);
    officer = await User.create({ name: 'Shri R. Venkatesh', email: 'officer@cpcl.gov.in', passwordHash, role: 'ADMIN' });
    console.log('Created officer login: officer@cpcl.gov.in / ChangeMe123!');
  }

  let tender = await Tender.findOne({ referenceNo: 'CPCL/ENGG/2025/NIT-882' });
  if (!tender) {
    tender = await Tender.create({
      title: 'Manali Refinery Expansion Package IV',
      referenceNo: 'CPCL/ENGG/2025/NIT-882',
      description: 'Piping & vessel package for the Manali Refinery Expansion Project.',
      deadline: new Date('2026-03-31'),
      nicNode: 'SR-TN-MAA-04',
      approvedBudget: 4200000000,
      status: 'PUBLISHED',
      requirements: [
        { field: 'gstStatus', operator: 'EQ', value: 'PASS', mandatory: true, weight: 20 },
        { field: 'mcaStatus', operator: 'EQ', value: 'PASS', mandatory: true, weight: 20 },
        { field: 'epfoStatus', operator: 'EQ', value: 'PASS', mandatory: false, weight: 15 },
        { field: 'turnover', operator: 'GTE', value: 5000000, mandatory: true, weight: 25 },
        { field: 'experienceYears', operator: 'GTE', value: 3, mandatory: true, weight: 20 }
      ],
      createdBy: officer._id
    });
    console.log('Created tender:', tender.referenceNo);
  }

  for (const sample of SAMPLE_BIDDERS) {
    let bidder = await Bidder.findOne({ legalName: sample.legalName });
    if (!bidder) {
      bidder = await Bidder.create(sample);
      console.log('Created bidder:', bidder.legalName);
    }

    let bid = await Bid.findOne({ tender: tender._id, bidder: bidder._id });
    if (bid) continue; // already evaluated

    const verification = await verifyBidder(bidder);
    const complianceData = evaluateTender(tender, bidder, verification);
    bid = await Bid.create({ tender: tender._id, bidder: bidder._id, status: 'PROCESSING' });
    const compliance = await Compliance.create({ bid: bid._id, ...complianceData });
    const riskData = assessRisk({ compliance: complianceData, verification, bidder });
    const risk = await RiskAssessment.create({ bid: bid._id, ...riskData });
    bid.status = risk.level === 'HIGH' ? 'FLAGGED' : 'COMPLETED';
    await bid.save();
    console.log(`Evaluated ${bidder.legalName}: compliance=${compliance.result} risk=${risk.level}`);
  }

  console.log('Seed complete.');
  await mongoose.disconnect();
}

run().catch(err => { console.error('Seed failed:', err); process.exit(1); });
