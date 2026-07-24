const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const responseRoutes = require('./responseRoutes');

// مسارات الاجتماعات
router.get('/', meetingController.getMeetings);
router.post('/', meetingController.createMeeting);

// ربط مسار الـ Responses داخل الـ Meetings
router.use('/:meetingId/responses', responseRoutes);

module.exports = router;