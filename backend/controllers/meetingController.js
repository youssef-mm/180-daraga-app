const { Meeting } = require('../models');

// 1. جلب الاجتماعات
exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({
      success: true,
      data: meetings,
    });
  } catch (error) {
    console.error('❌ Error fetching meetings:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. إضافة اجتماع جديد
exports.createMeeting = async (req, res) => {
  console.log('📥 البيانات الواصلة من الموبايل:', req.body);

  try {
    const { title, date, time, confirmationDeadline } = req.body;

    // التأكد من وصول كل البيانات
    if (!title || !date || !time || !confirmationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول (title, date, time, confirmationDeadline) مطلوبة',
      });
    }

    const newMeeting = await Meeting.create({
      title,
      date,
      time,
      confirmationDeadline,
    });

    console.log('✅ تم حفظ الاجتماع في الداتابيز برقم:', newMeeting.id);

    return res.status(201).json({
      success: true,
      message: 'Meeting created successfully',
      data: newMeeting,
    });
  } catch (error) {
    console.error('❌ خطأ أثناء الحفظ في الداتابيز:', error);
    return res.status(500).json({
      success: false,
      message: 'فشل حفظ الاجتماع في قاعدة البيانات',
      error: error.message,
    });
  }
};