const Product = require("../models/Product");

// Tüm ürünleri listele
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Bir hata oluştu" });
  }
};

// Yeni ürün ekle
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, stock, category } = req.body;
    const product = new Product({
      name,
      description,
      price,
      image,
      stock,
      category,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "Ürün eklenemedi", error: err.message });
  }
};

// Ürünü id ile getir (opsiyonel)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Bir hata oluştu" });
  }
};

// Ürünü güncelle (opsiyonel)
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Ürün bulunamadı" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Güncellenemedi", error: err.message });
  }
};

// Ürünü sil (opsiyonel)
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Ürün bulunamadı" });
    res.json({ message: "Ürün silindi" });
  } catch (err) {
    res.status(500).json({ message: "Silinemedi" });
  }
};
