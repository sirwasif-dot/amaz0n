let cart = JSON.parse(
    localStorage.getItem("amaz0nCart") || "[]"
);

let total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
);


// =========================
// SAVE CART
// =========================

function saveCart() {

    localStorage.setItem(
        "amaz0nCart",
        JSON.stringify(cart)
    );

}


// =========================
// CART
// =========================

function addToCart(name, price) {

    cart.push({
        name: name,
        price: Number(price)
    });

    total += Number(price);

    saveCart();

    const count =
        document.getElementById("cartCount");

    if (count) {
        count.innerText = cart.length;
    }

    updateCart();

    alert(name + " added to cart!");
}


function updateCart() {

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartItems || !cartTotal) {
        return;
    }

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

    }

    cart.forEach((item, index) => {

        const div = document.createElement("div");

        div.style.borderBottom = "1px solid #ddd";
        div.style.padding = "10px 0";

        div.innerHTML = `
            <b>${item.name}</b>
            <br>
            $${Number(item.price).toFixed(2)}
            <br>
            <button onclick="removeFromCart(${index})">
                Remove
            </button>
        `;

        cartItems.appendChild(div);

    });

    cartTotal.innerText = total.toFixed(2);
}


function removeFromCart(index) {

    if (!cart[index]) {
        return;
    }

    total -= Number(cart[index].price);

    cart.splice(index, 1);

    saveCart();

    const count =
        document.getElementById("cartCount");

    if (count) {
        count.innerText = cart.length;
    }

    updateCart();
}


function showCart() {

    const cartBox =
        document.getElementById("cartBox");

    if (!cartBox) {
        return;
    }

    if (cartBox.style.display === "block") {

        cartBox.style.display = "none";

    } else {

        cartBox.style.display = "block";

        updateCart();

    }
}


// =========================
// SEARCH
// =========================

function searchProducts() {

    const searchInput =
        document.getElementById("search");

    if (!searchInput) {
        return;
    }

    const search =
        searchInput.value.toLowerCase();

    const products =
        document.querySelectorAll(".product");

    products.forEach(product => {

        const text =
            product.innerText.toLowerCase();

        if (text.includes(search)) {

            product.style.display = "block";

        } else {

            product.style.display = "none";

        }

    });

}


// =========================
// CHECKOUT
// =========================

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }

    saveCart();

    window.location.href = "checkout.html";

}


// =========================
// LOAD CART ON PAGE
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const count =
            document.getElementById("cartCount");

        if (count) {
            count.innerText = cart.length;
        }

        updateCart();

    }
);