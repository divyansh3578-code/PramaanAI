const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { corsOrigin } = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const tenderRoutes = require('./routes/tender.routes');
const bidderRoutes = require('./routes/bidder.routes');
const documentRoutes = require('./routes/document.routes');
const verificationRoutes = require('./routes/verification.routes');
const auditRoutes = require('./routes/audit.routes');
const grievanceRoutes = require('./routes/grievance.routes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
app.use(helmet());
app.use(cors({ origin: corsOrigin === '*' ? true : corsOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get('/health', (_req, res) => res.json({ success: true, service: 'sih-procurement-backend', time: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/bidders', bidderRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/grievances', grievanceRoutes);

app.use(notFound);
app.use(errorHandler);
module.exports = app;
