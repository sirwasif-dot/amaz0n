/* ========================================
   DYNAMIC PRODUCT PAGE
   SUPABASE REST + LOCAL FALLBACK
======================================== */

async function loadProductPage() {

    console.log("=== AMAZ0N PRODUCT PAGE START ===");

    try {

        /* ========================================
           GET PRODUCT ID
        ======================================== */

        const params =
            new URLSearchParams(
                window.location.search
            );

        const rawId =
            params.get("id");

        const productId =
            Number(rawId);

        console.log("URL:", window.location.href);
        console.log("Raw ID:", rawId);
        console.log("Product ID:", productId);


        if (!rawId || !Number.isFinite(productId)) {

            console.error("Invalid product ID");

            showProductNotFound();

            return;

        }


        /* ========================================
           SUPABASE SETTINGS
        ======================================== */

        const SUPABASE_URL =
            "https://couztwgxdpisnqurlvbs.supabase.co";

        const SUPABASE_KEY =
            "sb_publishable_V6cuw9f9Q6aAYsd_4xGebQ_cZcEZSTU";


        /* ========================================
           GET ALL PRODUCTS
        ======================================== */

        let allProducts = [];


        try {

            const response =
                await fetch(
                    SUPABASE_URL +
                    "/rest/v1/products?select=*&order=id.asc",
                    {
                        method: "GET",

                        headers: {
                            "apikey": SUPABASE_KEY,
                            "Authorization":
                                "Bearer " +
                                SUPABASE_KEY
                        }
                    }
                );


            console.log(
                "Supabase HTTP status:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    "Supabase HTTP error " +
                    response.status
                );

            }


            const data =
                await response.json();


            console.log(
                "Supabase products:",
                data
            );


            if (Array.isArray(data)) {

                allProducts =
                    data.map(
                        normalizeProduct
                    );

            }

        }

        catch (supabaseError) {

            console.error(
                "Supabase fetch failed:",
                supabaseError
            );

        }


        /* ========================================
           LOCAL PRODUCTS FALLBACK
        ======================================== */

        if (
            allProducts.length === 0 &&
            typeof products !== "undefined" &&
            Array.isArray(products)
        ) {

            console.log(
                "Using products.js fallback"
            );


            allProducts =
                products.map(
                    normalizeProduct
                );

        }


        console.log(
            "All available product IDs:",
            allProducts.map(
                item => item.id
            )
        );


        /* ========================================
           FIND PRODUCT
        ======================================== */

        const product =
            allProducts.find(
                item =>
                    Number(item.id) ===
                    productId
            );


        console.log(
            "Selected product:",
            product
        );


        /* ========================================
           PRODUCT NOT FOUND
        ======================================== */

        if (!product) {

            console.error(
                "Product not found.",
                "Requested:",
                productId,
                "Available:",
                allProducts.map(
                    item => item.id
                )
            );

            showProductNotFound();

            return;

        }


        /* ========================================
           PAGE TITLE
        ======================================== */

        document.title =
            product.title +
            " | amaz0n";


        /* ========================================
           IMAGES
        ======================================== */

        let productImages = [];


        if (
            Array.isArray(product.images)
        ) {

            productImages =
                product.images.filter(
                    image =>
                        typeof image === "string" &&
                        image.trim() !== ""
                );

        }


        if (
            productImages.length === 0 &&
            product.image
        ) {

            productImages = [
                product.image
            ];

        }


        /* ========================================
           BREADCRUMB
        ======================================== */

        const breadcrumb =
            document.querySelector(
                ".product-breadcrumb"
            );


        if (breadcrumb) {

            let categoryPath = [];


            if (
                Array.isArray(
                    product.categoryPath
                )
            ) {

                categoryPath =
                    product.categoryPath;

            }

            else if (
                product.category
            ) {

                categoryPath = [
                    product.category
                ];

            }


            let html = `

                <a
                    href="index.html"
                    style="
                        color:#007185;
                        text-decoration:none;
                        font-weight:500;
                    "
                >
                    Home
                </a>

            `;


            categoryPath.forEach(
                function(category) {

                    html += `

                        <span
                            style="
                                margin:0 6px;
                                color:#777;
                            "
                        >
                            ›
                        </span>

                        <a
                            href="index.html?category=${encodeURIComponent(category)}"
                            style="
                                color:#007185;
                                text-decoration:none;
                            "
                        >
                            ${escapeHTML(category)}
                        </a>

                    `;

                }
            );


            html += `

                <span
                    style="
                        margin:0 6px;
                        color:#777;
                    "
                >
                    ›
                </span>

                <span style="color:#555;">
                    ${escapeHTML(product.title)}
                </span>

            `;


            breadcrumb.innerHTML =
                html;

        }


        /* ========================================
           TITLE
        ======================================== */

        const title =
            document.querySelector(
                ".product-info h1"
            );


        if (title) {

            title.innerText =
                product.title;

        }


        /* ========================================
           PRICE
        ======================================== */

        const price =
            document.querySelector(
                ".discount-price"
            );


        if (price) {

            price.innerHTML =
                `<sup>$</sup>${product.price.toFixed(2)}`;

        }


        /* ========================================
           OLD PRICE
        ======================================== */

        const oldPrice =
            document.querySelector(
                ".old-price"
            );


        if (oldPrice) {

            if (
                product.oldPrice >
                product.price
            ) {

                oldPrice.innerHTML =
                    `List Price:
                    <del>
                        $${product.oldPrice.toFixed(2)}
                    </del>`;

            }

            else {

                oldPrice.innerHTML =
                    "";

            }

        }


        /* ========================================
           DISCOUNT
        ======================================== */

        const discount =
            document.querySelector(
                ".product-info > div[style]"
            );


        if (
            discount &&
            product.discount
        ) {

            discount.innerText =
                product.discount +
                "% off";

        }


        /* ========================================
           CONDITION
        ======================================== */

        const condition =
            document.querySelector(
                ".condition"
            );


        if (condition) {

            condition.innerHTML =
                `Condition:
                <strong>
                    ${escapeHTML(product.condition)}
                </strong>`;

        }


        /* ========================================
           STOCK
        ======================================== */

        const stock =
            document.querySelector(
                ".stock"
            );


        if (stock) {

            if (
                product.stock <= 0
            ) {

                stock.innerText =
                    "Out of Stock";

                stock.style.color =
                    "#cc0000";

            }

            else if (
                product.stock <= 5
            ) {

                stock.innerText =
                    "Only " +
                    product.stock +
                    " left in stock";

                stock.style.color =
                    "#b12704";

            }

            else {

                stock.innerText =
                    "In Stock";

                stock.style.color =
                    "#007600";

            }

        }


        /* ========================================
           RATING
        ======================================== */

        const rating =
            document.querySelector(
                ".rating span"
            );


        if (rating) {

            rating.innerText =
                `${product.rating} (${product.reviews} ratings)`;

        }


        /* ========================================
           DESCRIPTION
        ======================================== */

        const description =
            document.querySelector(
                ".product-description p"
            );


        if (description) {

            description.innerText =
                product.description || "";

        }


        /* ========================================
           MAIN IMAGE
        ======================================== */

        const mainImage =
            document.querySelector(
                ".main-product-image"
            );


        if (mainImage) {

            if (
                productImages.length > 0
            ) {

                mainImage.innerHTML = `

                    <img
                        id="mainProductImage"
                        src="${productImages[0]}"
                        alt="${escapeHTML(product.title)}"
                        style="
                            max-width:100%;
                            max-height:100%;
                            width:100%;
                            height:100%;
                            object-fit:contain;
                            display:block;
                        "
                    >

                `;


                let thumbnailContainer =
                    document.querySelector(
                        ".product-thumbnails"
                    );


                if (!thumbnailContainer) {

                    thumbnailContainer =
                        document.createElement(
                            "div"
                        );

                    thumbnailContainer.className =
                        "product-thumbnails";


                    mainImage.parentNode.insertBefore(
                        thumbnailContainer,
                        mainImage.nextSibling
                    );

                }


                thumbnailContainer.innerHTML =
                    "";


                productImages.forEach(
                    function(image, index) {

                        const thumb =
                            document.createElement(
                                "div"
                            );


                        thumb.className =
                            "product-thumb";


                        thumb.style.cssText = `

                            width:70px;
                            height:70px;
                            border:2px solid ${
                                index === 0
                                    ? "#007185"
                                    : "#ddd"
                            };
                            border-radius:5px;
                            padding:3px;
                            cursor:pointer;
                            background:#fff;
                            box-sizing:border-box;
                            overflow:hidden;

                        `;


                        thumb.innerHTML = `

                            <img
                                src="${image}"
                                alt=""
                                style="
                                    width:100%;
                                    height:100%;
                                    object-fit:contain;
                                "
                            >

                        `;


                        thumb.onclick =
                            function() {

                                const main =
                                    document.getElementById(
                                        "mainProductImage"
                                    );


                                if (main) {

                                    main.src =
                                        image;

                                }


                                thumbnailContainer
                                    .querySelectorAll(
                                        ".product-thumb"
                                    )
                                    .forEach(
                                        function(item) {

                                            item.style.border =
                                                "2px solid #ddd";

                                        }
                                    );


                                thumb.style.border =
                                    "2px solid #007185";

                            };


                        thumbnailContainer.appendChild(
                            thumb
                        );

                    }
                );

            }

            else {

                let emoji =
                    "📦";


                if (
                    product.category ===
                    "Mobiles"
                ) {

                    emoji =
                        "📱";

                }

                else if (
                    product.category ===
                    "Electronics"
                ) {

                    emoji =
                        "🎧";

                }

                else if (
                    product.category ===
                    "Computers"
                ) {

                    emoji =
                        "💻";

                }


                mainImage.innerHTML = `

                    <span
                        style="
                            font-size:100px;
                        "
                    >
                        ${emoji}
                    </span>

                `;

            }

        }


        /* ========================================
           ADD TO CART
        ======================================== */

        const addButton =
            document.querySelector(
                ".add-button"
            );


        if (addButton) {

            if (
                product.stock <= 0
            ) {

                addButton.innerText =
                    "Out of Stock";

                addButton.disabled =
                    true;

                addButton.style.background =
                    "#ddd";

                addButton.style.cursor =
                    "not-allowed";

            }

            else {

                addButton.onclick =
                    function() {

                        if (
                            typeof addToCart ===
                            "function"
                        ) {

                            addToCart(
                                product.title,
                                product.price
                            );

                        }

                    };

            }

        }


        /* ========================================
           PRODUCT INFORMATION
        ======================================== */

        renderProductInformation(
            product
        );


        /* ========================================
           CUSTOMER REVIEWS
        ======================================== */

        renderCustomerReviews(
            product
        );


        /* ========================================
           RELATED PRODUCTS
        ======================================== */

        renderRelatedProducts(
            allProducts,
            product
        );


        console.log(
            "=== PRODUCT PAGE LOADED SUCCESSFULLY ==="
        );

    }

    catch (error) {

        console.error(
            "PRODUCT PAGE FATAL ERROR:",
            error
        );

        showProductNotFound();

    }

}


/* ========================================
   NORMALIZE PRODUCT
======================================== */

function normalizeProduct(product) {

    return {

        id:
            Number(product.id),

        title:
            product.title || "",

        price:
            Number(product.price) || 0,

        oldPrice:
            Number(
                product.old_price ??
                product.oldPrice
            ) || 0,

        discount:
            Number(product.discount) || 0,

        condition:
            product.condition || "New",

        rating:
            Number(product.rating) || 0,

        reviews:
            Number(product.reviews) || 0,

        stock:
            Number(product.stock) || 0,

        category:
            product.category || "",

        image:
            product.image || "",

        images:
            parseArray(
                product.images
            ),

        description:
            product.description || "",

        renewed:
            product.renewed === true,

        informationSections:
            parseArray(
                product.information_sections ||
                product.informationSections
            ),

        customerReviews:
            parseArray(
                product.customer_reviews ||
                product.customerReviews
            )

    };

}


/* ========================================
   JSON ARRAY HELPER
======================================== */

function parseArray(value) {

    if (
        Array.isArray(value)
    ) {

        return value;

    }


    if (
        typeof value === "string"
    ) {

        try {

            const parsed =
                JSON.parse(value);

            return Array.isArray(parsed)
                ? parsed
                : [];

        }

        catch (error) {

            return [];

        }

    }


    return [];

}


/* ========================================
   PRODUCT INFORMATION
======================================== */

function renderProductInformation(product) {

    const sections =
        Array.isArray(
            product.informationSections
        )
        ? product.informationSections
        : [];


    const oldBox =
        document.getElementById(
            "dynamicProductInformation"
        );


    if (oldBox) {

        oldBox.remove();

    }


    if (
        sections.length === 0
    ) {

        return;

    }


    const box =
        document.createElement(
            "section"
        );


    box.id =
        "dynamicProductInformation";


    box.style.cssText = `

        margin-top:40px;
        border-top:1px solid #ddd;
        padding-top:25px;

    `;


    const heading =
        document.createElement(
            "h2"
        );


    heading.innerText =
        "Product Information";


    heading.style.cssText = `

        font-size:25px;
        margin-bottom:15px;

    `;


    box.appendChild(
        heading
    );


    sections.forEach(
        function(section) {

            const item =
                document.createElement(
                    "div"
                );


            item.style.cssText =
                "border-top:1px solid #ddd;";


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.style.cssText = `

                width:100%;
                padding:17px 5px;
                background:white;
                border:0;
                display:flex;
                justify-content:space-between;
                align-items:center;
                cursor:pointer;
                text-align:left;
                font-size:17px;
                font-weight:bold;
                color:#111;

            `;


            const title =
                document.createElement(
                    "span"
                );


            title.innerText =
                section.title ||
                "Information";


            const arrow =
                document.createElement(
                    "span"
                );


            arrow.innerText =
                ">";


            arrow.style.cssText = `

                font-size:22px;
                color:#555;
                transition:transform .2s;

            `;


            button.appendChild(
                title
            );

            button.appendChild(
                arrow
            );


            const content =
                document.createElement(
                    "div"
                );


            content.style.cssText = `

                display:none;
                padding:0 35px 20px 5px;
                color:#333;
                line-height:1.7;
                font-size:15px;

            `;


            if (
                section.content
            ) {

                const text =
                    document.createElement(
                        "div"
                    );


                text.innerText =
                    section.content;


                text.style.whiteSpace =
                    "pre-line";


                content.appendChild(
                    text
                );

            }


            if (
                section.image
            ) {

                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    section.image;


                image.alt =
                    section.title ||
                    "Product information";


                image.style.cssText = `

                    display:block;
                    max-width:100%;
                    max-height:400px;
                    object-fit:contain;
                    margin-top:15px;

                `;


                content.appendChild(
                    image
                );

            }


            button.onclick =
                function() {

                    const open =
                        content.style.display ===
                        "block";


                    if (open) {

                        content.style.display =
                            "none";

                        arrow.style.transform =
                            "rotate(0deg)";

                    }

                    else {

                        content.style.display =
                            "block";

                        arrow.style.transform =
                            "rotate(90deg)";

                    }

                };


            item.appendChild(
                button
            );

            item.appendChild(
                content
            );

            box.appendChild(
                item
            );

        }
    );


    const related =
        document.querySelector(
            ".related-products"
        );


    const description =
        document.querySelector(
            ".product-description"
        );


    if (related) {

        related.parentNode.insertBefore(
            box,
            related
        );

    }

    else if (description) {

        description.parentNode.insertBefore(
            box,
            description.nextSibling
        );

    }

}


/* ========================================
   CUSTOMER REVIEWS
======================================== */

function renderCustomerReviews(product) {

    const reviews =
        Array.isArray(
            product.customerReviews
        )
        ? product.customerReviews
        : [];


    const oldReviews =
        document.getElementById(
            "dynamicCustomerReviews"
        );


    if (oldReviews) {

        oldReviews.remove();

    }


    if (
        reviews.length === 0
    ) {

        return;

    }


    const box =
        document.createElement(
            "section"
        );


    box.id =
        "dynamicCustomerReviews";


    box.style.cssText = `

        margin-top:40px;
        border-top:1px solid #ddd;
        padding-top:25px;

    `;


    const heading =
        document.createElement(
            "h2"
        );


    heading.innerText =
        "Customer Reviews";


    box.appendChild(
        heading
    );


    reviews.forEach(
        function(review) {

            const reviewBox =
                document.createElement(
                    "div"
                );


            reviewBox.style.cssText = `

                border-bottom:1px solid #ddd;
                padding:20px 0;

            `;


            const name =
                document.createElement(
                    "strong"
                );


            name.innerText =
                review.reviewer ||
                review.name ||
                "Customer";


            reviewBox.appendChild(
                name
            );


            const stars =
                document.createElement(
                    "div"
                );


            stars.innerText =
                getProductStars(
                    Number(
                        review.rating
                    ) || 0
                );


            stars.style.cssText = `

                color:#e47911;
                font-size:18px;
                margin:5px 0;

            `;


            reviewBox.appendChild(
                stars
            );


            if (
                review.title
            ) {

                const title =
                    document.createElement(
                        "h3"
                    );


                title.innerText =
                    review.title;


                reviewBox.appendChild(
                    title
                );

            }


            if (
                review.date
            ) {

                const date =
                    document.createElement(
                        "small"
                    );


                date.innerText =
                    review.date;


                date.style.color =
                    "#666";


                reviewBox.appendChild(
                    date
                );

            }


            if (
                review.text
            ) {

                const text =
                    document.createElement(
                        "p"
                    );


                text.innerText =
                    review.text;


                text.style.lineHeight =
                    "1.6";


                reviewBox.appendChild(
                    text
                );

            }


            if (
                review.image
            ) {

                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    review.image;


                image.style.cssText = `

                    max-width:250px;
                    max-height:250px;
                    object-fit:contain;
                    display:block;
                    border:1px solid #ddd;

                `;


                reviewBox.appendChild(
                    image
                );

            }


            box.appendChild(
                reviewBox
            );

        }
    );


    const related =
        document.querySelector(
            ".related-products"
        );


    if (related) {

        related.parentNode.insertBefore(
            box,
            related
        );

    }

    else {

        const page =
            document.querySelector(
                ".product-page"
            );


        if (page) {

            page.appendChild(
                box
            );

        }

    }

}


/* ========================================
   RELATED PRODUCTS
======================================== */

function renderRelatedProducts(
    allProducts,
    currentProduct
) {

    const grid =
        document.querySelector(
            ".related-grid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML =
        "";


    allProducts.forEach(
        function(item) {

            if (
                Number(item.id) ===
                Number(currentProduct.id)
            ) {

                return;

            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "related-card";


            let imageHTML =
                "";


            let images =
                Array.isArray(item.images)
                    ? item.images
                    : [];


            if (
                images.length === 0 &&
                item.image
            ) {

                images = [
                    item.image
                ];

            }


            if (
                images.length > 0
            ) {

                imageHTML = `

                    <img
                        src="${images[0]}"
                        alt=""
                        style="
                            width:100%;
                            height:100%;
                            object-fit:contain;
                        "
                    >

                `;

            }

            else {

                let emoji =
                    "📦";


                if (
                    item.category ===
                    "Mobiles"
                ) {

                    emoji =
                        "📱";

                }

                else if (
                    item.category ===
                    "Electronics"
                ) {

                    emoji =
                        "🎧";

                }

                else if (
                    item.category ===
                    "Computers"
                ) {

                    emoji =
                        "💻";

                }


                imageHTML = `

                    <span
                        style="
                            font-size:60px;
                        "
                    >
                        ${emoji}
                    </span>

                `;

            }


            card.innerHTML = `

                <div
                    class="related-image"
                    style="
                        overflow:hidden;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                    "
                >
                    ${imageHTML}
                </div>

                <h3>
                    ${escapeHTML(item.title)}
                </h3>

                <div class="rating">

                    ${getProductStars(
                        item.rating
                    )}

                    <span>
                        (${item.reviews})
                    </span>

                </div>

                <div class="related-price">

                    $${item.price.toFixed(2)}

                </div>

            `;


            card.onclick =
                function() {

                    window.location.href =
                        "product.html?id=" +
                        encodeURIComponent(
                            item.id
                        );

                };


            grid.appendChild(
                card
            );

        }
    );

}


/* ========================================
   PRODUCT NOT FOUND
======================================== */

function showProductNotFound() {

    const productPage =
        document.querySelector(
            ".product-page"
        );


    if (!productPage) {

        return;

    }


    productPage.innerHTML = `

        <div
            style="
                text-align:center;
                padding:80px 20px;
            "
        >

            <h1>
                Product not found
            </h1>

            <p>
                This product could not be loaded.
            </p>

            <br>

            <button
                type="button"
                onclick="
                    window.location.href='index.html'
                "
                style="
                    padding:12px 25px;
                    background:#ffd814;
                    border:1px solid #fcd200;
                    border-radius:20px;
                    cursor:pointer;
                "
            >
                Back to Products
            </button>

        </div>

    `;

}


/* ========================================
   STARS
======================================== */

function getProductStars(
    rating
) {

    let stars =
        "";


    const number =
        Number(rating) || 0;


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        stars +=
            i <= Math.floor(number)
                ? "★"
                : "☆";

    }


    return stars;

}


/* ========================================
   HTML ESCAPE
======================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ========================================
   START
======================================== */

loadProductPage();