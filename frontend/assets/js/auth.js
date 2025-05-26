// Register işlemi
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.onsubmit = async function (e) {
    e.preventDefault();
    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    const msgDiv = document.getElementById("registerMessage");
    msgDiv.textContent = result.message;
    msgDiv.className = result.userId
      ? "alert alert-success"
      : "alert alert-danger";
    // Başarıyla kayıt olduysa giriş sayfasına yönlendir:
    if (result.userId) {
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
    s;
  };
}

// Login işlemi
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.onsubmit = async function (e) {
    e.preventDefault();
    const data = {
      email: document.getElementById("loginEmail").value,
      password: document.getElementById("loginPassword").value,
    };
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    const msgDiv = document.getElementById("loginMessage");
    msgDiv.textContent = result.message;
    msgDiv.className = result.token
      ? "alert alert-success"
      : "alert alert-danger";
    // Giriş başarılıysa token'ı sakla ve ana sayfaya yönlendir:
    if (result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.userId);
      setTimeout(() => {
        window.location.href = "/index";
      }, 1000);
    }
  };
}
