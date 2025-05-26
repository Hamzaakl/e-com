const router = require("express").Router();
const productController = require("../controllers/ProductController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
// jwt token ve isadmin middlewarede kontrol sağlaamk için var auth ve authz
// Tüm ürünleri listele
router.get("/", productController.getAllProducts);

// Belirli ürünü çek (opsiyonel)
router.get("/:id", productController.getProductById);

// ürün ekle
router.post("/", verifyToken, isAdmin, productController.createProduct);
// ürün güncelle
router.put("/:id", verifyToken, isAdmin, productController.updateProduct);
// ürün sil
router.delete("/:id", verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;
