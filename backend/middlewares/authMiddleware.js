const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // استقبال التوكن من الـ Header
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ success: false, message: 'مفيش توكن، غير مصرح بالدخول' });
  }

  try {
    // التخلص من كلمة Bearer لو موجودة وفك تشفير التوكن
    const decoded = jwt.verify(
      token.replace('Bearer ', ''), 
      process.env.JWT_SECRET || '180daraga_secret_key'
    );
    
    // حفظ الـ id بتاع اليوزر في الـ request عشان نستخدمه بعدين
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'التوكن غير صالح أو منتهي الصلاحية' });
  }
};