const { Response } = require('../models');

// 1. إنشاء رد جديد على اجتماع
exports.createResponse = async (req, res) => {
  console.log('📥 [RESPONSE REQ RECEIVED]:', req.body);
  console.log('📍 [MEETING ID]:', req.params.meetingId);

  try {
    const meetingId = req.params.meetingId || req.body.meetingId;
    const { name, status, userId } = req.body;

    if (!name || !status || !meetingId) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول (name, status, meetingId) مطلوبة',
      });
    }

    const newResponse = await Response.create({
      meetingId,
      name,
      status,
      userId: userId || null, // 👈 إمراره كـ null لو مش موجود
    });

    console.log('✅ [SUCCESS]: Response saved with ID:', newResponse.id);

    return res.status(201).json({
      success: true,
      message: 'Response submitted successfully',
      data: newResponse,
    });
  } catch (error) {
    console.error('❌ [ERROR SAVING RESPONSE]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error while saving response',
      error: error.message,
    });
  }
};

// 2. جلب جميع الردود الخاصة باجتماع معين
exports.getResponsesByMeeting = async (req, res) => {
  try {
    const meetingId = req.params.meetingId;

    const responses = await Response.findAll({
      where: { meetingId },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      data: responses,
    });
  } catch (error) {
    console.error('❌ [ERROR FETCHING RESPONSES]:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};