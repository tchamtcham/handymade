const express = require('express');
const router = express.Router();
const earningsController = require('../../controllers/earningsController');
const { protect } = require('../../middleware/Provider/auth');

router.use(protect);

router.route('/')
  .get(earningsController.getEarnings)
  .post(earningsController.createEarning);

module.exports = router;