/* ========================================
   DYNAMIC PRODUCT PAGE
   SUPABASE PRODUCTS
======================================== */

async function loadProductPage() {

    try {

        const SUPABASE_URL =
            "https://couztwgxdpisnqurlvbs.supabase.co";

        const SUPABASE_KEY =
            "sb_publishable_V6cuw9f9Q6aAYsd_4xGebQ_cZcEZSTU";

        const supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );


        // ========================================
        // PRODUCT ID
        // ========================================

        const urlParams =
            new URLSearchParams(
                window.location.search
            );


        const productId =
            Number(
                urlParams.get("id")
            );


        // ========================================
        // GET PRODUCTS FROM SUPABASE
        // ========================================

        const { data, error } =
            await supabaseClient
                .from("products")
                .select("*")
                .order("id", {
                    ascending: true
                });


        if (error) {

            console.error(
                "Supabase product error:",
                error
            );

            showProductNotFound();

            return;

        }


        const allProducts =
            Array.isArray(data)
                ? data.map(function(product) {

                    return {

                        id:
                            Number(product.id),

                        title:
                            product.title || "",

                        price:
                            Number(product.price) || 0,

                        oldPrice:
                            Number(product.old_price) || 0,

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
                            Array.isArray(product.images)
                                ? product.images
                                : (
                                    product.image
                                        ? [product.image]
                                        : []
                                ),

                        description:
                            product.description || "",

                        renewed:
                            product.renewed === true,

                        informationSections:
                            Array.isArray(
                                product.information_sections
                            )
                            ? product.information_sections
                            : [],

                        customerReviews:
                            Array.isArray(
                                product.customer_reviews
                            )
                            ? product.customer_reviews
                            : []

                    };

                })
                : [];


        // ========================================
        // FIND PRODUCT
        // ========================================

        const product =
            allProducts.find(
                item =>
                    Number(item.id) ===
                    Number(productId)
            );


        // ========================================
        // PRODUCT NOT FOUND
        // ========================================

        if (!product) {

            showProductNotFound();

            return;

        }


        // ========================================
        // PAGE TITLE
        // ========================================

        document.title =
            product.title +
            " | amaz0n";


        // ========================================
        // PRODUCT IMAGES
        // ========================================

        let productImages = [];


        if (
            Array.isArray(product.images) &&
            product.images.length > 0
        ) {

            productImages =
                product.images.filter(
                    image => image
                );

        }

        else if (product.image) {

            productImages = [
                product.image
            ];

        }


        // ========================================
        // BREADCRUMB
        // ========================================

        const breadcrumb =
            document.querySelector(
                ".product-breadcrumb"
            );


        if (breadcrumb) {

            let breadcrumbItems = [];


            breadcrumbItems.push(`

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

            `);


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
                product.category ===
                "Mobiles"
            ) {

                categoryPath = [
                    "Electronics",
                    "Mobiles",
                    "Smartphones"
                ];

            }

            else if (
                product.category ===
                "Electronics"
            ) {

                categoryPath = [
                    "Electronics"
                ];

            }

            else if (
                product.category ===
                "Computers"
            ) {

                categoryPath = [
                    "Computers"
                ];

            }

            else if (product.category) {

                categoryPath = [
                    product.category
                ];

            }


            categoryPath.forEach(
                function(category) {

                    breadcrumbItems.push(`

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
                                font-weight:500;
                            "
                        >
                            ${category}
                        </a>

                    `);

                }
            );


            breadcrumbItems.push(`

                <span
                    style="
                        margin:0 6px;
                        color:#777;
                    "
                >
                    ›
                </span>

                <span
                    style="
                        color:#555;
                    "
                >
                    ${product.title}
                </span>

            `);


            breadcrumb.innerHTML =
                breadcrumbItems.join("");

        }


        // ========================================
        // TITLE
        // ========================================

        const title =
            document.querySelector(
                ".product-info h1"
            );


        if (title) {

            title.innerText =
                product.title;

        }


        // ========================================
        // PRICE
        // ========================================

        const price =
            document.querySelector(
                ".discount-price"
            );


        if (price) {

            price.innerHTML =
                `<sup>$</sup>${Number(
                    product.price
                ).toFixed(2)}`;

        }


        // ========================================
        // OLD PRICE
        // ========================================

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
                        $${Number(
                            product.oldPrice
                        ).toFixed(2)}
                    </del>`;

            }

            else {

                oldPrice.innerHTML =
                    "";

            }

        }


        // ========================================
        // DISCOUNT
        // ========================================

        const discount =
            document.querySelector(
                ".product-info > div[style]"
            );


        if (discount) {

            discount.innerText =
                product.discount +
                "% off";

        }


        // ========================================
        // CONDITION
        // ========================================

        const condition =
            document.querySelector(
                ".condition"
            );


        if (condition) {

            condition.innerHTML =
                `Condition:
                <strong>
                    ${product.condition}
                </strong>`;

        }


        // ========================================
        // STOCK
        // ========================================

        const stock =
            document.querySelector(
                ".stock"
            );


        if (stock) {

            if (product.stock <= 0) {

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


        // ========================================
        // RATING
        // ========================================

        const rating =
            document.querySelector(
                ".rating span"
            );


        if (rating) {

            rating.innerText =
                `${product.rating} (${product.reviews} ratings)`;

        }


        // ========================================
        // DESCRIPTION
        // ========================================

        const description =
            document.querySelector(
                ".product-description p"
            );


        if (description) {

            description.innerText =
                product.description || "";

        }


        // ========================================
        // MAIN PRODUCT IMAGE
        // ========================================

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
                        alt="${product.title}"
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

                        const thumbnail =
                            document.createElement(
                                "div"
                            );


                        thumbnail.className =
                            "product-thumb";


                        thumbnail.style.cssText = `

                            width:70px;
                            height:70px;
                            border:
                                2px solid
                                ${index === 0
                                    ? "#007185"
                                    : "#ddd"};
                            border-radius:5px;
                            padding:3px;
                            cursor:pointer;
                            background:#fff;
                            box-sizing:border-box;
                            overflow:hidden;

                        `;


                        thumbnail.innerHTML = `

                            <img
                                src="${image}"
                                alt="${product.title}"
                                style="
                                    width:100%;
                                    height:100%;
                                    object-fit:contain;
                                "
                            >

                        `;


                        thumbnail.onclick =
                            function() {

                                const main =
                                    document.querySelector(
                                        "#mainProductImage"
                                    );


                                if (main) {

                                    main.src =
                                        image;

                                }


                                const allThumbs =
                                    thumbnailContainer.querySelectorAll(
                                        ".product-thumb"
                                    );


                                allThumbs.forEach(
                                    function(item) {

                                        item.style.border =
                                            "2px solid #ddd";

                                    }
                                );


                                thumbnail.style.border =
                                    "2px solid #007185";

                            };


                        thumbnailContainer.appendChild(
                            thumbnail
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


                if (
                    product.category ===
                    "Electronics"
                ) {

                    emoji =
                        "🎧";

                }


                if (
                    product.category ===
                    "Computers"
                ) {

                    emoji =
                        "💻";

                }


                mainImage.innerHTML =
                    `<span style="font-size:100px;">
                        ${emoji}
                    </span>`;

            }

        }


        // ========================================
        // PRODUCT INFORMATION
        // ========================================

        function renderProductInformation() {

            const sections =
                Array.isArray(
                    product.informationSections
                )
                ? product.informationSections
                : (
                    Array.isArray(
                        product.infoSections
                    )
                    ? product.infoSections
                    : []
                );


            const oldInformation =
                document.getElementById(
                    "dynamicProductInformation"
                );


            if (oldInformation) {

                oldInformation.remove();

            }


            if (
                sections.length === 0
            ) {

                return;

            }


            const informationBox =
                document.createElement(
                    "section"
                );


            informationBox.id =
                "dynamicProductInformation";


            informationBox.className =
                "dynamic-product-information";


            informationBox.style.cssText = `

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


            informationBox.appendChild(
                heading
            );


            sections.forEach(
                function(section) {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.style.cssText = `

                        border-top:1px solid #ddd;

                    `;


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


                    const titleText =
                        document.createElement(
                            "span"
                        );


                    titleText.innerText =
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
                        font-weight:normal;
                        color:#555;
                        display:inline-block;
                        width:25px;
                        text-align:center;
                        transition:transform 0.2s ease;

                    `;


                    button.appendChild(
                        titleText
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

                        const sectionImage =
                            document.createElement(
                                "img"
                            );


                        sectionImage.src =
                            section.image;


                        sectionImage.alt =
                            section.title ||
                            "Product information";


                        sectionImage.style.cssText = `

                            display:block;
                            max-width:100%;
                            max-height:400px;
                            object-fit:contain;
                            margin-top:15px;

                        `;


                        sectionImage.onerror =
                            function() {

                                this.style.display =
                                    "none";

                            };


                        content.appendChild(
                            sectionImage
                        );

                    }


                    button.onclick =
                        function() {

                            const isOpen =
                                content.style.display ===
                                "block";


                            if (isOpen) {

                                content.style.display =
                                    "none";

                                arrow.innerText =
                                    ">";

                                arrow.style.transform =
                                    "rotate(0deg)";

                            }

                            else {

                                content.style.display =
                                    "block";

                                arrow.innerText =
                                    ">";

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


                    informationBox.appendChild(
                        item
                    );

                }
            );


            const productDescription =
                document.querySelector(
                    ".product-description"
                );


            const relatedProducts =
                document.querySelector(
                    ".related-products"
                );


            if (
                relatedProducts
            ) {

                relatedProducts.parentNode.insertBefore(
                    informationBox,
                    relatedProducts
                );

            }

            else if (
                productDescription
            ) {

                productDescription.parentNode.insertBefore(
                    informationBox,
                    productDescription.nextSibling
                );

            }

        }


        renderProductInformation();


        // ========================================
        // CUSTOMER REVIEWS
        // ========================================

        function renderCustomerReviews() {

            const reviews =
                Array.isArray(
                    product.customerReviews
                )
                ? product.customerReviews
                : (
                    Array.isArray(
                        product.reviewList
                    )
                    ? product.reviewList
                    : []
                );


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


            const reviewsBox =
                document.createElement(
                    "section"
                );


            reviewsBox.id =
                "dynamicCustomerReviews";


            reviewsBox.style.cssText = `

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


            heading.style.cssText = `

                font-size:25px;
                margin-bottom:20px;

            `;


            reviewsBox.appendChild(
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


                    const reviewer =
                        document.createElement(
                            "div"
                        );


                    reviewer.style.cssText = `

                        font-weight:bold;
                        font-size:16px;
                        margin-bottom:5px;

                    `;


                    reviewer.innerText =
                        review.reviewer ||
                        review.name ||
                        "Customer";


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
                        margin-bottom:7px;

                    `;


                    reviewBox.appendChild(
                        reviewer
                    );


                    reviewBox.appendChild(
                        stars
                    );


                    if (
                        review.title
                    ) {

                        const reviewTitle =
                            document.createElement(
                                "h3"
                            );


                        reviewTitle.innerText =
                            review.title;


                        reviewTitle.style.cssText = `

                            margin:5px 0;
                            font-size:17px;

                        `;


                        reviewBox.appendChild(
                            reviewTitle
                        );

                    }


                    if (
                        review.date
                    ) {

                        const date =
                            document.createElement(
                                "div"
                            );


                        date.innerText =
                            review.date;


                        date.style.cssText = `

                            color:#666;
                            font-size:12px;
                            margin-bottom:10px;

                        `;


                        reviewBox.appendChild(
                            date
                        );

                    }


                    if (
                        review.text
                    ) {

                        const reviewText =
                            document.createElement(
                                "p"
                            );


                        reviewText.innerText =
                            review.text;


                        reviewText.style.cssText = `

                            line-height:1.6;
                            margin:8px 0;

                        `;


                        reviewBox.appendChild(
                            reviewText
                        );

                    }


                    if (
                        review.image
                    ) {

                        const reviewImage =
                            document.createElement(
                                "img"
                            );


                        reviewImage.src =
                            review.image;


                        reviewImage.alt =
                            "Customer review";


                        reviewImage.style.cssText = `

                            max-width:250px;
                            max-height:250px;
                            object-fit:contain;
                            display:block;
                            margin-top:12px;
                            border:1px solid #ddd;

                        `;


                        reviewImage.onerror =
                            function() {

                                this.style.display =
                                    "none";

                            };


                        reviewBox.appendChild(
                            reviewImage
                        );

                    }


                    reviewsBox.appendChild(
                        reviewBox
                    );

                }
            );


            const relatedProducts =
                document.querySelector(
                    ".related-products"
                );


            if (
                relatedProducts
            ) {

                relatedProducts.parentNode.insertBefore(
                    reviewsBox,
                    relatedProducts
                );

            }

            else {

                const page =
                    document.querySelector(
                        ".product-page"
                    );


                if (page) {

                    page.appendChild(
                        reviewsBox
                    );

                }

            }

        }


        renderCustomerReviews();


        // ========================================
        // ADD TO CART
        // ========================================

        const addButton =
            document.querySelector(
                ".add-button"
            );


        if (addButton) {

            if (product.stock <= 0) {

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

                        addToCart(
                            product.title,
                            product.price
                        );

                    };

            }

        }


        // ========================================
        // RELATED PRODUCTS
        // ========================================

        const relatedGrid =
            document.querySelector(
                ".related-grid"
            );


        if (relatedGrid) {

            relatedGrid.innerHTML =
                "";


            allProducts.forEach(
                function(item) {

                    if (
                        item.id ===
                        product.id
                    ) {

                        return;

                    }


                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "related-card";


                    let relatedImage =
                        "";


                    let itemImages =
                        [];


                    if (
                        Array.isArray(
                            item.images
                        ) &&
                        item.images.length > 0
                    ) {

                        itemImages =
                            item.images;

                    }

                    else if (
                        item.image
                    ) {

                        itemImages = [
                            item.image
                        ];

                    }


                    if (
                        itemImages.length > 0
                    ) {

                        relatedImage = `

                            <img
                                src="${itemImages[0]}"
                                alt="${item.title}"
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


                        if (
                            item.category ===
                            "Electronics"
                        ) {

                            emoji =
                                "🎧";

                        }


                        if (
                            item.category ===
                            "Computers"
                        ) {

                            emoji =
                                "💻";

                        }


                        relatedImage =
                            `<span style="
                                font-size:60px;
                            ">
                                ${emoji}
                            </span>`;

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

                            ${relatedImage}

                        </div>


                        <h3>
                            ${item.title}
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

                            $${Number(
                                item.price
                            ).toFixed(2)}

                        </div>

                    `;


                    card.onclick =
                        function() {

                            window.location.href =
                                "product.html?id=" +
                                item.id;

                        };


                    relatedGrid.appendChild(
                        card
                    );

                }
            );

        }

    }

    catch (error) {

        console.error(
            "Product page error:",
            error
        );

        showProductNotFound();

    }

}


/* ========================================
   PRODUCT NOT FOUND
======================================== */

function showProductNotFound() {

    const productPage =
        document.querySelector(
            ".product-page"
        );


    if (productPage) {

        productPage.innerHTML = `

            <div style="
                text-align:center;
                padding:80px 20px;
            ">

                <h1>
                    Product not found
                </h1>

                <p>
                    This product does not exist.
                </p>

                <br>

                <button
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

}


/* ========================================
   STARS
======================================== */

function getProductStars(
    rating
) {

    let stars = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        if (
            i <=
            Math.floor(
                Number(rating) || 0
            )
        ) {

            stars += "★";

        }

        else {

            stars += "☆";

        }

    }


    return stars;

}


/* ========================================
   START
======================================== */

loadProductPage();