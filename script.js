const whatsappNumber = "6285722379403";

const products = [
  { id: 1, name: "Nalar CIPTA", price: 129000, colorClass: "", desc: "Kaos hitam dengan konsep menciptakan ide dan karya.", label: "Best Seller" },
  { id: 2, name: "Nalar RASA", price: 129000, colorClass: "cream", desc: "Kaos cream/off-white dengan pesan tentang rasa dan makna.", label: "New" },
  { id: 3, name: "Nalar KARSA", price: 129000, colorClass: "", desc: "Kaos hitam dengan konsep kemauan dan daya cipta.", label: "Limited" }
];

let cart = JSON.parse(localStorage.getItem("nalarCart")) || [];

function rupiah(number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(number);
}

function renderProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-img ${product.colorClass}">
        <span class="badge">${product.label}</span>
        <h3>${product.name.split(" ")[1]}</h3>
      </div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <div class="price">${rupiah(product.price)}</div>
        <div class="options">
          <select id="size-${product.id}">
            <option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option>
          </select>
          <select id="color-${product.id}">
            <option>Hitam</option><option>Cream</option><option>Off White</option>
          </select>
        </div>
        <button class="add-btn" onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
      </div>
    </article>
  `).join("");
}

function saveCart() {
  localStorage.setItem("nalarCart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const size = document.getElementById(`size-${id}`).value;
  const color = document.getElementById(`color-${id}`).value;
  const key = `${id}-${size}-${color}`;
  const existing = cart.find(item => item.key === key);
  if (existing) existing.qty += 1;
  else cart.push({ key, id, name: product.name, price: product.price, size, color, qty: 1 });
  saveCart();
  openCart();
}

function updateCartCount() {
  document.getElementById("cartCount").textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Keranjang masih kosong.</p>";
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br>
          <small>Size ${item.size} • ${item.color}</small><br>
          <small>${rupiah(item.price)}</small>
        </div>
        <div class="qty">
          <button onclick="changeQty('${item.key}', -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${item.key}', 1)">+</button>
        </div>
      </div>
    `).join("");
  }
  document.getElementById("cartTotal").textContent = rupiah(cart.reduce((sum, item) => sum + item.price * item.qty, 0));
}

function changeQty(key, amount) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += amount;
  if (item.qty <= 0) cart = cart.filter(i => i.key !== key);
  saveCart();
  renderCart();
}

function openCart() {
  renderCart();
  document.getElementById("cartOverlay").style.display = "flex";
}

function closeCart() {
  document.getElementById("cartOverlay").style.display = "none";
}

function checkoutWhatsApp() {
  if (cart.length === 0) return alert("Keranjang masih kosong.");
  const name = document.getElementById("buyerName").value.trim();
  const address = document.getElementById("buyerAddress").value.trim();
  if (!name || !address) return alert("Isi nama dan alamat dulu ya.");
  const orderList = cart.map((item, index) => `${index + 1}. ${item.name}%0A   Size: ${item.size}%0A   Warna: ${item.color}%0A   Qty: ${item.qty}%0A   Subtotal: ${rupiah(item.price * item.qty)}`).join("%0A%0A");
  const total = rupiah(cart.reduce((sum, item) => sum + item.price * item.qty, 0));
  const message = `Halo Nalar Goods, saya mau order:%0A%0ANama: ${name}%0AAlamat: ${address}%0A%0A${orderList}%0A%0ATotal: ${total}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
}

renderProducts();
updateCartCount();
