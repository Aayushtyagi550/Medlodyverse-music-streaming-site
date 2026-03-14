require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const musicRoutes = require('./routes/music');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: '*', // Allow all for now to debug, can restrict later
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Fallback routes for misconfigured frontends
app.use('/auth', authRoutes);
app.use('/music', musicRoutes);
app.use('/admin', adminRoutes);
app.use('/public', publicRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'MelodyVerse API is running 🎵' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🎵 MelodyVerse Server running on port ${PORT}`);
});
