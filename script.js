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

        // handle redirect requested by checkout
        const redirect = localStorage.getItem("afterLoginRedirect");
        localStorage.removeItem("afterLoginRedirect");

        setTimeout(() => {
            if (redirect === "cart") location.href = "cart.html";
            else location.href = "index.html";
        }, 400);
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
    if (index < 0 || index >= cart.length) return;
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
        const totalEl = document.getElementById("checkout-total");
        if (totalEl) totalEl.textContent = "₹0";
        return;
    }

    let html = "";
    let total = 0;

    cart.forEach((item, i) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        html += `
        <div class="cart-item">
            <img src="${escapeAttr(item.img)}" alt="${escapeHtml(item.name)}">
            <div class="cart-info">
                <h3>${escapeHtml(item.name)} <span style="opacity:0.8;">x${item.quantity}</span></h3>
                <p>₹${subtotal}</p>
            </div>
            <button class="remove-btn" onclick="removeItem(${i})">Remove</button>
        </div>`;
    });

    html += `<h2 class="total">Total: ₹${total}</h2>`;

    box.innerHTML = html;
    const totalEl = document.getElementById("checkout-total");
    if (totalEl) totalEl.textContent = "₹" + total;
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
        <a class="mini-cart-btn" href="products.html">Browse Mugs</a>
        `;
        return;
    }

    let html = `<h3 class="mini-cart-title">Cart (${cart.length})</h3>`;

    cart.forEach((item, i) => {
        html += `
        <div class="mini-cart-item">
            <img src="${escapeAttr(item.img)}" style="width:50px;height:50px;border-radius:6px;object-fit:cover;" alt="${escapeHtml(item.name)}">
            <div style="flex:1;">
                <strong>${escapeHtml(item.name)}</strong><br>
                ₹${item.price * item.quantity} (x${item.quantity})
            </div>
            <button class="mini-remove" onclick="removeItem(${i})">✕</button>
        </div>`;
    });

    html += `<a class="mini-cart-btn" href="cart.html">View Cart</a>`;
    box.innerHTML = html;
}

// -------------------------
// CHECKOUT FORM (require login + payment)
// -------------------------
const checkoutForm = document.getElementById("checkout-form");
if (checkoutForm) {
    const placeBtn = document.getElementById("place-order-btn");
    const checkoutMessage = document.getElementById("checkout-message");

    function updatePlaceBtnState() {
        const logged = localStorage.getItem("loggedIn") === "true";
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const paymentChosen = !!checkoutForm.querySelector('input[name="payment-method"]:checked');
        if (!placeBtn) return;
        placeBtn.disabled = !(logged && cart.length > 0 && paymentChosen);
        placeBtn.style.opacity = placeBtn.disabled ? "0.6" : "1";
        placeBtn.title = placeBtn.disabled ? (logged ? "Select payment method / add items" : "Please login first") : "Place order";
    }

    // update on change events (payment)
    checkoutForm.addEventListener("change", (e) => {
        if (e.target && e.target.name === "payment-method") updatePlaceBtnState();
    });

    // update when storage changes (login/cart updated in other tab)
    window.addEventListener('storage', (e) => {
        if (e.key === 'loggedIn' || e.key === 'cart') updatePlaceBtnState();
    });

    // initial state
    window.addEventListener('load', updatePlaceBtnState);

    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // require login
        const logged = localStorage.getItem("loggedIn") === "true";
        if (!logged) {
            // remember we should go back to cart after login
            localStorage.setItem("afterLoginRedirect", "cart");
            location.href = "login.html";
            return;
        }

        // require cart not empty
        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (cart.length === 0) {
            if (checkoutMessage) checkoutMessage.textContent = "Cart is empty.";
            return;
        }

        // require payment method chosen
        const methodEl = checkoutForm.querySelector('input[name="payment-method"]:checked');
        if (!methodEl) {
            if (checkoutMessage) checkoutMessage.textContent = "Please choose a payment method.";
            updatePlaceBtnState();
            return;
        }

        // simulate success
        if (checkoutMessage) checkoutMessage.textContent = "Order placed successfully! (Payment: " + methodEl.value + ")";
        localStorage.setItem("cart", "[]");
        displayCart();
        displayMiniCart();
        updatePlaceBtnState();
    });
}

// -------------------------
// UTIL / INIT
// -------------------------
function escapeHtml(s) {
    if (s === undefined || s === null) return "";
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s) {
    if (!s) return "";
    return String(s).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// INITIAL RENDER
try { updateUserArea(); } catch (e) { /* ignore */ }
try { displayMiniCart(); } catch (e) { /* ignore */ }
try { displayCart(); } catch (e) { /* ignore */ }
