const express = require('express');
const router = express.Router();

const briefingController = require('../controllers/briefingController');
const { protect } = require('../middleware/authMiddleware');

// Define API routes
router.get('/briefing', protect, briefingController.generateBriefing);
router.post('/ask', protect, briefingController.askFollowUp);
router.get('/user/interests', protect, briefingController.getInterests);
router.post('/user/interests', protect, briefingController.updateInterests);
router.get('/daily-brief', protect, briefingController.getDailyBrief);
router.post('/daily-brief/trigger', protect, briefingController.triggerDailyBriefManual);

module.exports = router;
