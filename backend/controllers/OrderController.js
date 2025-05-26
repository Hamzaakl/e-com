const Order = require("../models/Order");

// Sipariş oluştur
exports.createOrder = async (req, res) => {
  try {
    // Body'den verileri al
    const { userId, products, totalPrice, address, paymentStatus, paymentId } =
      req.body;

    const order = new Order({
      userId,
      products,
      totalPrice,
      address,
      paymentStatus: paymentStatus || "pending",
      paymentId,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Sipariş oluşturulamadı", error: err.message });
  }
};

// Belirli kullanıcıya ait siparişler
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Siparişler getirilemedi", error: err.message });
  }
};

// Admiin için tüm Siparişler
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("userId");
  res.json(orders);
};
