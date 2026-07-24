const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. دالة إنشاء حساب جديد (Register)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // التأكد إن الإيميل مش متسجل قبل كده
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'الإيميل ده مسجل بالفعل' });
    }

    // تشفير الباسورد
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // حفظ المستخدم في الداتا بيز
    const newUser = await User.create({ name, email, passwordHash: hashedPassword });
    res.status(201).json({ 
      success: true, 
      message: 'تم إنشاء الحساب بنجاح', 
      data: { id: newUser.id, name: newUser.name, email: newUser.email } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// 2. دالة تسجيل الدخول (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // البحث عن المستخدم بالإيميل
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }

    // مقارنة الباسورد
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'كلمة المرور غير صحيحة' });
    }

    // إنشاء التوكن (JWT)
    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET || '180daraga_secret_key', 
      { expiresIn: '30d' }
    );

    res.status(200).json({ 
      success: true, 
      message: 'تم تسجيل الدخول بنجاح', 
      token,
      data: { id: user.id, name: user.name, email: user.email } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};