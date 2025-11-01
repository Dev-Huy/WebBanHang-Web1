
// const bookList = document.getElementById('book-list');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal'); //cart-modal
const cartTableBody = document.querySelector('#cart-table tbody');
const cartTotal = document.getElementById('cart-total');

const PRODUCTS = [
    { id: 'b1', name: 'Đắc Nhân Tâm', price: 120000, desc: 'Bìa mềm, 288 trang', author: 'Dale Carnegie', isbn: '978-604-969' },
    { id: 'b2', name: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', price: 98000, desc: 'Bìa mềm, 200 trang', author: 'Rosie Nguyễn', isbn: '978-604-970' },
    { id: 'b3', name: 'Nhà Giả Kim', price: 90000, desc: 'Bìa mềm, 167 trang', author: 'Paulo Coelho', isbn: '978-604-971' },
    { id: 'b4', name: 'Sapiens', price: 150000, desc: 'Bìa mềm, 464 trang', author: 'Yuval Noah Harari', isbn: '978-604-972' },
    { id: 'b5', name: 'Bí Quyết Thành Công', price: 85000, desc: 'Bìa mềm, 180 trang', author: 'Napoleon Hill', isbn: '978-604-973' }
];

let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function currency(v) { return v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }

function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }

function renderBooks() {
    bookList.innerHTML = PRODUCTS.map(b => `
        <div class='book'>
          <h3>${b.name}</h3>
          <p><b>Tác giả:</b> ${b.author}</p>
          <p>${b.desc}</p>
          <p><b>Giá:</b> ${currency(b.price)}</p>
          <button onclick="addToCart('${b.id}')">Thêm vào giỏ</button>
        </div>
      `).join('');
}

function addToCart(id) {
    const item = cart.find(x => x.id === id);
    if (item) item.qty++;
    else cart.push({ id, qty: 1 });
    saveCart(); updateCartDisplay();
    alert('Đã thêm sách vào giỏ!');
}

function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    saveCart(); updateCartDisplay();
}

function updateCartDisplay() {
    cartCount.textContent = cart.reduce((t, x) => t + x.qty, 0);
    let total = 0;
    cartTableBody.innerHTML = cart.map(c => {
        const b = PRODUCTS.find(p => p.id === c.id);
        const subtotal = b.price * c.qty; total += subtotal;
        return `<tr><td>${b.name}</td><td><input type='number' min='1' value='${c.qty}' onchange='changeQty("${c.id}",this.value)' style='width:50px'></td><td>${currency(subtotal)}</td><td><button onclick='removeFromCart("${c.id}")'>X</button></td></tr>`;
    }).join('');
    cartTotal.textContent = currency(total);
}

function changeQty(id, qty) {
    const item = cart.find(x => x.id === id);
    if (item) { item.qty = parseInt(qty) || 1; }
    saveCart(); updateCartDisplay();
}

function checkout() {
    if (cart.length === 0) { alert('Giỏ hàng trống!'); return; }
    alert('Thanh toán thành công! (demo)');
    clearCart();
}

function clearCart() { cart = []; saveCart(); updateCartDisplay(); }

function toggleCart() {
    const showing = cartModal.style.display === 'flex';
    overlay.classList.toggle("show");
    cartModal.style.display = showing ? 'none' : 'flex';
    if (!showing) updateCartDisplay();
}

renderBooks();
updateCartDisplay();


