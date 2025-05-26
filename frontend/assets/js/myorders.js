document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!userId || !token) {
    alert("Giriş yapmanız gerekiyor.");
    window.location.href = "/";
    return;
  }

  fetch(`/api/orders/user/${userId}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((orders) => {
      const listDiv = document.getElementById("orders-list");
      if (orders.length === 0) {
        listDiv.innerHTML = `<div class="alert alert-info">Henüz hiç siparişiniz yok.</div>`;
        return;
      }
      let html = '<div class="row">';
      orders.forEach((order) => {
        html += `
        <div class="col-md-6 mb-3">
          <div class="card">
            <div class="card-header">
              <strong>Sipariş No:</strong> ${order._id}<br>
              <strong>Tarih:</strong> ${new Date(
                order.createdAt
              ).toLocaleString()}
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
              <strong>Durum:</strong> ${order.status || "-"}<br>
              <strong>Ödeme:</strong> ${order.paymentStatus || "-"}
            </div>
          </div>
        </div>
      `;
      });
      html += "</div>";
      listDiv.innerHTML = html;
    })
    .catch((err) => {
      document.getElementById(
        "orders-list"
      ).innerHTML = `<div class="alert alert-danger">Siparişler yüklenemedi.</div>`;
    });
});
