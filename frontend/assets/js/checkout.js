document.getElementById("paymentForm").onsubmit = async function (e) {
  e.preventDefault();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Sepetiniz boş!");
    window.location.href = "/cart";
    return;
  }
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const address = document.getElementById("address").value;
  const cardHolderName = document.getElementById("cardHolderName").value;
  const cardNumber = document.getElementById("cardNumber").value;
  const expireMonth = document.getElementById("expireMonth").value;
  const expireYear = document.getElementById("expireYear").value;
  const cvc = document.getElementById("cvc").value;
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const res = await fetch("/api/payment/pay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      userId,
      products: cart,
      totalPrice,
      address,
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
    }),
  });
  const result = await res.json();
  const msgDiv = document.getElementById("paymentMessage");
  if (res.ok) {
    msgDiv.innerHTML =
      '<div class="alert alert-success">' + result.message + "</div>";
    localStorage.removeItem("cart");
    setTimeout(() => {
      window.location.href = "/myorders";
    }, 1500);
  } else {
    msgDiv.innerHTML =
      '<div class="alert alert-danger">Ödeme başarısız: ' +
      (result.error || result.message) +
      "</div>";
  }
};
