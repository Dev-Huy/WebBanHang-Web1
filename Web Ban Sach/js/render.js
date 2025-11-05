import { productList, categoryList } from "./loadData.js";

categoryList.forEach(cat => {
  cat.products = productList.filter(p => p.category === cat.id);
});

let selectedProduct = null;

// === Render Category Containers ===
export function renderCategory() {
  const main = document.getElementById("main-content");
  let out = "";

  categoryList.forEach(cat => {
    // Tính số trang theo số lượng sản phẩm
    const totalPages = Math.ceil(cat.products.length / 4) || 1;

    // Tạo input radio cho từng page
    const radios = Array.from({ length: totalPages }, (_, i) => {
      return `<input type="radio" id="page-${i + 1}-${cat.id}" name="page-${cat.id}" ${i === 0 ? "checked" : ""}>`;
    }).join("");

    // Placeholder ban đầu
    const placeholders = Array.from({ length: 4 }, () => `
      <div class="product-card">
        <img src="" alt="">
        <p class="title"></p>
        <p class="price"></p>
      </div>`).join("");

    out += `
      <div class="section-box" data-cat="${cat.id}">
        <div class="header-box">
          <h1>SÁCH - ${cat.name}</h1>
        </div>
        <div class="content-box">
          ${radios}
          <div id="product-list-${cat.id}">
            ${placeholders}
          </div>
          <div id="pagination-controls-${cat.id}">
            <label id="nav-prev-${cat.id}" class="nav-btn gray">&#8592;</label>
            <span id="page-info-${cat.id}"></span>
            <label id="nav-next-${cat.id}" class="nav-btn red">&#8594;</label>
          </div>
        </div>
      </div>
    `;
  });

  main.innerHTML = out;
}

// === Render Products ===
export function renderProduct() {
  categoryList.forEach(cat => {
    const container = document.getElementById(`product-list-${cat.id}`);
    if (!container) return;

    let html = "";
    cat.products.forEach((p, i) => {
      const page = Math.floor(i / 4) + 1;
      html += `
        <div class="product-card product-page-${page}-${cat.id}" id="${p.id}" data-cat="${cat.id}">
          <img src="${p.img || ""}" alt="${p.title || ""}" onerror="this.onerror=null;this.src='./img/Error.png';">
          <p class="title">${p.title || ""}</p>
          <p class="price">${p.price ? p.price.toLocaleString() + " VNĐ" : ""}</p>
        </div>
      `;
    });

    container.innerHTML = html;
  });
}

// === Mở popup chi tiết ===
function openPopup(product) {
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("popup");
  if (!overlay || !popup) return;
  const categoryName = categoryList.find(i => (i.id === product.category)).name;
  document.getElementById("popup-img").src = product.img || "";
  document.getElementById("popup-title").textContent = product.title || "";
    document.getElementById("popup-author").textContent = product.author || "";
      document.getElementById("popup-puplicYear").textContent = product.publicYear || "";
    document.getElementById("popup-puplisher").textContent = product.publisher || "";
      document.getElementById("popup-category").textContent = categoryName || "";
      document.getElementById("popup-price").textContent = product.price
    ? product.price.toLocaleString() + " VNĐ"
    : "";
  document.getElementById("popup-desc").textContent = product.description || "";

  overlay.classList.remove("hidden");
  popup.classList.remove("hidden");
}

// === Đóng popup ===
function closePopup() {
  document.getElementById("overlay").classList.add("hidden");
  document.getElementById("popup").classList.add("hidden");
}

// === Gắn sự kiện mua & popup ===
export function attachBuyHandlers(onAdd, onBuy) {
  const main = document.getElementById("main-content");

  main.addEventListener("click", e => {
    const card = e.target.closest(".product-card");
    if (!card) return;
    const found = productList.find(p => p.id === card.id);
    selectedProduct = found || null;
    if (selectedProduct) openPopup(selectedProduct);
  });

  window.addToCart = () => {
    if (selectedProduct && typeof onAdd === "function") onAdd(selectedProduct);
    else console.log("🛒 Thêm vào giỏ:", selectedProduct);
  };

  window.buyNow = () => {
    if (selectedProduct && typeof onBuy === "function") onBuy(selectedProduct);
    else console.log("💳 Mua ngay:", selectedProduct);
  };
}

// === CSS Logic ===
async function css() {
  renderCategory();
  renderProduct();

  categoryList.forEach(cat => {
    const totalPages = Math.ceil(cat.products.length / 4) || 1;

    const list = document.querySelector(`#product-list-${cat.id}`);
    list.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 24px;
    `;

    const updatePage = () => {
      // Ẩn toàn bộ sản phẩm
      list.querySelectorAll(".product-card").forEach(p => (p.style.display = "none"));

      // Xác định trang hiện tại
      const currentPage = Array.from(
        document.querySelectorAll(`input[name="page-${cat.id}"]`)
      ).findIndex(r => r.checked) + 1;

      // Hiện sản phẩm của trang đó
      list.querySelectorAll(`.product-page-${currentPage}-${cat.id}`).forEach(p => {
        p.style.display = "block";
      });

      // Cập nhật hiển thị phân trang
      document.querySelector(`#page-info-${cat.id}`).textContent = `Trang ${currentPage} / ${totalPages}`;

      // Cập nhật hiển thị nút điều hướng
      const prev = document.querySelector(`#nav-prev-${cat.id}`);
      const next = document.querySelector(`#nav-next-${cat.id}`);
      prev.style.display = currentPage === 1 ? "none" : "inline-block";
      next.style.display = currentPage === totalPages ? "none" : "inline-block";
    };

    // Gắn sự kiện click vào nút prev/next
    const prevBtn = document.querySelector(`#nav-prev-${cat.id}`);
    const nextBtn = document.querySelector(`#nav-next-${cat.id}`);
    prevBtn.addEventListener("click", () => {
      const radios = document.querySelectorAll(`input[name="page-${cat.id}"]`);
      const current = Array.from(radios).findIndex(r => r.checked);
      if (current > 0) {
        radios[current - 1].checked = true;
        updatePage();
      }
    });
    nextBtn.addEventListener("click", () => {
      const radios = document.querySelectorAll(`input[name="page-${cat.id}"]`);
      const current = Array.from(radios).findIndex(r => r.checked);
      if (current < radios.length - 1) {
        radios[current + 1].checked = true;
        updatePage();
      }
    });

    // Bắt sự kiện khi đổi radio thủ công
    document.querySelectorAll(`input[name="page-${cat.id}"]`).forEach(r => {
      r.addEventListener("change", updatePage);
    });

    updatePage();
  });
}

// === Khởi động ===
document.addEventListener("DOMContentLoaded", () => {
  renderCategory();
  renderProduct();
  attachBuyHandlers();
  css();

  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("close-btn");
  if (overlay) overlay.addEventListener("click", closePopup);
  if (closeBtn) closeBtn.addEventListener("click", closePopup);
});

// === Hiển thị danh sách sản phẩm (không chia thể loại) ===
export function renderFilteredProducts(list) {
  const main = document.getElementById("main-content");
  if (!main) return;

  // Nếu danh sách trống
  if (!list || list.length === 0) {
    main.innerHTML = `<div class="no-result">Không tìm thấy sản phẩm nào.</div>`;
    return;
  }

  // Tạo HTML hiển thị tất cả sản phẩm trong 1 khung
  const html = `
    <div class="section-box">
      <div class="header-box">
        <h1>KẾT QUẢ LỌC SẢN PHẨM</h1>
      </div>
      <div class="content-box" id="filtered-product-list" 
           style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:24px;">
        ${list.map(p => `
          <div class="product-card" id="${p.id}">
            <img src="${p.img || "./img/Error.png"}" alt="${p.title}">
            <p class="title">${p.title}</p>
            <p class="price">${p.price.toLocaleString("vi-VN")} VNĐ</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
  main.innerHTML = html;
}
