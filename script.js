// Ensure login state exists
if (localStorage.getItem("loggedIn") === null) {
    localStorage.setItem("loggedIn", "false");
}

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

// ✅ New: Proper checkout handling with form
document.addEventListener("DOMContentLoaded", () => {
    const checkoutForm = document.getElementById("checkout-form");

    if (!checkoutForm) return;

    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Must be logged in
        if (localStorage.getItem("loggedIn") !== "true") {
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

            // Optionally reset form
            checkoutForm.reset();

            // Reset total display
            const totalSpan = document.getElementById("checkout-total");
            if (totalSpan) {
                totalSpan.textContent = "₹0";
            }
        }, 1500);
    });
});

// ✅ Header Login / Logout UI
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
