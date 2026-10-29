const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./db/database');

const authRoutes = require('./routes/auth');
const academicsRoutes = require('./routes/academics');
const noticesRoutes = require('./routes/notices');
const eventsRoutes = require('./routes/events');
const clubsRoutes = require('./routes/clubs');
const lostfoundRoutes = require('./routes/lostfound');
const marketplaceRoutes = require('./routes/marketplace');
const opportunitiesRoutes = require('./routes/opportunities');
const utilitiesRoutes = require('./routes/utilities');
const notificationsRoutes = require('./routes/notifications');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize database schema and seeds
initDatabase();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/academics', academicsRoutes);
app.use('/api/notices', noticesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/clubs', clubsRoutes);
app.use('/api/lostfound', lostfoundRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/utilities', utilitiesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Campus 360 Relational SQL Backend Operational',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Campus 360 SQL Backend running at: http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});
