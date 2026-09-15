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
// CART
// =========================

function addToCart(name, price) {

    cart.push({
        name: name,
        price: Number(price)
    });

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

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");


    if (!cartItems || !cartTotal) {
        return;
    }


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

    }


    let total = 0;


    cart.forEach((item, index) => {

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
                onclick="removeFromCart(${index})"
                type="button"
            >
                Remove
            </button>

        `;


        cartItems.appendChild(div);

    });


    cartTotal.innerText =
        total.toFixed(2);

}


function removeFromCart(index) {

    if (!cart[index]) {
        return;
    }


    cart.splice(index, 1);


    saveCart();


    const count =
        document.getElementById("cartCount");


    if (count) {

        count.innerText =
            cart.length;

    }


    updateCart();

}


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
// LOAD CART
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const count =
            document.getElementById(
                "cartCount"
            );


        if (count) {

            count.innerText =
                cart.length;

        }


        updateCart();

    }
);