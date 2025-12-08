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
        mini.innerHTML = "
