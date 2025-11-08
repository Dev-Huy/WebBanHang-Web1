import { productList, ready } from "./loadData.js";
// ------------------- Selected products -------------------

let PRODUCTS = JSON.parse(localStorage.getItem("productSelected")) || [];
ready.then(() => {

})

document.addEventListener('DOMContentLoaded', () => {
  const cartTableBody = document.querySelector('#book-list'); // tbody
  const cartTotal = document.getElementById('cart-total');
  const cartModal = document.getElementById('cart-modal');
  const overlay = document.getElementById('overlay');
  const shopBtn = document.getElementById('shopBtn');
  const closeBtn = document.querySelector('.close-btn');

  // ------------------- Helper -------------------
  const currency = v => v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  const saveSelected = () => localStorage.setItem('productSelected', JSON.stringify(PRODUCTS));

  // ------------------- Cart Functions -------------------
  function updateCartDisplay(list) {
    const displayList = list || PRODUCTS;
    let total = 0;

    cartTableBody.innerHTML = displayList.map(item => {
      const p = productList.find(p => p.id === item.id);
      if (!p) return '';
      const subtotal = p.price * item.qty;
      total += subtotal;
      return `
        <tr>
          <td>${p.id}</td>
          <td>${p.title}</td>
          <td><input type="number" min="1" value="${item.qty || 1}" onchange='changeQty("${item.id}", this.value)'></td>
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
    if (existing) {
      existing.qty++; }

    else {
      PRODUCTS.push({ id, img, author, qty: 1 });
    }
    // saveSelected();
    updateCartDisplay();
  }

function removeFromCart(id) {
    PRODUCTS = PRODUCTS.filter(x => x.id !== id);
    // saveSelected();
    updateCartDisplay();
  }

  function changeQty(id, qty) {
    const item = PRODUCTS.find(x => x.id === id);
    if (item) item.qty = parseInt(qty) || 1;
    // saveSelected();
    updateCartDisplay();
  }

  function clearCart() {
    PRODUCTS = [];
    // saveSelected();
    updateCartDisplay();
  }

  function checkout() {
    if (PRODUCTS.length === 0) { 
      alert('Giỏ hàng trống!');
      return;
    }
    saveSelected();
    location.href = "thanhtoan.html";
    clearCart();
  }

function toggleCart() {
  const showing = cartModal.style.display === 'flex';
  cartModal.style.display = showing ? 'none' : 'flex';
  overlay.style.display = showing ? 'none' : 'block';

  // 💥 Mỗi lần mở giỏ → đọc lại localStorage
  if (!showing) {
    updateCartDisplay();
  }
}


  // ------------------- Event Listeners -------------------
  overlay.addEventListener('click', toggleCart);
  shopBtn.addEventListener('click', toggleCart);
  closeBtn.addEventListener('click', toggleCart);

  // ------------------- Global (cho HTML gọi được) -------------------
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.changeQty = changeQty;
  window.clearCart = clearCart;
  window.checkout = checkout;
  window.updateCartDisplay = updateCartDisplay;
  
});
