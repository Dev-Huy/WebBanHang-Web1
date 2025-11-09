import { productList, categoryList } from "./loadData.js";
categoryList.forEach(cat => {
  cat.products = productList.filter(p => p.category === cat.id);
});

let productSelected = JSON.parse(localStorage.getItem("productSelected")) || [];

let selectedProduct = null;

// === Render Category Containers ===
export function renderCategory() {
  const main = document.getElementById("main-content");
  let out = "";

  categoryList.forEach(cat => {
    // Tính số trang theo số lượng sản phẩm
    const productSearch = productList.filter(i => (i.category === cat.id));
    const totalPages = Math.ceil(productSearch.length / 4) || 1;

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
    const productSearch = productList.filter(i => (i.category === cat.id));
    productSearch.forEach((p, i) => {
      const page = Math.floor(i / 4) + 1;
      html += `
        <div class="product-card product-page-${page}-${cat.id}" id="${p.id}" data-cat="${cat.id}" data-id="${p.id}">
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
export function openPopup(product) {
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("popup");
  document.getElementById("add-to-cart").dataset.id = product.id;
  document.getElementById("buy-now").dataset.id = product.id;
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

export function onAdd(object) {
  const newChoice = {
    id: object.id,
    title: object.title,
    author: object.author,
    img: object.img,
    price: object.price,
    qty: 1
  };
  productSelected.push(newChoice);
  localStorage.setItem("productSelected", JSON.stringify(productSelected));
  closePopup();
}

export function onBuy(object) {
  const newChoice = {
    id: object.id,
    title: object.title,
    author: object.author,
    img: object.img,
    price: object.price,
    qty: 1
  };
  productSelected.push(newChoice);
  localStorage.setItem("productSelected", JSON.stringify(productSelected));
  closePopup();
  location.href = "thanhtoan.html";
}

// === Gắn sự kiện mua & popup ===
export function attachBuyHandlers(onAdd, onBuy) {
  document.body.addEventListener("click", e => {
    // Click vào card để mở popup
    const card = e.target.closest(".product-card");
    if (card) {
      const found = productList.find(p => p.id.toString() === card.id);
      selectedProduct = found || null;
      if (selectedProduct) openPopup(selectedProduct);
      return;
    }

    // Click nút thêm vào giỏ
    if (e.target.matches("#add-to-cart")) {
      const id = e.target.dataset.id;
      const found = productList.find(p => p.id.toString() === id);
      if (found && typeof onAdd === "function") {
        onAdd(found);
      }
    }

    // Click nút mua ngay
    if (e.target.matches("#buy-now")) {
      const id = e.target.dataset.id;
      const found = productList.find(p => p.id.toString() === id);
      if (found && typeof onBuy === "function") {
        onBuy(found);
      }
    }

    // Click overlay hoặc nút close popup
    if (e.target.matches("#overlay") || e.target.matches("#close-btn")) {
      closePopup();
      selectedProduct = null;
      return;
    }
  });
}

// === CSS Logic ===
export async function css() {
  renderCategory();
  renderProduct();

  categoryList.forEach(cat => {
    const productSearch = productList.filter(i => (i.category === cat.id));
    const totalPages = Math.ceil(productSearch.length / 4) || 1;

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



// === Hiển thị danh sách sản phẩm (không chia thể loại) ===
export function renderFilteredProducts(list) {
  const main = document.getElementById("main-content");
  document.querySelector(".container").style.display = "none";
  if (!main) return;

  if (!list || list.length === 0) {
    main.innerHTML = `<div class="no-result">Không tìm thấy sản phẩm nào.</div>`;
    return;
  }

  main.innerHTML = `
    <div class="section-box">
      <div class="header-box">
        <h1>KẾT QUẢ LỌC SẢN PHẨM</h1>
      </div>
      <div class="content-box" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:24px;">
        ${list.map(p => `
          <div class="product-card" id="${p.id}">
            <img src="${p.img || "./img/Error.png"}" alt="${p.title}">
            <p class="title">${p.title}</p>
            <p class="price">${p.price.toLocaleString("vi-VN")} VNĐ</p>
            <button id="add-to-cart" data-id="${p.id}">Thêm vào giỏ</button>
            <button id="buy-now" data-id="${p.id}">Mua ngay</button>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}
