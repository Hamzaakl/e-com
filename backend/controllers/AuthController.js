const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Kullanıcı kaydı
exports.register = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email zaten kayıtlı" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      role: "user",
    });

    await user.save();
    res.status(201).json({ message: "Kayıt başarılı", userId: user._id });
  } catch (err) {
    res.status(400).json({ message: "Kayıt başarısız", error: err.message });
  }
};

// Kullanıcı girişi
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Kullanıcı bulunamadı" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Hatalı şifre" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Giriş başarılı",
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (err) {
    res.status(400).json({ message: "Giriş başarısız", error: err.message });
  }
};
