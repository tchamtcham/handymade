// routes/Provider.js

const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/providers');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// POST /api/providers/register
// Create a new provider, with file uploads for idPhoto, selfiePhoto, profilePhoto
router.post(
  '/register', 
  upload.fields([
    { name: 'idPhoto', maxCount: 1 },
    { name: 'selfiePhoto', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 }
  ]), 
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        phone,
        dob,
        address,
        city,
        zip,
        services,
        otherSkills,
        experience,
        availability,
        serviceAreas,
        bio,
        terms,
        communications
      } = req.body;

      // File paths
      const idPhoto       = req.files?.idPhoto      ? req.files.idPhoto[0].path      : null;
      const selfiePhoto   = req.files?.selfiePhoto  ? req.files.selfiePhoto[0].path  : null;
      const profilePhoto  = req.files?.profilePhoto ? req.files.profilePhoto[0].path : null;

      // Parse array fields if sent as JSON strings
      const servicesArray     = typeof services === 'string'     ? JSON.parse(services)     : services     || [];
      const serviceAreasArray = typeof serviceAreas === 'string' ? JSON.parse(serviceAreas) : serviceAreas || [];
      const communicationsArr  = communications ? ['email','sms'] : [];

      // Create and save
      const newProvider = new Provider({
        firstName,
        lastName,
        email,
        password,
        phone,
        dob,
        address,
        city,
        zip,
        idPhoto,
        selfiePhoto,
        profilePhoto,
        services: servicesArray,
        otherSkills,
        experience,
        availability,
        serviceAreas: serviceAreasArray,
        bio,
        terms,
        communications: communicationsArr
      });

      await newProvider.save();

      res.status(201).json({
        message: 'Provider registered successfully!',
        provider: newProvider
      });
    } catch (error) {
      console.error('Provider register error:', error);
      res.status(500).json({ 
        message: 'Server error. Could not register provider.',
        error: error.message 
      });
    }
  }
);

// GET /api/providers
// Return all providers
router.get('/', async (req, res) => {
  try {
    const providers = await Provider.find().sort({ createdAt: -1 });
    res.json(providers);
  } catch (err) {
    console.error('Error fetching providers:', err);
    res.status(500).json({ message: 'Failed to fetch providers' });
  }
});

module.exports = router;
