// Ensure login state exists
if (localStorage.getItem("loggedIn") === null) {
    localStorage.setItem("loggedIn", "false");
}

// ---------------- CART + MINI-CART ----------------

function addToCart(name, price, img) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let item = cart.find(product => product.name === name);

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ name, price, img, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    displayMiniCart();
}

function displayCart() {
    const container = document.getElementById("cart-container");
    if (!container) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        container.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
        const totalSpan = document.getElementById("checkout-total");
        if (totalSpan) totalSpan.textContent = "₹0";
        return;
    }

    container.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        container.innerHTML += `
        <div class="cart-item">
          <img src="${item.img}">
          <div class="cart-info">
            <h3>${item.name} <span style="opacity:0.8;">x${item.quantity}</span></h3>
            <p>₹${item.price * item.quantity}</p>
          </div>
          <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
        </div>`;
    });

    container.innerHTML += `<h2 class="total">Total: ₹${total}</h2>`;

    // Also update the checkout total on the right
    const totalSpan = document.getElementById("checkout-total");
    if (totalSpan) {
        totalSpan.textContent = `₹${total}`;
    }
}

function displayMiniCart() {
    const mini = document.getElementById("mini-cart");
    if (!mini) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        mini.innerHTML = "<p>No items yet.</p>";
        return;
    }

    mini.innerHTML = "<h3 class='mini-cart-title'>Your Cart</h3>";

    cart.forEach((item, index) => {
        mini.innerHTML += `
        <div class="mini-cart-item">
          <p>${item.name} <span>x${item.quantity}</span></p>
          <button class="mini-remove" onclick="removeItem(${index}); displayMiniCart();">x</button>
        </div>
        `;
    });

    mini.innerHTML += `<a href="cart.html" class="mini-cart-btn">Go to Cart</a>`;
}

document.addEventListener("DOMContentLoaded", displayMiniCart);
document.addEventListener("DOMContentLoaded", displayCart);

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    displayMiniCart();
}

// ---------------- CHECKOUT PAGE (cart.html) ----------------

document.addEventListener("DOMContentLoaded", () => {
    const checkoutForm = document.getElementById("checkout-form");
    if (!checkoutForm) return; // not on checkout page

    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Must be logged in
        if (localStorage.getItem("loggedIn") !== "true") {
            // mark that user came here from checkout
            localStorage.setItem("redirectAfterLogin", "checkout");
            alert("Please login to continue checkout.");
            window.location.href = "login.html";
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        // Basic HTML5 validation
        if (!checkoutForm.checkValidity()) {
            checkoutForm.reportValidity();
            return;
        }

        const messageEl = document.getElementById("checkout-message");
        const placeOrderBtn = document.getElementById("place-order-btn");
        if (messageEl) {
            messageEl.textContent = "Processing your order...";
        }
        if (placeOrderBtn) {
            placeOrderBtn.disabled = true;
        }

        // Fake processing delay
        setTimeout(() => {
            // Clear cart
            localStorage.removeItem("cart");
            displayCart();
            displayMiniCart();

            if (messageEl) {
                messageEl.textContent = "✅ Order placed successfully! Your mugs will be shipped soon.";
            }

            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
            }

            // Reset form
            checkoutForm.reset();

            // Reset total display
            const totalSpan = document.getElementById("checkout-total");
            if (totalSpan) {
                totalSpan.textContent = "₹0";
            }
        }, 1500);
    });
});

// ---------------- LOGIN PAGE (login.html) ----------------

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    if (!loginForm) return; // not on login page

    const usernameInput = document.getElementById("login-username");
    const passwordInput = document.getElementById("login-password");
    const messageEl = document.getElementById("login-message");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            if (messageEl) {
                messageEl.textContent = "Please enter both username and password.";
            }
            return;
        }

        // Fake login: store in localStorage
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", username);

        if (messageEl) {
            messageEl.textContent = "✅ Logged in successfully! Redirecting...";
        }

        setTimeout(() => {
            // If user was forced to login from checkout, send them back there
            if (localStorage.getItem("redirectAfterLogin") === "checkout") {
                localStorage.removeItem("redirectAfterLogin");
                window.location.href = "cart.html"; // checkout page
            } else {
                window.location.href = "index.html";
            }
        }, 600);
    });
});

// ---------------- HEADER USER AREA ----------------

function updateUserArea() {
    const userArea = document.getElementById("user-area");
    if (!userArea) return;

    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const username = localStorage.getItem("username");

    if (loggedIn && username) {
        userArea.innerHTML = `
        <span class="welcome-user">Welcome, ${username}</span>
        <button class="logout-btn" onclick="logout()">Logout</button>
        `;
    } else {
        userArea.innerHTML = `<a href="login.html">Login</a>`;
    }
}

function logout() {
    localStorage.setItem("loggedIn", "false");
    displayMiniCart();
    updateUserArea();
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", updateUserArea);
