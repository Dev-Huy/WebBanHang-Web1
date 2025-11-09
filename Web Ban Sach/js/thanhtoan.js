import { productList, ready } from "./loadData.js";

let cartItems = [];

ready.then(() => {
    const savedCart = JSON.parse(localStorage.getItem("productSelected")) || [];

    if (savedCart.length === 0) {
        document.querySelector("#empty").style.display = "block";
        return;
    }

    cartItems = savedCart.map(item => {
        const product = productList.find(p => p.id === item.id);
        if (!product) return null;
        return {
            ...product,
            amount: item.qty || 1
        };
    }).filter(Boolean); 

    renderCart();
});

function formatVND(num) {
    return num.toLocaleString("vi-VN") + "₫";
}

function renderCart() {
    const container = document.querySelector("#items");
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

const payBtn = document.querySelector("#pay"); 
payBtn.addEventListener("click", () => {
    if (cartItems.length === 0) {
        alert("Giỏ hàng trống!");
        return;
    }


    const currentUserData = JSON.parse(sessionStorage.getItem("currentUser"));

    if (!currentUserData) {
        alert("Bạn chưa đăng nhập!");
         
    } 

    const currentUser = currentUserData.username; 
    const currentCustomer = currentUserData.name;  


    const newId = Date.now();
    const total = cartItems.reduce((sum, item) => sum + item.price * item.amount, 0);
    const chitiet = cartItems.map(i => ({ id: i.id, soluong: i.amount }));

    const newOrder = {
        id: newId,
        username: currentUser,
        ngay: new Date().toISOString().split("T")[0],
        tong: total,
        trangthai: "moi",
        chitiet: chitiet
    };

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    cartItems = [];
    localStorage.removeItem("cart");

    // 🔹 Thay đổi nút thành Đã thanh toán
    payBtn.textContent = "Đã thanh toán";
    payBtn.disabled = true;
    payBtn.style.opacity = 0.6;

    alert("Thanh toán thành công!");
});

const backBtn = document.getElementById("backHome");
backBtn.addEventListener("click", () => {
    location.href = "index.html";
});