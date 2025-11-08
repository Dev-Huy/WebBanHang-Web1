import { productList, ready } from "./loadData.js";

let cartItems = [];

ready.then(() => {
    cartItems = productList;
    renderCart();
})



function formatVND(num) {
    return num.toLocaleString("vi-VN") + "₫";
}

function renderCart() {
    const container = document.querySelector("#cart-list");
    container.innerHTML = "";
    cartItems.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
      <div class="thumb"><img src="${item.img}" alt="${item.title}"></div>
      <div class="meta">
        <h3>${item.title}</h3>
        <p>${item.author}</p>
        <p class="price">${formatVND(item.price)}</p>
      </div>
      <div class="controls">
        <div class="qty">
          <button onclick="changeQty(${index}, -1)">-</button>
          <input type="text" value="${item.amount}" readonly>
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>
        <button class="remove" onclick="removeItem(${index})">Xóa</button>
      </div>
    `;
        container.appendChild(div);
    });
    updateSummary();
}

function changeQty(index, delta) {
    cartItems[index].amount = Math.max(1, cartItems[index].amount + delta);
    renderCart();
}

function removeItem(index) {
    cartItems.splice(index, 1);
    renderCart();
}

function updateSummary() {
    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.amount, 0);
    document.querySelector("#subtotal").textContent = formatVND(subtotal);
    document.querySelector("#total").textContent = formatVND(subtotal);
}

window.changeQty = changeQty;
window.removeItem = removeItem;
window.renderCart = renderCart;
window.updateSummary = updateSummary;

document.querySelector("#apply").addEventListener("click", () => {
    const coupon = document.querySelector("#coupon").value.trim().toLowerCase();
    if (coupon === "giam10") {
        alert("Áp dụng mã giảm giá 10% thành công!");
        const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.amount, 0);
        const discount = subtotal * 0.1;
        document.querySelector("#total").textContent = formatVND(subtotal - discount);
    } else {
        alert("Mã không hợp lệ!");
    }
});

document.querySelector("#pay").addEventListener("click", () => {
    if (productSelected) {

    }
    localStorage.removeItem("cart");
    location.href = "index.html";
});

