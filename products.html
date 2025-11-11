
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

// ✅ Login requirement before checkout
document.getElementById("checkout-btn")?.addEventListener("click", () => {
    if (localStorage.getItem("loggedIn") !== "true") {
        alert("Please login to continue checkout.");
        window.location.href = "login.html";
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) return;

    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const modal = document.createElement("div");
    modal.className = "payment-modal";
    modal.innerHTML = `
    <div class="payment-box">
    <h2>Checkout</h2>
    <p>Total Amount: <strong>₹${total}</strong></p>
    <button class="pay-now-btn">Pay Now</button>
    <button class="close-pay-btn">Cancel</button>
    </div>`;
    document.body.appendChild(modal);

    modal.querySelector(".pay-now-btn").addEventListener("click", () => {
        modal.querySelector(".payment-box").innerHTML = `
        <h2>Processing Payment...</h2><p>Please wait</p>`;

        setTimeout(() => {
            modal.querySelector(".payment-box").innerHTML = `
            <h2>✅ Payment Successful!</h2><p>Your mugs are on the way.</p>
            <button class="close-pay-btn" id="final-close-btn">Close</button>`;

            localStorage.removeItem("cart");
            displayCart();
            displayMiniCart();

            document.getElementById("final-close-btn").onclick = () => modal.remove();
        }, 2000);
    });

    modal.querySelector(".close-pay-btn").onclick = () => modal.remove();
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
