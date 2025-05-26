const router = require("express").Router();
const orderController = require("../controllers/OrderController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Tüm sipairş listele
router.get("/", verifyToken, isAdmin, orderController.getAllOrders);

// Yeni sipariş oluştur
router.post("/", verifyToken, orderController.createOrder);

// Kullanıcıya ait siparişleri getir
router.get("/user/:userId", verifyToken, orderController.getOrdersByUser);

module.exports = router;
