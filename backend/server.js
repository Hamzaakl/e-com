require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const paymentRoutes = require("./routes/Payment");
const productRoutes = require("./routes/Product");
const authRoutes = require("./routes/Auth");
const orderRoutes = require("./routes/Order");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

app.set("view engine", "ejs"); // EJS kullanacağını belirt
app.set("views", path.join(__dirname, "../frontend")); // EJS dosyaların bu klasörde olacak
app.use("/assets", express.static(path.join(__dirname, "../frontend/assets")));
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/index", (req, res) => {
  res.render("index");
});
app.get("/cart", (req, res) => {
  res.render("cart");
});
app.get("/myorders", (req, res) => {
  res.render("myorders");
});
app.get("/admin", (req, res) => {
  res.render("admin");
});
app.get("/checkout", (req, res) => {
  res.render("checkout");
});
app.listen(3000, () => console.log("Server started!"));
