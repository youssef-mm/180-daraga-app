const express = require('express');
const router = express.Router({ mergeParams: true });
const responseController = require('../controllers/responseController');

// التأكد من وجود الدوال لتجنب TypeError
if (!responseController.createResponse || !responseController.getResponsesByMeeting) {
  console.error('❌ Error: Controller methods are missing in responseController!');
}

// GET: / (أو /api/meetings/:meetingId/responses)
router.get('/', responseController.getResponsesByMeeting);

// POST: / (أو /api/meetings/:meetingId/responses)
router.post('/', responseController.createResponse);

module.exports = router;