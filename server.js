const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(cors());
// --- STEP 1: MIDDLEWARE (Must be BEFORE routes) ---
app.use(express.json()); // This parses incoming JSON
app.use(express.urlencoded({ extended: true })); // This parses form-data

// --- STEP 2: ROUTES ---
const authRoutes = require('./routes/auth');
const trip = require('./routes/trips');
app.use('/api/auth', authRoutes);
app.use('/api/trips', trip);

// --- STEP 3: DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.log('❌ DB Error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));