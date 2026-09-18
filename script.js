// ============================================================
// amaz0n - CART SCRIPT
// ============================================================


// =========================
// LOAD CART
// =========================

let cart = JSON.parse(
    localStorage.getItem("amaz0nCart") || "[]"
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
// UPDATE CART COUNT
// =========================

function updateCartCount() {

    const count =
        document.getElementById("cartCount");

    if (count) {

        count.innerText =
            cart.length;

    }

}


// =========================
// ADD TO CART
// =========================

function addToCart(name, price) {

    cart.push({

        name: name,

        price: Number(price)

    });


    saveCart();

    updateCartCount();

    updateCart();

    alert(
        name + " added to cart!"
    );

}


// =========================
// UPDATE CART
// =========================

function updateCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");


    // Cart elements page par nahi hain
    if (!cartItems || !cartTotal) {

        return;

    }


    // Clear old cart
    cartItems.innerHTML = "";


    // Empty cart
    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

        cartTotal.innerText =
            "0.00";

        return;

    }


    let total = 0;


    // Display cart products
    cart.forEach(function(item, index) {

        const price =
            Number(item.price || 0);


        total += price;


        const div =
            document.createElement("div");


        div.style.borderBottom =
            "1px solid #ddd";


        div.style.padding =
            "10px 0";


        div.innerHTML = `

            <b>
                ${item.name}
            </b>

            <br>

            $${price.toFixed(2)}

            <br>

            <button
                type="button"
                onclick="removeFromCart(${index})"
            >
                Remove
            </button>

        `;


        cartItems.appendChild(div);

    });


    // Total
    cartTotal.innerText =
        total.toFixed(2);

}


// =========================
// REMOVE FROM CART
// =========================

function removeFromCart(index) {

    if (!cart[index]) {

        return;

    }


    cart.splice(index, 1);


    saveCart();

    updateCartCount();

    updateCart();

}


// =========================
// SHOW / HIDE CART
// =========================

function showCart() {

    const cartBox =
        document.getElementById("cartBox");


    if (!cartBox) {

        return;

    }


    if (
        cartBox.style.display === "block"
    ) {

        cartBox.style.display =
            "none";

    }

    else {

        cartBox.style.display =
            "block";

        updateCart();

    }

}


// =========================
// CHECKOUT
// =========================

function checkout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    saveCart();


    window.location.href =
        "checkout.html";

}


// =========================
// PAGE LOAD
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartCount();

        updateCart();

    }
);