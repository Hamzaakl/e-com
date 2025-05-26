const jwt = require("jsonwebtoken");
// GPT // JWT AUTH İÇİN YAPI
exports.verifyToken = (req, res, next) => {
  // Token'ı header'dan al (Authorization: Bearer <token>)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer token" formatı

  if (!token) {
    return res.status(401).json({ message: "Token yok, yetkisiz erişim!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Geçersiz token!" });
    req.user = user; // userId, email, role gibi payload’ı burada saklarız
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Sadece admin erişebilir!" });
  }
};
