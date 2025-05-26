const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/PaymentController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/pay", verifyToken, paymentController.payWithIyzico);

module.exports = router;
