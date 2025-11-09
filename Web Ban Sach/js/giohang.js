import { productList, ready } from "./loadData.js";

// ------------------- DOM Elements -------------------
const cartTableBody = document.querySelector('#book-list'); // tbody hiển thị giỏ hàng
const cartTotal = document.getElementById('cart-total');
const cartModal = document.getElementById('cart-modal');
const overlay = document.getElementById('overlay');
const shopBtn = document.getElementById('shopBtn');
const closeBtn = document.querySelector('.close-btn');

// ------------------- Giỏ hàng -------------------
let PRODUCTS = JSON.parse(localStorage.getItem("productSelected")) || [];

// ------------------- Helper -------------------
const currency = v => v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
const saveSelected = () => localStorage.setItem('productSelected', JSON.stringify(PRODUCTS));

// ------------------- Cart Functions -------------------
function updateCartDisplay() {
  let total = 0;

  cartTableBody.innerHTML = PRODUCTS.map(item => {
    const p = productList.find(p => p.id === item.id);
    if (!p) return '';
    const subtotal = p.price * item.qty;
    total += subtotal;
    return `
      <tr>
        <td>${p.id}</td>
        <td>${p.title}</td>
        <td><input type="number" min="1" value="${item.qty}" onchange='changeQty("${item.id}", this.value)'></td>
        <td><img src="${p.img}" alt="${p.title}" style="width:40px;"></td>
        <td>${currency(subtotal)}</td>
        <td><button onclick='removeFromCart("${item.id}")'>X</button></td>
      </tr>
    `;
  }).join('');

  cartTotal.textContent = currency(total);
}

function addToCart(id) {
  const existing = PRODUCTS.find(x => x.id === id);
  const p = productList.find(p => p.id === id);
  if (!p) return; // sản phẩm không tồn tại

  if (existing) {
    existing.qty++;
  } else {
    PRODUCTS.push({ id, qty: 1 });
  }

  saveSelected();
  updateCartDisplay();
}

function removeFromCart(id) {
  PRODUCTS = PRODUCTS.filter(x => x.id !== id);
  saveSelected();
  updateCartDisplay();
}

function changeQty(id, qty) {
  const item = PRODUCTS.find(x => x.id === id);
  if (item) item.qty = parseInt(qty) || 1;
  saveSelected();
  updateCartDisplay();
}

function clearCart() {
  PRODUCTS = [];
  saveSelected();
  updateCartDisplay();
}

function checkout() {
  if (PRODUCTS.length === 0) {
    alert('Giỏ hàng trống!');
    return;
  }

  // Lưu tạm trước khi chuyển trang
  saveSelected();
  location.href = "thanhtoan.html";
}

// ------------------- Toggle Cart -------------------
function toggleCart() {
  const showing = cartModal.style.display === "flex";
  cartModal.style.display = showing ? "none" : "flex";
  overlay.style.display = showing ? "none" : "block";

  if (!showing) updateCartDisplay();
}

// ------------------- Event Listeners -------------------
document.addEventListener('DOMContentLoaded', () => {
  shopBtn.addEventListener('click', toggleCart);
  overlay.addEventListener('click', toggleCart);
  closeBtn.addEventListener('click', toggleCart);

  // Hiển thị giỏ hàng ngay khi load trang
  updateCartDisplay();
});

// ------------------- Global -------------------
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeQty = changeQty;
window.clearCart = clearCart;
window.checkout = checkout;
window.updateCartDisplay = updateCartDisplay;