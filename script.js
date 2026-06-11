let cart = [];
let selectedCiptaColor = "Hitam";
let selectedCiptaSize = "M";

const ciptaImages = {
  "Hitam": "assets/cipta-hitam.png",
  "Off-White": "assets/cipta-offwhite.png"
};

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
}

function selectCiptaColor(color) {
  selectedCiptaColor = color;

  const image = document.getElementById("cipta-image");
  image.src = ciptaImages[color];
  image.alt = `Kaos CIPTA warna ${color}`;

  document.querySelectorAll(".variant-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.color === color);
  });
}

function selectCiptaSize(size) {
  selectedCiptaSize = size;

  document.querySelectorAll(".size-btn").forEach(button => {
    button.classList.toggle("active", button.textContent.trim() === size);
  });
}

function addCiptaToCart() {
  addToCart("CIPTA", 149000, selectedCiptaColor, selectedCiptaSize);
}

function addToCart(name, price, color = "", size = "") {
  const existingItem = cart.find(item =>
    item.name === name &&
    item.color === color &&
    item.size === size
  );

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name, price, color, size, qty: 1 });
  }

  renderCart();
  openCart();
}

function increaseQty(index) {
  cart[index].qty += 1;
  renderCart();
}

function decreaseQty(index) {
  cart[index].qty -= 1;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Keranjang masih kosong.</p>';
  }

  let totalQty = 0;
  let totalPrice = 0;

  cart.forEach((item, index) => {
    totalQty += item.qty;
    totalPrice += item.price * item.qty;

    const variantText = item.color || item.size
      ? `<p>${item.color ? item.color : ""}${item.color && item.size ? " · " : ""}${item.size ? "Size " + item.size : ""}</p>`
      : "";

    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";

    itemElement.innerHTML = `
      <div class="cart-item-top">
        <div>
          <h4>${item.name}</h4>
          ${variantText}
          <p>${formatRupiah(item.price)} / pcs</p>
        </div>
        <button class="remove-btn" onclick="removeItem(${index})">Hapus</button>
      </div>

      <div class="qty-control">
        <button onclick="decreaseQty(${index})">−</button>
        <span>${item.qty}</span>
        <button onclick="increaseQty(${index})">+</button>
      </div>

      <p style="margin-top:12px;"><strong>Subtotal:</strong> ${formatRupiah(item.price * item.qty)}</p>
    `;

    cartItems.appendChild(itemElement);
  });

  cartCount.textContent = totalQty;
  cartTotal.textContent = formatRupiah(totalPrice);
}

function openCart() {
  document.getElementById("cart-panel").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function toggleCart() {
  document.getElementById("cart-panel").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
}

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Keranjang masih kosong.");
    return;
  }

  const phoneNumber = "6281234567890"; // Ganti dengan nomor WhatsApp kamu

  let message = "Halo Nalar Goods, saya mau pesan:%0A%0A";
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    const detail = item.color || item.size
      ? ` ${item.color || ""}${item.color && item.size ? " " : ""}${item.size ? "Size " + item.size : ""}`
      : "";

    message += `- ${item.name}${detail} x${item.qty} = ${formatRupiah(subtotal)}%0A`;
  });

  message += `%0ATotal: ${formatRupiah(total)}%0A%0AMohon info ketersediaan size dan cara pembayarannya.`;

  window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
}

renderCart();
