
import { categoryList } from "./categoryData.js";
import { productList } from "./productData.js";

categoryList.forEach(cat => {
  cat.products = productList.filter(p => p.categoryId === cat.id);
});

let selectedProduct = null; 
let handlersAttached = false;

export function renderCategory() {
  const main = document.getElementById("main-content");
  if (!main) {
    console.error("renderCategory: #main-content không tồn tại");
    return;
  }

  let out = "";
  categoryList.forEach((cat, idx) => {
    const base = idx * 2 + 1; 
    const placeholders = Array.from({ length: 8 }, (_, j) => {
      const page = base + (j >= 4 ? 1 : 0);
      return `
        <div class="product-card product-page-${page}-${cat.id}">
          <img src="" alt=""onerror="this.onerror=null;this.src='./img/Error.png';">
          <p class="title"></p>
          <p class="price"></p>
        </div>
      `;
    }).join("");

    out += `
      <div class="section-box" data-cat="${cat.id}">
        <div class="header-box">
          <h1>SÁCH - </h1>
        </div>
        <div class="content-box">
          <input type="radio" id="page-${base}-${cat.id}" name="page-${cat.id}" checked>
          <input type="radio" id="page-${base + 1}-${cat.id}" name="page-${cat.id}">
          <div id="product-list-${cat.id}">
            ${placeholders}
          </div>
          <div id="pagination-controls-${cat.id}">
            <label for="page-${base}-${cat.id}" class="nav-btn gray">&#8592;</label>
            <span id="page-info-${cat.id}"></span>
            <label for="page-${base + 1}-${cat.id}" class="nav-btn red">&#8594;</label>
          </div>
        </div>
      </div>
    `;
  });

  main.innerHTML = out;
  console.log("renderCategory(): hiển thị khung trống (placeholders).");
}

export function renderProduct() {
  categoryList.forEach((cat, idx) => {
    const container = document.getElementById(`product-list-${cat.id}`);
    if (!container) return;
    const base = idx * 2 + 1;
    const products = Array.isArray(cat.products) ? cat.products : [];

    if (products.length === 0) {
      console.log(`renderProduct: thể loại ${cat.id} chưa có sản phẩm, giữ placeholder.`);
      return;
    }

    let html = "";
    products.forEach((p, i) => {
      const page = base + (i >= 4 ? 1 : 0);
      html += `
        <div class="product-card product-page-${page}-${cat.id}" id="${p.id}" data-cat="${cat.id}">
          <img src="${p.img || ''}" alt="${p.title || ''}" onerror="this.onerror=null;this.src='./img/Error.png';">
          <p class="title">${p.title || ''}</p>
          <p class="price">${p.price ? p.price.toLocaleString() + " VNĐ" : ''}</p>
        </div>
      `;
    });

    container.innerHTML = html;
  });

  console.log("renderProduct(): đã chèn sản phẩm (nếu có).");
}

export function attachBuyHandlers(onAdd, onBuy) {
  const main = document.getElementById("main-content");
  if (!main) {
    console.error("attachBuyHandlers: #main-content không tồn tại");
    return;
  }

  if (handlersAttached) {
    console.warn("attachBuyHandlers: đã gắn handlers trước đó, bỏ qua.");
    return;
  }
  handlersAttached = true;

  main.addEventListener("click", e => {
  const card = e.target.closest(".product-card");
  if (!card) return;
  const id = card.id;
  if (!id) {
    selectedProduct = null;
    console.log("Selected: placeholder (không có sản phẩm).");
    return;
  }

  const found = productList.find(p => p.id === id);
  selectedProduct = found || null;
  console.log("Product selected (click):", selectedProduct);

  if (selectedProduct) openPopup(selectedProduct);
});

  window.addToCart = () => {
    if (!selectedProduct) {
      console.warn("addToCart: chưa chọn sản phẩm");
      return;
    }
    if (typeof onAdd === "function") {
      onAdd(selectedProduct);
    } else {
      console.log("addToCart default (returned):", selectedProduct);
    }
  };

  window.buyNow = () => {
    if (!selectedProduct) {
      console.warn("buyNow: chưa chọn sản phẩm");
      return;
    }
    if (typeof onBuy === "function") {
      onBuy(selectedProduct);
    } else {
      console.log("buyNow default (returned):", selectedProduct);
    }
  };

  console.log("attachBuyHandlers(): handlers đã gắn (click chọn sản phẩm, addToCart/buyNow sẵn sàng).");
}

function openPopup(product) {
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("popup");
  if (!overlay || !popup) return;

  document.getElementById("popup-img").src = product.img || "";
  document.getElementById("popup-title").textContent = product.title || "";
  document.getElementById("popup-price").textContent =
    product.price ? product.price.toLocaleString() + " VNĐ" : "";
  document.getElementById("popup-desc").textContent = product.desc || "";

  overlay.classList.remove("hidden");
  popup.classList.remove("hidden");
}

function closePopup() {
  document.getElementById("overlay").classList.add("hidden");
  document.getElementById("popup").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("close-btn");
  if (overlay) overlay.addEventListener("click", closePopup);
  if (closeBtn) closeBtn.addEventListener("click", closePopup);

  const addBtn = document.getElementById("add-cart");
  const buyBtn = document.getElementById("buy-now");

  if (addBtn)
    addBtn.addEventListener("click", () => {
      if (!selectedProduct) return;
      console.log("🛒 Thêm vào giỏ:", selectedProduct);
      closePopup();
    });

  if (buyBtn)
    buyBtn.addEventListener("click", () => {
      if (!selectedProduct) return;
      console.log("💳 Mua ngay:", selectedProduct);
      closePopup();
    });
});

export function renderAll({ autoAttach = false, onAdd, onBuy } = {}) {
  renderProduct();
  if (autoAttach) attachBuyHandlers(onAdd, onBuy);
  console.log("renderAll(): đã gọi renderProduct() và (nếu autoAttach) attachBuyHandlers().");
}

document.addEventListener("DOMContentLoaded", () => {
  renderCategory(); 
});
//Gọi hàm
document.addEventListener("DOMContentLoaded", () => {
  renderCategory();    
  renderProduct();    
  attachBuyHandlers(); 
});  
