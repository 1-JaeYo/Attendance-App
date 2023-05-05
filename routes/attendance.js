const express = require('express');

const attendanceController = require('../controllers/attendance');

const router = express.Router();

router.get('/', attendanceController.getIndex)

module.exports = router;