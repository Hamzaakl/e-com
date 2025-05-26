const Iyzipay = require("iyzipay");
const Order = require("../models/Order");
function iyzicoDateString(d) {
  return (
    d.getFullYear() +
    "-" +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + d.getDate()).slice(-2) +
    " " +
    ("0" + d.getHours()).slice(-2) +
    ":" +
    ("0" + d.getMinutes()).slice(-2) +
    ":" +
    ("0" + d.getSeconds()).slice(-2)
  );
}
const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: "https://sandbox-api.iyzipay.com",
});

exports.payWithIyzico = (req, res) => {
  const now = new Date();
  const {
    userId,
    products,
    totalPrice,
    address,
    cardHolderName,
    cardNumber,
    expireMonth,
    expireYear,
    cvc,
  } = req.body;

  const paymentRequest = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: "123456789",
    price: totalPrice,
    paidPrice: totalPrice,
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
      registerCard: "0",
    },
    buyer: {
      id: userId,
      name: "Test",
      surname: "Kullanıcı",
      gsmNumber: "+905555555555",
      email: "test@email.com",
      identityNumber: "12345678901",
      registrationDate: iyzicoDateString(now),
      lastLoginDate: iyzicoDateString(now),
      registrationAddress: address,
      ip: req.ip,
      city: "İstanbul",
      country: "Türkiye",
      zipCode: "34000",
    },
    shippingAddress: {
      contactName: "Test Kullanıcı",
      city: "İstanbul",
      country: "Türkiye",
      address,
      zipCode: "34000",
    },
    billingAddress: {
      contactName: "Test Kullanıcı",
      city: "İstanbul",
      country: "Türkiye",
      address,
      zipCode: "34000",
    },
    basketItems: products.map((p) => ({
      id: p.productId,
      name: p.name,
      category1: "Genel",
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: (p.price * p.quantity).toString(),
    })),
  };

  iyzipay.payment.create(paymentRequest, async (err, paymentResult) => {
    if (err || paymentResult.status !== "success") {
      return res.status(400).json({
        message: "Ödeme başarısız!",
        error: paymentResult.errorMessage || err,
      });
    }
    // Sipariş kaydet
    const order = new Order({
      userId,
      products,
      totalPrice,
      address,
      paymentStatus: "paid",
      paymentId: paymentResult.paymentId,
    });
    await order.save();
    res.json({
      message: "Ödeme başarılı ve sipariş oluşturuldu!",
      orderId: order._id,
    });
  });
};
