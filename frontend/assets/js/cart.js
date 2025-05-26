function loadCart() {
  const cartList = document.getElementById("cart-list");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = '<div class="alert alert-info">Sepetiniz boş.</div>';
    document.getElementById("siparisVerBtn").style.display = "none";
    return;
  }
  document.getElementById("siparisVerBtn").style.display = "inline-block";

  cart.forEach((item) => {
    cartList.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">Adet: ${item.quantity}</p>
            <span class="badge bg-success">${item.price} ₺</span>
            <br>
            <button class="btn btn-danger mt-2 sil-btn" data-id="${item.productId}">Sil</button>
          </div>
        </div>
      </div>
    `;
  });

  // Silme işlemi
  document.querySelectorAll(".sil-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart = cart.filter((i) => i.productId !== id);
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
    });
  });
}

document.addEventListener("DOMContentLoaded", loadCart);

document.getElementById("siparisVerBtn").onclick = async function () {
  window.location.href = "/checkout";

  //   const cart = JSON.parse(localStorage.getItem("cart")) || [];
  //   if (cart.length === 0) {
  //     alert("Sepetiniz boş!");
  //     return;
  //   }
  //   // Kullanıcı bilgileri
  //   const userId = localStorage.getItem("userId");
  //   const token = localStorage.getItem("token");

  //   const address = prompt("Teslimat adresinizi girin:");
  //   if (!address) return;

  //   const totalPrice = cart.reduce(
  //     (sum, item) => sum + item.price * item.quantity,
  //     0
  //   );

  //   // API isteği
  //   const response = await fetch("/api/orders", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + token,
  //     },
  //     body: JSON.stringify({
  //       userId: userId,
  //       products: cart,
  //       totalPrice: totalPrice,
  //       address: address,
  //       paymentStatus: "pending",
  //       paymentId: "",
  //     }),
  //   });

  //   const result = await response.json();

  //   if (response.ok) {
  //     alert("Siparişiniz başarıyla alındı!");
  //     localStorage.removeItem("cart");
  //     window.location.href = "/index";
  //   } else {
  //     alert("Sipariş oluşturulamadı: " + (result.message || "Hata"));
  //   }
};
