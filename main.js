document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("products");
    const searchInput = document.getElementById("search");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const openModalBtn = document.getElementById("open-modal"); 
    const modalList = document.getElementById("modal-cart-list");
    const totalText = document.getElementById("modal-total-price");
    const qrCodeModal = document.getElementById("qr-code-modal");
    const closeModal = document.getElementById("close-modal");
    const categoryFilter = document.getElementById("category-filter");
    const priceFilter = document.getElementById("price-filter");
    const spinner = document.getElementById("spinner");

    const cart = []; 
    let products = []; 
    // -----------------------------------------------------------------------------------------------------------------------------

    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode"); 
    
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
        } else {
            localStorage.setItem("darkMode", "disabled");
        }
    });
    // --------------------------------------------------------------------------------------------------------------------------------
    
    async function fetchProducts() {
        try {
            spinner.style.display = "block"; 
            const res = await fetch("https://fakestoreapi.com/products");
            products = await res.json(); 
            displayProducts(products);
        } catch (error) {
            console.log("Xatolik:", error);
        } finally {
            spinner.style.display = "none";
        }
    }

    // -------------------------------------------------------------------------------------------------------------------------------------

    function displayProducts(products) {
        productContainer.innerHTML = "";
        products.forEach(product => {
            const productElement = document.createElement("div");
            productElement.classList.add("product");
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p><strong>Narxi:</strong> $${product.price}</p>
                <p><strong>Kategoriya:</strong> ${product.category}</p>
                <p><strong>Baho:</strong> ${product.rating.rate} ⭐ (${product.rating.count} ta sharh)</p>
                <p>${product.description.slice(0, 50)}...</p>
                <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">🛒 Savatga qo‘shish</button>
            `;
            productContainer.appendChild(productElement);
        });
    }

    // -------------------------------------------------------------------------------------------------------------------------

    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    });

    priceFilter.addEventListener("change", (e) => {
        const selectedPrice = e.target.value;
        let filteredProducts = products;
        if (selectedPrice !== "all") {
            const [min, max] = selectedPrice.split("-").map(Number);
            filteredProducts = products.filter(product =>
                max ? product.price >= min && product.price <= max : product.price >= min
            );
        }
        displayProducts(filteredProducts);
    });
    // -------------------------------------------------------------------------------------------------------------------------

    window.addToCart = function (id, title, price) {
        cart.push({ id, title, price });
        alert(`✅ '${title}' mahsuloti savatga qo'shildi!`);
    };

    openModalBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            return alert("⚠️ Savat bo‘sh");
        }

        modalList.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            total += item.price;
            const listItem = document.createElement("li");
            listItem.textContent = `${item.title} - $${item.price}`;
            modalList.appendChild(listItem);
        });

        totalText.textContent = `Umumiy summa: $${total.toFixed(2)}`;
        qrCodeModal.style.display = "block";
    });

    closeModal.addEventListener("click", () => {
        qrCodeModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === qrCodeModal) {
            qrCodeModal.style.display = "none";
        }
    });
    // --------------------------------------------------------------------

    categoryFilter.addEventListener("change", (e) => {
        const selectedCategory = e.target.value;
        if (selectedCategory === "all") {
            displayProducts(products);
        } else {
            const filteredProducts = products.filter(product => product.category === selectedCategory);
            displayProducts(filteredProducts);
        }
    });

    fetchProducts(); 
});
