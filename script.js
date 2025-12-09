// -------------------------
// INITIALIZATION
// -------------------------
if (localStorage.getItem("loggedIn") === null) {
    localStorage.setItem("loggedIn", "false");
}
if (localStorage.getItem("username") === null) {
    localStorage.setItem("username", "");
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
            <span class="welcome-user">Hi, ${user}</span>
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

// Login form handler
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const u = document.getElementById("login-username").value.trim();
        const p = document.getElementById("login-password").value.trim();
        const msg = document.getElementById("login-message");

        if (u.length < 2) {
            msg.textContent = "Username too short";
            return;
        }

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", u);
        msg.textContent = "Login successful!";
        setTimeout(() => (location.href = "index.html"), 500);
    });
}

// -------------------------
// CART FUNCTIONS
// -------------------------

function addToCart(name, price, img) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find(x => x.name === name);

    if (item) item.quantity++;
    else cart.push({ name, price, img, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    displayMiniCart();
    displayCart();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayMiniCart();
    displayCart();
}

// -------------------------
// CART PAGE DISPLAY
// -------------------------
function displayCart() {
    const box = document.getElementById("cart-container");
    if (!box) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        box.innerHTML = "<p class='cart-empty'>Your cart is empty.</p>";
        document.getElementById("checkout-total").textContent = "₹0";
        return;
    }

    let html = "";
    let total = 0;

    cart.forEach((item, i) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        html += `
        <div class="cart-item">
            <img src="${item.img}">
            <div class="cart-info">
                <h3>${item.name} x${item.quantity}</h3>
                <p>₹${subtotal}</p>
            </div>
            <button class="remove-btn" onclick="removeItem(${i})">Remove</button>
        </div>`;
    });

    box.innerHTML = html;
    document.getElementById("checkout-total").textContent = "₹" + total;
}

// -------------------------
// MINI CART DISPLAY
// -------------------------
function displayMiniCart() {
    const box = document.getElementById("mini-cart");
    if (!box) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        box.innerHTML = `
        <h3 class="mini-cart-title">Cart</h3>
        <p style="text-align:center;opacity:0.8;">Empty</p>
        `;
        return;
    }

    let html = `<h3 class="mini-cart-title">Cart (${cart.length})</h3>`;

    cart.forEach((item, i) => {
        html += `
        <div class="mini-cart-item">
            <img src="${item.img}" style="width:50px;height:50px;border-radius:6px;">
            <div style="flex:1;">
                <strong>${item.name}</strong><br>
                ₹${item.price * item.quantity} (x${item.quantity})
            </div>
            <button class="mini-remove" onclick="removeItem(${i})">✕</button>
        </div>`;
    });

    box.innerHTML = html;
}

// -------------------------
// CHECKOUT FORM
// -------------------------
const checkoutForm = document.getElementById("checkout-form");
if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
            document.getElementById("checkout-message").textContent =
                "Cart is empty.";
            return;
        }

        document.getElementById("checkout-message").textContent =
            "Order placed successfully!";
        localStorage.setItem("cart", "[]");
        displayCart();
        displayMiniCart();
    });
}

// INITIAL RENDER
updateUserArea();
displayMiniCart();
displayCart();
