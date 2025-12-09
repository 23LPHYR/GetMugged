// -------------------------
// INITIALIZATION
// -------------------------
if (localStorage.getItem("loggedIn") === null) {
    localStorage.setItem("loggedIn", "false");
}
if (localStorage.getItem("username") === null) {
    localStorage.setItem("username", "");
}
if (localStorage.getItem("cart") === null) {
    localStorage.setItem("cart", "[]");
}

// -------------------------
// LOGIN / LOGOUT HANDLING
// -------------------------

function updateUserArea() {
    const area = document.getElementById("user-area");
    if (!area) return;

    const logged = localStorage.getItem("loggedIn");
    const user = localStorage.getItem("username");

    if (logged === "true") {
        area.innerHTML = `
            <span class="welcome-user">Hi, ${escapeHtml(user)}</span>
            <button class="logout-btn" onclick="logout()">Logout</button>
        `;
    } else {
        area.innerHTML = `<a href="login.html">Login</a>`;
    }
}

function logout() {
    localStorage.setItem("loggedIn", "false");
    localStorage.setItem("username", "");
    updateUserArea();
    location.href = "index.html";
}

// Login form handler (honors afterLoginRedirect)
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const uEl = document.getElementById("login-username");
        const pEl = document.getElementById("login-password");
        const msg = document.getElementById("login-message");
        const u = uEl ? uEl.value.trim() : "";
        const p = pEl ? pEl.value.trim() : "";

        if (u.length < 2) {
            if (msg) msg.textContent = "Username too short";
            return;
        }

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", u);
        if (msg) msg.textContent = "Login successful!";
