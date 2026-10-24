const products = [
    { id: 1, name: "Mictlantecutli", desc: "Dios de la muerte Azteca.", price: 25, image: "imagenes/gatito.png", color: "#d5eee1", cat: "fantasia", tag: "Favorito" },
    { id: 2, name: "Angela", desc: "la punta del cielo y la fuerza de odin.", price: 30, emoji: "🌙", image: "imagenes/luna.png", color: "#e5dcfb", cat: "animales", tag: "Nuevo" },
    { id: 3, name: "Daredevil", desc: "el hombre sin miedo.", price: 28, emoji: "🐸", image: "imagenes/ranita.png", color: "#d8e9b8", cat: "animales" },
    { id: 4, name: "Zorro en huesos", desc: "nota mental, no le quites el trapo.", price: 22, emoji: "🌼", image: "imagenes/flor.png", color: "#ffe7a8", cat: "fantasia" },
    { id: 5, name: "Zorro Raro", desc: "todos somos raros en nuestra naturaleza.", price: 32, emoji: "🪐", image: "imagenes/planeta.png", color: "#f8d2df", cat: "fantasia" },
    { id: 6, name: "Gambit & Rogue", desc: "hay cosas que van mas alla de la piel.", price: 27, emoji: "🧸", image: "imagenes/osito.png", color: "#f3d5c0", cat: "animales" },
    { id: 7, name: "Doom", price: 24, emoji: "🍄", image: "imagenes/honguito.png", color: "#f5c8bd", cat: "animales" },
    { id: 8, name: "Maki", price: 20, emoji: "⭐", image: "imagenes/estrella.png", color: "#d8e7fb", cat: "animales" }
];

const $ = (id) => document.getElementById(id);
const money = (amount) => `$${amount.toFixed(2)} MXN`;

let cart = JSON.parse(localStorage.getItem("pu-cart") || "{}");
let category = "todos";
let productImages = {};

try {
    productImages = JSON.parse(localStorage.getItem("pu-images") || "{}");
} catch (error) {
    productImages = {};
}

function saveCart() {
    localStorage.setItem("pu-cart", JSON.stringify(cart));
}

function quantity() {
    return Object.values(cart).reduce((sum, amount) => sum + amount, 0);
}

function total() {
    return products.reduce((sum, product) => {
        return sum + product.price * (cart[product.id] || 0);
    }, 0);
}

// ============================================================
// 3. RENDERIZADO DEL CATÁLOGO
// ============================================================
function renderProducts() {
    const filteredProducts = products.filter((product) => {
        return category === "todos" || product.cat === category;
    });

    $("products").innerHTML = filteredProducts.map((product) => `
        <article class="card">
            <div class="product-art" style="background:${product.color}">
                <img
                    src="${product.image}"
                    alt="Sticker ${product.name}"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';"
                >
                <span style="display:none">${product.emoji}</span>
            </div>

            <div class="product-info">
                ${product.tag ? `<span class="eyebrow">${product.tag}</span>` : ""}
                <h3>${product.name}</h3>
                <p>${product.desc}</p>

                <div class="product-bottom">
                    <strong>${money(product.price)}</strong>
                    <button class="add" data-add="${product.id}"
                        aria-label="Agregar ${product.name} al carrito">+</button>
                </div>
            </div>

        </article>
    `).join("");
}

// ============================================================
// 4. CARRITO DE COMPRAS
// ============================================================
function renderCart() {
    const itemCount = quantity();
    const cartProducts = products.filter((product) => cart[product.id]);

    $("cartCount").textContent = itemCount;
    $("panelCount").textContent = itemCount;
    $("cartTotal").textContent = money(total());

    $("cartItems").innerHTML = cartProducts.length
        ? cartProducts.map((product) => `
            <div class="cart-item">
                <div class="thumb" style="background:${product.color}">
                    <img
                        src="${product.image}"
                        alt=""
                        onerror="this.style.display='none'; this.parentElement.textContent='${product.emoji}';"
                    >
                </div>

                <div>
                    <h4>${product.name}</h4>
                    <small>${money(product.price)} por unidad</small>

                    <div class="qty">
                        <button data-qty="${product.id}" data-delta="-1" aria-label="Quitar una unidad">−</button>
                        <span>${cart[product.id]}</span>
                        <button data-qty="${product.id}" data-delta="1" aria-label="Agregar una unidad">+</button>
                    </div>
                </div>

                <div style="text-align:right">
                    <strong>${money(product.price * cart[product.id])}</strong><br>
                    <button class="remove" data-remove="${product.id}">Eliminar</button>
                </div>
            </div>
        `).join("")
        : `<div class="empty">
            <div style="font-size:3rem">🛍️</div>
            <strong>Tu carrito está esperando.</strong><br>
            Agrega algún sticker que te encante.
        </div>`;

    $("checkout").disabled = itemCount === 0;
    $("checkout").style.opacity = itemCount ? "1" : ".55";
}

function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    renderCart();
    showToast("¡Sticker agregado al carrito! ✦");
}

function showToast(message) {
    $("toast").textContent = message;
    $("toast").classList.add("show");

    setTimeout(() => {
        $("toast").classList.remove("show");
    }, 1800);
}

// ============================================================
// 5. FILTROS Y MENÚ DESPLEGABLE
// ============================================================
function setCategory(selectedCategory) {
    category = selectedCategory;

    document.querySelectorAll(".filter").forEach((button) => {
        button.classList.toggle("active", button.dataset.category === category);
    });

    renderProducts();
}

function closeDropdown() {
    $("dropdown").classList.remove("show");
}

$("menuTrigger").addEventListener("click", () => {
    $("dropdown").classList.toggle("show");
});

document.addEventListener("click", (event) => {
    if (!event.target.closest(".menu")) {
        closeDropdown();
    }
});

document.querySelectorAll(".filter").forEach((button) => {
    button.addEventListener("click", () => setCategory(button.dataset.category));
});

document.querySelectorAll("[data-filter]").forEach((link) => {
    link.addEventListener("click", () => {
        setCategory(link.dataset.filter);
        closeDropdown();
    });
});

// ============================================================
// 6. IMÁGENES DE LOS STICKERS
// ============================================================
// Las rutas de las imágenes están en la propiedad "image" de cada producto,
// al inicio de este archivo. Coloca tus imágenes dentro de la carpeta
// "imagenes" y usa los nombres indicados en LEEME_IMAGENES.txt.
// Si una imagen no existe, se mostrará el emoji como respaldo.

// ============================================================
// 7. ACCIONES DEL CARRITO
// ============================================================
$("products").addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");

    if (button) {
        addToCart(Number(button.dataset.add));
    }
});

$("cartItems").addEventListener("click", (event) => {
    const quantityButton = event.target.closest("[data-qty]");
    const removeButton = event.target.closest("[data-remove]");

    if (quantityButton) {
        const id = quantityButton.dataset.qty;
        cart[id] = (cart[id] || 0) + Number(quantityButton.dataset.delta);

        if (cart[id] <= 0) {
            delete cart[id];
        }

        saveCart();
        renderCart();
    }

    if (removeButton) {
        delete cart[removeButton.dataset.remove];
        saveCart();
        renderCart();
    }
});

// ============================================================
// 8. MODO OSCURO
// ============================================================
function setDarkMode(isDark) {
    document.body.classList.toggle("dark", isDark);
    $("themeToggle").textContent = isDark ? "☀ Modo claro" : "☾ Modo oscuro";
    localStorage.setItem("pu-dark", isDark ? "yes" : "no");
}

$("themeToggle").addEventListener("click", () => {
    setDarkMode(!document.body.classList.contains("dark"));
});

if (localStorage.getItem("pu-dark") === "yes") {
    document.body.classList.add("dark");
    $("themeToggle").textContent = "☀ Modo claro";
}

// ============================================================
// 9. ABRIR Y CERRAR EL PANEL DEL CARRITO
// ============================================================
function openCart() {
    $("cartPanel").classList.add("open");
    $("overlay").classList.add("show");
}

function closeCart() {
    $("cartPanel").classList.remove("open");
    $("overlay").classList.remove("show");
}

$("openCart").addEventListener("click", openCart);
$("closeCart").addEventListener("click", closeCart);
$("overlay").addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeCart();
    }
});

// ============================================================
// 10. FINALIZAR COMPRA Y ARRANQUE
// ============================================================
$("checkout").addEventListener("click", () => {
    showToast("Demo: aquí conectarías una pasarela de pago.");
});

// Mostrar catálogo y carrito al cargar la página.
renderProducts();
renderCart();
