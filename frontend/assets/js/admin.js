function parseJwt(token) {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Önce giriş yapmalısınız!");
    window.location.href = "/login";
    return;
  }
  const user = parseJwt(token);
  if (!user || user.role !== "admin") {
    alert("Admin yetkiniz yok!");
    window.location.href = "/";
    return;
  }
  // Basit admin rol kontrolü (JWT decode ile client tarafı da yapılabilir)
  // Daha güvenlisi: API zaten admin kontrolü yapıyor!

  // Ürünleri çek
  fetch("/api/products")
    .then((res) => res.json())
    .then((products) => {
      const listDiv = document.getElementById("admin-product-list");
      let html = '<ul class="list-group">';
      products.forEach((p) => {
        html += `<li class="list-group-item d-flex justify-content-between align-items-center">
                  ${p.name} (${p.price}₺)
                  <button class="btn btn-sm btn-danger sil-btn" data-id="${p._id}">Sil</button>
                </li>`;
      });
      html += "</ul>";
      listDiv.innerHTML = html;

      document.querySelectorAll(".sil-btn").forEach((btn) => {
        btn.onclick = () => {
          if (confirm("Silmek istediğinize emin misiniz?")) {
            fetch("/api/products/" + btn.getAttribute("data-id"), {
              method: "DELETE",
              headers: {
                Authorization: "Bearer " + token,
              },
            })
              .then((res) => res.json())
              .then((data) => {
                alert(data.message || "Silindi");
                location.reload();
              });
          }
        };
      });
    });

  // Ürün ekle
  document.getElementById("addProductForm").onsubmit = async function (e) {
    e.preventDefault();
    const product = {
      name: document.getElementById("name").value,
      description: document.getElementById("description").value,
      price: Number(document.getElementById("price").value),
      stock: Number(document.getElementById("stock").value),
      image: document.getElementById("image").value,
    };
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(product),
    });
    const result = await res.json();
    document.getElementById("addProductMessage").textContent =
      result.message || "Ürün eklendi!";
    setTimeout(() => location.reload(), 1000);
  };

  // Siparişleri çek
  fetch("/api/orders", {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((orders) => {
      const orderDiv = document.getElementById("admin-order-list");
      if (!orders.length) {
        orderDiv.innerHTML =
          "<div class='alert alert-info'>Hiç sipariş yok.</div>";
        return;
      }
      let html = "";
      orders.forEach((order) => {
        html += `
        <div class="card mb-2">
          <div class="card-header">
            <strong>Sipariş No:</strong> ${
              order._id
            } - <strong>Kullanıcı:</strong> ${order.userId}
          </div>
          <div class="card-body">
            <ul class="list-group mb-2">
              ${order.products
                .map(
                  (p) =>
                    `<li class="list-group-item">${p.name} x${p.quantity} (${p.price}₺)</li>`
                )
                .join("")}
            </ul>
            <strong>Toplam:</strong> ${order.totalPrice} ₺<br>
            <strong>Adres:</strong> ${order.address} <br>
            <strong>Durum:</strong> ${order.status || "-"}
          </div>
        </div>
      `;
      });
      orderDiv.innerHTML = html;
    });
});
