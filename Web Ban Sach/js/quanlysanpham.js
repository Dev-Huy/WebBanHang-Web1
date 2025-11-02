import { productList, ready } from "./loadData.js";

let products = [];

// Load dữ liệu từ localStorage hoặc productList
ready.then(() => {
    const localData = localStorage.getItem("products");
    if (localData) {
        products = JSON.parse(localData);
    } else {
        products = productList;
        localStorage.setItem("products", JSON.stringify(products));
    }
    calculate();
    renderProducts();
});

let currentProductId = null;

// ==== Thống kê sản phẩm ====
function calculate() {
    const totalElement = document.querySelector("#total");
    const activeElement = document.querySelector("#activeTotal");
    const inactiveElement = document.querySelector("#unActiveTotal");
    const categoryElement = document.querySelector("#categoryTotal");

    const total = products.length;
    const activeCount = products.filter(p => p.status === "active").length;
    const inactiveCount = total - activeCount;
    const categoryCount = new Set(products.map(p => p.category)).size;

    totalElement.textContent = total;
    activeElement.textContent = activeCount;
    inactiveElement.textContent = inactiveCount;
    categoryElement.textContent = categoryCount;
}

// ==== Render danh sách sản phẩm ====
function renderProducts(list = products) {
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = '';

    list.forEach(product => {
        const statusClass = product.status === 'active' ? 'status-active' : 'status-inactive';
        const statusText = product.status === 'active' ? 'Hiển thị' : 'Đã ẩn';
        const priceFormatted = new Intl.NumberFormat('vi-VN').format(product.price) + ' đ';
        const imgSrc = product.img || '';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${imgSrc}" class="product-image" alt="${product.name}"></td>
            <td>${product.name}</td>
            <td>${product.author}</td>
            <td>${product.category}</td>
            <td class="fw-bold">${priceFormatted}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm ${product.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'} toggle-status-btn" data-id="${product.id}"><i class="fas ${product.status === 'active' ? 'fa-eye-slash' : 'fa-eye'}"></i></button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${product.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });

    calculate(); // cập nhật thống kê sau mỗi render
}

// ==== Event delegation cho bảng ====
document.getElementById('productTableBody').addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const productId = btn.dataset.id; // String

    if (btn.classList.contains('edit-btn')) openEditModal(productId);
    if (btn.classList.contains('toggle-status-btn')) toggleProductStatus(productId);
    if (btn.classList.contains('delete-btn')) openDeleteModal(productId);
});

// ==== Modal chỉnh sửa ====
function openEditModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductAuthor').value = product.author;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductStatus').checked = product.status === 'active';

    const preview = document.getElementById('editImagePreview');
    preview.innerHTML = `<img src="${product.img}" class="product-image" alt="Preview">`;

    document.getElementById('editProductModal').classList.add('show');
}

// ==== Modal xóa ====
function openDeleteModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentProductId = productId;
    document.getElementById('deleteProductInfo').textContent = `Mã: ${product.id} - Tên: ${product.name}`;
    document.getElementById('deleteProductModal').classList.add('show');
}

// ==== Toggle trạng thái ====
function toggleProductStatus(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    product.status = product.status === 'active' ? 'inactive' : 'active';
    renderProducts();
    localStorage.setItem("products", JSON.stringify(products));
    showAlert(`Đã ${product.status === 'active' ? 'hiển thị' : 'ẩn'} sản phẩm "${product.name}"`, 'success');
}

// ==== Xóa sản phẩm ====
function deleteProduct() {
    if (!currentProductId) return;

    const index = products.findIndex(p => p.id === currentProductId);
    if (index === -1) return;

    const name = products[index].name;
    products.splice(index, 1);
    renderProducts();
    document.getElementById('deleteProductModal').classList.remove('show');
    showAlert(`Đã xóa sản phẩm "${name}"`, 'success');
    currentProductId = null;
    localStorage.setItem("products", JSON.stringify(products));
}

// ==== Thêm sản phẩm ====
function addProduct() {
    const id = document.getElementById('addProductCode').value;
    const name = document.getElementById('addProductName').value;
    const author = document.getElementById('addProductAuthor').value;
    const category = document.getElementById('addProductCategory').value;
    const price = parseInt(document.getElementById('addProductPrice').value);
    const description = document.getElementById('addProductDescription').value;
    const status = document.getElementById('addProductStatus').checked ? 'active' : 'inactive';
    const imageInput = document.getElementById('addProductImage');

    if (!id || !name || !author || !category || !price) {
        return showAlert('Vui lòng điền đầy đủ thông tin!', 'warning');
    }

    if (products.some(p => p.id === id)) {
        return showAlert('Mã sản phẩm đã tồn tại!', 'danger');
    }

    const newProduct = { id, name, author, category, price, description, status, img: '' };

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            newProduct.img = e.target.result;
            products.push(newProduct);
            afterAdd();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        products.push(newProduct);
        afterAdd();
    }

    function afterAdd() {
        renderProducts();
        document.getElementById('addProductForm').reset();
        document.getElementById('addImagePreview').innerHTML = '';
        document.getElementById('addProductModal').classList.remove('show');
        showAlert(`Đã thêm sản phẩm "${name}" thành công!`, 'success');
        localStorage.setItem("products", JSON.stringify(products));
    }
}

// ==== Cập nhật sản phẩm ====
function updateProduct() {
    const id = document.getElementById('editProductId').value;
    const product = products.find(p => p.id === id);
    if (!product) return;

    const name = document.getElementById('editProductName').value;
    const author = document.getElementById('editProductAuthor').value;
    const category = document.getElementById('editProductCategory').value;
    const price = parseInt(document.getElementById('editProductPrice').value);
    const description = document.getElementById('editProductDescription').value;
    const status = document.getElementById('editProductStatus').checked ? 'active' : 'inactive';
    const imageInput = document.getElementById('editProductImage');

    if (!name || !author || !category || !price) {
        return showAlert('Vui lòng điền đầy đủ thông tin!', 'warning');
    }

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            Object.assign(product, { name, author, category, price, description, status, img: e.target.result });
            afterUpdate();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        Object.assign(product, { name, author, category, price, description, status });
        afterUpdate();
    }

    function afterUpdate() {
        renderProducts();
        document.getElementById('editProductModal').classList.remove('show');
        showAlert(`Đã cập nhật sản phẩm "${name}" thành công!`, 'success');
        localStorage.setItem("products", JSON.stringify(products));
    }
}

// ==== Xem trước hình ảnh ====
function handleImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    input.addEventListener('change', () => {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = e => preview.innerHTML = `<img src="${e.target.result}" class="product-image" alt="Preview">`;
            reader.readAsDataURL(input.files[0]);
        }
    });
}

// ==== Alert ====
function showAlert(msg, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible`;
    alertDiv.innerHTML = `${msg}<button type="button" class="btn-close" data-dismiss="alert">&times;</button>`;
    const main = document.querySelector('.main-content');
    main.insertBefore(alertDiv, main.firstChild);
    setTimeout(() => alertDiv.remove(), 5000);
}

// ==== Tìm kiếm ====
function searchProducts() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p =>
        p.id.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term) ||
        p.author.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
    renderProducts(filtered);
}

// ==== DOMContentLoaded ====
document.addEventListener('DOMContentLoaded', () => {
    handleImagePreview('addProductImage', 'addImagePreview');
    handleImagePreview('editProductImage', 'editImagePreview');
    document.getElementById('searchInput').addEventListener('input', searchProducts);

    // Modal buttons
    const modalMap = {
        openAddProductModal: 'addProductModal',
        closeAddProductModal: 'addProductModal',
        cancelAddProduct: 'addProductModal',
        closeEditProductModal: 'editProductModal',
        cancelEditProduct: 'editProductModal',
        closeDeleteProductModal: 'deleteProductModal',
        cancelDeleteProduct: 'deleteProductModal'
    };

    Object.keys(modalMap).forEach(id => {
        const modalId = modalMap[id];
        document.getElementById(id).onclick = () => {
            const modal = document.getElementById(modalId);
            if (id.startsWith('open')) modal.classList.add('show');
            else modal.classList.remove('show');
        };
    });

    document.getElementById('saveProductBtn').onclick = addProduct;
    document.getElementById('updateProductBtn').onclick = updateProduct;
    document.getElementById('confirmDeleteBtn').onclick = deleteProduct;
});
