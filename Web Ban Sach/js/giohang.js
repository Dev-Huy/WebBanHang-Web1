import { productList, ready } from "./loadData.js";

// ------------------- Selected products -------------------
let productSelected = [
  { id: "SP001", qty: 1 },
  {id: "SP002", qty: 1}
]; // Mảng sản phẩm user đã chọn

let PRODUCTS = [];

document.addEventListener('DOMContentLoaded', () => {
  const cartTableBody = document.querySelector('#book-list'); // tbody
  const cartTotal = document.getElementById('cart-total');
  const cartModal = document.getElementById('cart-modal');
  const overlay = document.getElementById('overlay');
  const shopBtn = document.getElementById('shopBtn');
  const closeBtn = document.querySelector('.close-btn');

  // ------------------- Helper -------------------
  const currency = v => v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  const saveSelected = () => localStorage.setItem('productSelected', JSON.stringify(productSelected));
  const loadSelected = () => productSelected = JSON.parse(localStorage.getItem('productSelected') || productSelected);

  // ------------------- Cart Functions -------------------
  function updateCartDisplay(list) {
    const displayList = list || productSelected;
    let total = 0;

    cartTableBody.innerHTML = displayList.map(item => {
      const p = PRODUCTS.find(p => p.id === item.id);
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
    const existing = productSelected.find(x => x.id === id);
    if (existing) existing.qty++;
    else productSelected.push({ id, qty: 1 });
    saveSelected();
    updateCartDisplay();
  }

  function removeFromCart(id) {
    productSelected = productSelected.filter(x => x.id !== id);
    saveSelected();
    updateCartDisplay();
  }

  function changeQty(id, qty) {
    const item = productSelected.find(x => x.id === id);
    if (item) item.qty = parseInt(qty) || 1;
    saveSelected();
    updateCartDisplay();
  }

  function clearCart() {
    productSelected = [];
    saveSelected();
    updateCartDisplay();
  }

  function checkout() {
    if (productSelected.length === 0) { alert('Giỏ hàng trống!'); return; }
    alert('Thanh toán thành công! (Demo)');
    clearCart();
  }

  function toggleCart() {
    const showing = cartModal.style.display === 'flex';
    cartModal.style.display = showing ? 'none' : 'flex';
    overlay.style.display = showing ? 'none' : 'block';
    if (!showing) updateCartDisplay();
  }

  // ------------------- Event Listeners -------------------
  overlay.addEventListener('click', toggleCart);
  shopBtn.addEventListener('click', toggleCart);
  closeBtn.addEventListener('click', toggleCart);

  // ------------------- Global -------------------
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.changeQty = changeQty;
  window.clearCart = clearCart;
  window.checkout = checkout;

  // ------------------- Init -------------------
  ready.then(() => {
    PRODUCTS = productList.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      img: p.img
    }));
    loadSelected();
  });
});
