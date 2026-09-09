const express = require('express');
const router = express.Router();
const TenderAnalysis = require('../models/TenderAnalysis');

router.post('/', async (req, res) => {
  try {
    const { tenderRef, fileName, sourceType, pages, docTypeGuess, llmFallback, requirements, needsReview, publishedBy } = req.body;

    if (!tenderRef || !Array.isArray(requirements) || requirements.length === 0) {
      return res.status(400).json({ message: 'tenderRef and a non-empty requirements[] array are required' });
    }

    const doc = await TenderAnalysis.create({
      tenderRef, fileName, sourceType, pages, docTypeGuess, llmFallback,
      requirements,
      needsReview: needsReview || [],
      publishedBy: req.user?._id || publishedBy,
    });

    res.status(201).json({ tenderAnalysis: doc });
  } catch (err) {
    console.error('Failed to publish tender analysis:', err);
    res.status(500).json({ message: 'Could not save the requirement matrix' });
  }
});

router.get('/:tenderRef', async (req, res) => {
  try {
    const docs = await TenderAnalysis.find({ tenderRef: req.params.tenderRef }).sort({ createdAt: -1 });
    res.json({ tenderAnalyses: docs });
  } catch (err) {
    console.error('Failed to fetch tender analyses:', err);
    res.status(500).json({ message: 'Could not load tender analyses' });
  }
});

module.exports = router;