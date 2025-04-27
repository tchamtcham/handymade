const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getServices,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

const router = express.Router();

router.route('/')
  .get(protect, getServices)
  .post(protect, createService);

router.route('/:id')
  .put(protect, updateService)
  .delete(protect, deleteService);

module.exports = router;