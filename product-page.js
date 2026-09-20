/* ========================================
   AMAZ0N DYNAMIC PRODUCT PAGE
   FAST + LIGHTWEIGHT + SAFE
   WITH BUY NOW (Main + Related)
======================================== */


/* ========================================
   SUPABASE CONFIG
======================================== */

const SUPABASE_URL =
    "https://couztwgxdpisnqurlvbs.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_V6cuw9f9Q6aAYsd_4xGebQ_cZcEZSTU";


/* ========================================
   CACHE CONFIG
======================================== */

const CACHE_KEY =
    "amaz0nProductsCache_v3";

const CACHE_TIME_KEY =
    "amaz0nProductsCacheTime_v3";

const CACHE_DURATION =
    10 * 60 * 1000; // 10 minutes


/* ========================================
   SUPABASE REQUEST HELPER
======================================== */

async function supabaseRequest(endpoint) {
    const response = await fetch(
        SUPABASE_URL + endpoint,
        {
            method: "GET",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + SUPABASE_KEY
            }
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            "Supabase error " + response.status + ": " + errorText
        );
    }

    return await response.json();
}


/* ========================================
   GET LIGHTWEIGHT PRODUCTS
======================================== */

async function getAllProductsFast() {

    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

    if (cached && cachedTime) {
        const age = Date.now() - Number(cachedTime);

        if (age < CACHE_DURATION) {
            try {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    console.log("Using lightweight cached products");
                    return parsed.map(normalizeProduct);
                }
            } catch (e) {
                console.warn("Cache invalid, ignoring");
            }
        }
    }

    const selectFields = [
        "id",
        "title",
        "price",
        "old_price",
        "discount",
        "condition",
        "rating",
        "reviews",
        "stock",
        "category",
        "image"
    ].join(",");

    try {
        const endpoint =
            "/rest/v1/products?select=" +
            encodeURIComponent(selectFields) +
            "&order=id.asc";

        console.log("Loading lightweight products...");

        const data = await supabaseRequest(endpoint);

        if (Array.isArray(data) && data.length > 0) {
            const normalized = data.map(normalizeProduct);

            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(normalized));
                localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
            } catch (e) {
                console.warn("Could not save cache:", e);
            }

            console.log("Lightweight products loaded");
            return normalized;
        }
    } catch (error) {
        console.error("Lightweight products failed:", error);
    }

    if (typeof products !== "undefined" && Array.isArray(products)) {
        console.log("Using products.js fallback");
        return products.map(normalizeProduct);
    }

    return [];
}


/* ========================================
   GET FULL DATA FOR ONLY ONE PRODUCT
======================================== */

async function getFullProduct(productId) {

    const selectFields = [
        "id",
        "title",
        "price",
        "old_price",
        "discount",
        "condition",
        "rating",
        "reviews",
        "stock",
        "category",
        "image",
        "description",
        "renewed",
        "images",
        "information_sections",
        "customer_reviews"
    ].join(",");

    try {
        const endpoint =
            "/rest/v1/products?select=" +
            encodeURIComponent(selectFields) +
            "&id=eq." +
            encodeURIComponent(productId);

        console.log("Loading full data for product:", productId);

        const data = await supabaseRequest(endpoint);

        if (Array.isArray(data) && data.length > 0) {
            console.log("Full product loaded");
            return normalizeProduct(data[0]);
        }
    } catch (error) {
        console.error("Full product failed:", error);
    }

    return null;
}


/* ========================================
   BUY NOW FUNCTION (Main Product)
======================================== */

function buyNow() {
    const titleEl = document.querySelector(".product-info h1");
    const priceEl = document.querySelector(".discount-price");

    if (!titleEl || !priceEl) {
        alert("Product info not found");
        return;
    }

    const title = titleEl.innerText.trim();
    const priceText = priceEl.innerText.replace(/[^0-9.]/g, "");
    const price = Number(priceText) || 0;

    if (typeof cart !== "undefined") {
        cart.length = 0;
        cart.push({
            name: title,
            price: price
        });

        if (typeof saveCart === "function") saveCart();
        if (typeof updateCartCount === "function") updateCartCount();
        if (typeof updateCart === "function") updateCart();
    }

    window.location.href = "checkout.html";
}


/* ========================================
   LOAD PRODUCT PAGE
======================================== */

async function loadProductPage() {

    console.log("=== AMAZ0N PRODUCT PAGE START ===");

    try {
        const params = new URLSearchParams(window.location.search);
        const rawId = params.get("id");
        const productId = Number(rawId);

        console.log("URL:", window.location.href);
        console.log("Product ID:", productId);

        if (!rawId || !Number.isFinite(productId)) {
            console.error("Invalid product ID");
            showProductNotFound();
            return;
        }

        const allProducts = await getAllProductsFast();

        console.log(
            "Available product IDs:",
            allProducts.map(item => item.id)
        );

        let product = allProducts.find(
            item => Number(item.id) === productId
        );

        if (product) {
            const fullProduct = await getFullProduct(productId);
            if (fullProduct) {
                product = fullProduct;
            }
        }

        if (!product) {
            console.error("Product not found:", productId);
            showProductNotFound();
            return;
        }

        console.log("Selected product:", product);

        document.title = product.title + " | amaz0n";

        let productImages = [];

        if (Array.isArray(product.images)) {
            productImages = product.images.filter(
                image => typeof image === "string" && image.trim() !== ""
            );
        }

        if (productImages.length === 0 && product.image) {
            productImages = [product.image];
        }

        // Breadcrumb
        const breadcrumb = document.querySelector(".product-breadcrumb");
        if (breadcrumb) {
            let categoryPath = [];

            if (Array.isArray(product.categoryPath)) {
                categoryPath = product.categoryPath;
            } else if (product.category) {
                categoryPath = [product.category];
            }

            let html = `
                <a href="index.html" style="color:#007185;text-decoration:none;font-weight:500;">
                    Home
                </a>
            `;

            categoryPath.forEach(category => {
                html += `
                    <span style="margin:0 6px;color:#777;">›</span>
                    <a href="index.html?category=${encodeURIComponent(category)}" style="color:#007185;text-decoration:none;">
                        ${escapeHTML(category)}
                    </a>
                `;
            });

            html += `
                <span style="margin:0 6px;color:#777;">›</span>
                <span style="color:#555;">${escapeHTML(product.title)}</span>
            `;

            breadcrumb.innerHTML = html;
        }

        // Title
        const title = document.querySelector(".product-info h1");
        if (title) title.innerText = product.title;

        // Price
        const price = document.querySelector(".discount-price");
        if (price) {
            price.innerHTML = `<sup>$</sup>${formatPrice(product.price)}`;
        }

        // Old price
        const oldPrice = document.querySelector(".old-price");
        if (oldPrice) {
            if (Number(product.oldPrice) > Number(product.price)) {
                oldPrice.innerHTML = `List Price: <del>$${formatPrice(product.oldPrice)}</del>`;
            } else {
                oldPrice.innerHTML = "";
            }
        }

        // Discount
        const discount = document.querySelector(".product-info > div[style]");
        if (discount && product.discount) {
            discount.innerText = product.discount + "% off";
        }

        // Condition
        const condition = document.querySelector(".condition");
        if (condition) {
            condition.innerHTML = `Condition: <strong>${escapeHTML(product.condition)}</strong>`;
        }

        // Stock
        const stock = document.querySelector(".stock");
        if (stock) {
            const stockNumber = Number(product.stock) || 0;

            if (stockNumber <= 0) {
                stock.innerText = "Out of Stock";
                stock.style.color = "#cc0000";
            } else if (stockNumber <= 5) {
                stock.innerText = "Only " + stockNumber + " left in stock";
                stock.style.color = "#b12704";
            } else {
                stock.innerText = "In Stock";
                stock.style.color = "#007600";
            }
        }

        // Rating
        const rating = document.querySelector(".rating span");
        if (rating) {
            rating.innerText = `${product.rating} (${product.reviews} ratings)`;
        }

        // Description
        const description = document.querySelector(".product-description p");
        if (description) {
            description.innerText = product.description || "";
        }

        // Main Image
        const mainImage = document.querySelector(".main-product-image");
        if (mainImage) {
            if (productImages.length > 0) {
                mainImage.innerHTML = `
                    <img
                        id="mainProductImage"
                        src="${escapeAttribute(productImages[0])}"
                        alt="${escapeAttribute(product.title)}"
                        fetchpriority="high"
                        decoding="async"
                        style="max-width:100%;max-height:100%;width:100%;height:100%;object-fit:contain;display:block;background:#f7f7f7;"
                        onerror="this.style.display='none';"
                    >
                `;

                let thumbnailContainer = document.querySelector(".product-thumbnails");

                if (!thumbnailContainer) {
                    thumbnailContainer = document.createElement("div");
                    thumbnailContainer.className = "product-thumbnails";
                    mainImage.parentNode.insertBefore(thumbnailContainer, mainImage.nextSibling);
                }

                thumbnailContainer.innerHTML = "";

                productImages.forEach((image, index) => {
                    const thumb = document.createElement("div");
                    thumb.className = "product-thumb";
                    thumb.style.cssText = `
                        width:70px;height:70px;
                        border:2px solid ${index === 0 ? "#007185" : "#ddd"};
                        border-radius:5px;padding:3px;cursor:pointer;
                        background:#fff;box-sizing:border-box;overflow:hidden;
                    `;

                    thumb.innerHTML = `
                        <img
                            src="${escapeAttribute(image)}"
                            alt=""
                            loading="lazy"
                            decoding="async"
                            style="width:100%;height:100%;object-fit:contain;"
                        >
                    `;

                    thumb.onclick = function () {
                        const main = document.getElementById("mainProductImage");
                        if (main) main.src = image;

                        thumbnailContainer.querySelectorAll(".product-thumb").forEach(item => {
                            item.style.border = "2px solid #ddd";
                        });

                        thumb.style.border = "2px solid #007185";
                    };

                    thumbnailContainer.appendChild(thumb);
                });
            } else {
                let emoji = "📦";
                if (product.category === "Mobiles") emoji = "📱";
                else if (product.category === "Electronics") emoji = "🎧";
                else if (product.category === "Computers") emoji = "💻";

                mainImage.innerHTML = `<span style="font-size:100px;">${emoji}</span>`;
            }
        }

        // ================================
        // ADD TO CART BUTTON
        // ================================
        const addButton = document.querySelector(".add-button");
        if (addButton) {
            const stockNumber = Number(product.stock) || 0;

            if (stockNumber <= 0) {
                addButton.innerText = "Out of Stock";
                addButton.disabled = true;
                addButton.style.background = "#ddd";
                addButton.style.cursor = "not-allowed";
                addButton.onclick = null;
            } else {
                addButton.disabled = false;
                addButton.innerText = "Add to Cart";
                addButton.onclick = function () {
                    if (typeof addToCart === "function") {
                        addToCart(product.title, product.price);
                    }
                };
            }
        }

        // ================================
        // BUY NOW BUTTON (Main)
        // ================================
        const buyButton = document.querySelector(".buy-button");
        if (buyButton) {
            const stockNumber = Number(product.stock) || 0;

            if (stockNumber <= 0) {
                buyButton.innerText = "Out of Stock";
                buyButton.disabled = true;
                buyButton.style.background = "#ddd";
                buyButton.style.cursor = "not-allowed";
                buyButton.onclick = null;
            } else {
                buyButton.disabled = false;
                buyButton.innerText = "Buy Now";
                buyButton.onclick = buyNow;
            }
        }

        // Extra sections
        renderProductInformation(product);
        renderCustomerReviews(product);
        renderRelatedProducts(allProducts, product);

        console.log("=== PRODUCT PAGE LOADED SUCCESSFULLY ===");

    } catch (error) {
        console.error("PRODUCT PAGE FATAL ERROR:", error);
        showProductNotFound();
    }
}


/* ========================================
   NORMALIZE PRODUCT
======================================== */

function normalizeProduct(product) {
    return {
        id: Number(product.id),
        title: product.title || "",
        price: Number(product.price) || 0,
        oldPrice: Number(product.old_price ?? product.oldPrice) || 0,
        discount: Number(product.discount) || 0,
        condition: product.condition || "New",
        rating: Number(product.rating) || 0,
        reviews: Number(product.reviews) || 0,
        stock: Number(product.stock) || 0,
        category: product.category || "",
        image: product.image || "",
        images: parseArray(product.images),
        description: product.description || "",
        renewed: product.renewed === true,
        informationSections: parseArray(
            product.information_sections || product.informationSections
        ),
        customerReviews: parseArray(
            product.customer_reviews || product.customerReviews
        )
    };
}


/* ========================================
   PARSE ARRAY
======================================== */

function parseArray(value) {
    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    return [];
}


/* ========================================
   FORMAT PRICE
======================================== */

function formatPrice(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "0.00";
    return number.toFixed(2);
}


/* ========================================
   PRODUCT INFORMATION
======================================== */

function renderProductInformation(product) {
    const sections = Array.isArray(product.informationSections)
        ? product.informationSections
        : [];

    const oldBox = document.getElementById("dynamicProductInformation");
    if (oldBox) oldBox.remove();

    if (sections.length === 0) return;

    const box = document.createElement("section");
    box.id = "dynamicProductInformation";
    box.style.cssText = "margin-top:40px;border-top:1px solid #ddd;padding-top:25px;";

    const heading = document.createElement("h2");
    heading.innerText = "Product Information";
    heading.style.cssText = "font-size:25px;margin-bottom:15px;";
    box.appendChild(heading);

    sections.forEach(section => {
        if (!section || typeof section !== "object") return;

        const item = document.createElement("div");
        item.style.cssText = "border-top:1px solid #ddd;";

        const button = document.createElement("button");
        button.type = "button";
        button.style.cssText = `
            width:100%;padding:17px 5px;background:white;border:0;
            display:flex;justify-content:space-between;align-items:center;
            cursor:pointer;text-align:left;font-size:17px;font-weight:bold;color:#111;
        `;

        const title = document.createElement("span");
        title.innerText = section.title || "Information";

        const arrow = document.createElement("span");
        arrow.innerText = ">";
        arrow.style.cssText = "font-size:22px;color:#555;transition:transform .2s;";

        button.appendChild(title);
        button.appendChild(arrow);

        const content = document.createElement("div");
        content.style.cssText = "display:none;padding:0 35px 20px 5px;color:#333;line-height:1.7;font-size:15px;";

        if (section.content) {
            const text = document.createElement("div");
            text.innerText = section.content;
            text.style.whiteSpace = "pre-line";
            content.appendChild(text);
        }

        if (section.image) {
            const image = document.createElement("img");
            image.src = section.image;
            image.alt = section.title || "Product information";
            image.loading = "lazy";
            image.decoding = "async";
            image.style.cssText = "display:block;max-width:100%;max-height:400px;object-fit:contain;margin-top:15px;";
            content.appendChild(image);
        }

        button.onclick = function () {
            const open = content.style.display === "block";
            content.style.display = open ? "none" : "block";
            arrow.style.transform = open ? "rotate(0deg)" : "rotate(90deg)";
        };

        item.appendChild(button);
        item.appendChild(content);
        box.appendChild(item);
    });

    const related = document.querySelector(".related-products");
    const description = document.querySelector(".product-description");

    if (related) {
        related.parentNode.insertBefore(box, related);
    } else if (description) {
        description.parentNode.insertBefore(box, description.nextSibling);
    }
}


/* ========================================
   CUSTOMER REVIEWS
======================================== */

function renderCustomerReviews(product) {
    const reviews = Array.isArray(product.customerReviews)
        ? product.customerReviews
        : [];

    const oldReviews = document.getElementById("dynamicCustomerReviews");
    if (oldReviews) oldReviews.remove();

    if (reviews.length === 0) return;

    const box = document.createElement("section");
    box.id = "dynamicCustomerReviews";
    box.style.cssText = "margin-top:40px;border-top:1px solid #ddd;padding-top:25px;";

    const heading = document.createElement("h2");
    heading.innerText = "Customer Reviews";
    box.appendChild(heading);

    reviews.forEach(review => {
        if (!review || typeof review !== "object") return;

        const reviewBox = document.createElement("div");
        reviewBox.style.cssText = "border-bottom:1px solid #ddd;padding:20px 0;";

        const name = document.createElement("strong");
        name.innerText = review.reviewer || review.name || "Customer";
        reviewBox.appendChild(name);

        const stars = document.createElement("div");
        stars.innerText = getProductStars(Number(review.rating) || 0);
        stars.style.cssText = "color:#e47911;font-size:18px;margin:5px 0;";
        reviewBox.appendChild(stars);

        if (review.title) {
            const title = document.createElement("h3");
            title.innerText = review.title;
            reviewBox.appendChild(title);
        }

        if (review.date) {
            const date = document.createElement("small");
            date.innerText = review.date;
            date.style.color = "#666";
            reviewBox.appendChild(date);
        }

        if (review.text) {
            const text = document.createElement("p");
            text.innerText = review.text;
            text.style.lineHeight = "1.6";
            reviewBox.appendChild(text);
        }

        if (review.image) {
            const image = document.createElement("img");
            image.src = review.image;
            image.alt = "Customer review image";
            image.loading = "lazy";
            image.decoding = "async";
            image.style.cssText = "max-width:250px;max-height:250px;object-fit:contain;display:block;border:1px solid #ddd;";
            reviewBox.appendChild(image);
        }

        box.appendChild(reviewBox);
    });

    const related = document.querySelector(".related-products");
    if (related) {
        related.parentNode.insertBefore(box, related);
    } else {
        const page = document.querySelector(".product-page");
        if (page) page.appendChild(box);
    }
}


/* ========================================
   RELATED PRODUCTS (with Buy Now button)
======================================== */

/* ========================================
   RELATED PRODUCTS (Fixed Equal Height + Buy Now)
======================================== */

function renderRelatedProducts(allProducts, currentProduct) {
    const grid = document.querySelector(".related-grid");
    if (!grid) return;

    grid.innerHTML = "";

    // Grid ko flex/grid style do taake equal height rahe
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(220px, 1fr))";
    grid.style.gap = "20px";
    grid.style.alignItems = "stretch";

    allProducts.forEach(item => {
        if (Number(item.id) === Number(currentProduct.id)) return;

        const card = document.createElement("div");
        card.className = "related-card";
        card.style.cssText = `
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 12px;
            box-sizing: border-box;
        `;

        let image = item.image || "";
        let imageHTML = "";

        if (image) {
            imageHTML = `
                <img
                    src="${escapeAttribute(image)}"
                    alt="${escapeAttribute(item.title)}"
                    loading="lazy"
                    decoding="async"
                    style="width:100%;height:100%;object-fit:contain;"
                >
            `;
        } else {
            let emoji = "📦";
            if (item.category === "Mobiles") emoji = "📱";
            else if (item.category === "Electronics") emoji = "🎧";
            else if (item.category === "Computers") emoji = "💻";

            imageHTML = `<span style="font-size:60px;">${emoji}</span>`;
        }

        card.innerHTML = `
            <div class="related-image" style="
                height: 160px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                margin-bottom: 10px;
            ">
                ${imageHTML}
            </div>

            <h3 style="
                font-size: 14px;
                line-height: 1.35;
                height: 38px;
                overflow: hidden;
                margin: 0 0 6px 0;
                cursor: pointer;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            ">
                ${escapeHTML(item.title)}
            </h3>

            <div class="rating" style="margin-bottom: 6px; font-size: 13px;">
                ${getProductStars(item.rating)}
                <span>(${item.reviews})</span>
            </div>

            <div class="related-price" style="
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 12px;
            ">
                $${formatPrice(item.price)}
            </div>

            <div style="margin-top: auto;">
                <button
                    class="related-buy-btn"
                    style="
                        width: 100%;
                        padding: 8px 12px;
                        background: #ffa41c;
                        border: 1px solid #ff8f00;
                        border-radius: 20px;
                        font-size: 14px;
                        cursor: pointer;
                        font-weight: 500;
                    "
                >
                    Buy Now
                </button>
            </div>
        `;

        // Image + Title click → product page
        const goToProduct = function () {
            window.location.href = "product.html?id=" + encodeURIComponent(item.id);
        };

        card.querySelector(".related-image").onclick = goToProduct;
        card.querySelector("h3").onclick = goToProduct;

        // Buy Now button
        const buyBtn = card.querySelector(".related-buy-btn");
        buyBtn.onclick = function (e) {
            e.stopPropagation();

            if (typeof cart !== "undefined") {
                cart.length = 0;
                cart.push({
                    name: item.title,
                    price: item.price
                });

                if (typeof saveCart === "function") saveCart();
                if (typeof updateCartCount === "function") updateCartCount();
                if (typeof updateCart === "function") updateCart();
            }

            window.location.href = "checkout.html";
        };

        grid.appendChild(card);
    });
}

/* ========================================
   PRODUCT NOT FOUND
======================================== */

function showProductNotFound() {
    const productPage = document.querySelector(".product-page");
    if (!productPage) return;

    productPage.innerHTML = `
        <div style="text-align:center;padding:80px 20px;">
            <h1>Product not found</h1>
            <p>This product could not be loaded.</p>
            <br>
            <button
                type="button"
                onclick="window.location.href='index.html'"
                style="padding:12px 25px;background:#ffd814;border:1px solid #fcd200;border-radius:20px;cursor:pointer;"
            >
                Back to Products
            </button>
        </div>
    `;
}


/* ========================================
   STARS
======================================== */

function getProductStars(rating) {
    let stars = "";
    const number = Number(rating) || 0;

    for (let i = 1; i <= 5; i++) {
        stars += i <= Math.floor(number) ? "★" : "☆";
    }

    return stars;
}


/* ========================================
   HTML ESCAPE
======================================== */

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
    return escapeHTML(value);
}


/* ========================================
   START
======================================== */

loadProductPage();