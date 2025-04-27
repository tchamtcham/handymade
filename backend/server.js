require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const providerRoutes = require('./routes/provider');
const createAdminIfNotExists = require('./utils/adminSeeder'); // Import the seeder function
const bookingRoutes = require('./routes/bookingRoutes');
const provider = require('./routes/provider');




const app = express();


// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use('/api/bookings', bookingRoutes);


app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  // Create admin if not exists
  createAdminIfNotExists(); // Call the function to create admin after the database connection
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/contact', require('./routes/contact'));
//const subscribeRoute = require('./routes/subscribe');
//app.use('/api/subscribe', subscribeRoute); 
app.use('/api/provider', provider);
app.use('/api/contactPage', require('./routes/contactPage'));

const adminDashboardRoute = require('./routes/adminDashboard');
app.use('/api/admin', adminDashboardRoute);

const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes);

const notificationRoutes = require('./routes/notificationRoutes');
app.use('/notifications', notificationRoutes);


const serviceRoutes = require('./routes/serviceRoutes');
app.use('/api/services', serviceRoutes);


const bookingManagementRoutes = require('./routes/adminSettings');
app.use('/api', bookingManagementRoutes);


const adminSettingsRoutes = require('./routes/adminSettings');
app.use('/admin-settings', adminSettingsRoutes);

// Add this to your server.js



// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
});
