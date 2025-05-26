document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/products")
    .then((res) => res.json())
    .then((products) => {
      const productList = document.getElementById("product-list");
      products.forEach((product) => {
        productList.innerHTML += `
          <div class="col-md-4 mb-3">
            <div class="card">
              <img src="${
                product.image
                  ? product.image
                  : "https://via.placeholder.com/300x200?text=Görsel+Yok"
              }" class="card-img-top" alt="${product.name}">
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${
                  product.description ? product.description : ""
                }</p>
                <span class="badge bg-success mb-2">${product.price} ₺</span>
                <br>
                <button class="btn btn-primary sepete-ekle" data-id="${
                  product._id
                }">Sepete Ekle</button>
              </div>
            </div>
          </div>
        `;
      });

      // Sepete Ekle butonlarına tıklama işlemi
      document.querySelectorAll(".sepete-ekle").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = this.getAttribute("data-id");
          const productName =
            this.parentElement.querySelector(".card-title").textContent;
          const productPrice = parseFloat(
            this.parentElement.querySelector(".badge").textContent
          );
          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          // Sepette varsa adeti artır
          let item = cart.find((i) => i.productId === productId);
          if (item) {
            item.quantity += 1;
          } else {
            cart.push({
              productId,
              name: productName,
              price: productPrice,
              quantity: 1,
            });
          }
          localStorage.setItem("cart", JSON.stringify(cart));
          alert("Ürün sepete eklendi!");
        });
      });
    });
});
