import { productList, ready, categoryList } from "./loadData.js";
// Dữ liệu mẫu
let products = [];
ready.then(() => {
    products = productList.map((p, index) => ({
        id: index + 1,
        code: p.id,
        title: p.title,
        category: p.category,
        amount: p.amount,
        price: p.price,
        author: p.author,
        description: p.description,
        img: (p.img) ? p.img : "./img/Error.png",
        status: p.status,
    }));
    updateData(products);
    renderProducts(products);
})

function updateData(list) {
    let product = list.map(p => ({
        id: p.code,
        title: p.title,
        category: p.category,
        amount: p.amount,
        price: p.price,
        author: p.author,
        description: p.description,
        img: (p.img) ? p.img : "./img/Error.png",
        status: p.status,
    }));
    localStorage.setItem("products", JSON.stringify(product));
}

// Biến để lưu ID sản phẩm đang được chỉnh sửa hoặc xóa
let currentProductId = null;

// Hàm hiển thị danh sách sản phẩm
function renderProducts() {
    const productTableBody = document.querySelector('#quanlysanpham #productTableBody');
    productTableBody.innerHTML = '';

    products.forEach(product => {
        const statusClass = product.status === 'active' ? 'status-active' : 'status-inactive';
        const statusText = product.status === 'active' ? 'Hiển thị' : 'Đã ẩn';
        const formattedPrice = product.price.toLocaleString('vi-VN') + 'đ';
        const nameCategory = categoryList.find(i => (i.id === product.category)).name;
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${product.id}</td>
                    <td><img src="${product.img}" class="product-image" alt="${product.title}"></td>
                    <td>
                        <div class="fw-bold">${product.title}</div>
                        <small class="text-muted">${product.code}</small>
                    </td>
                    <td>${product.author}</td>
                    <td>${nameCategory}</td>
                    <td class="fw-bold">${formattedPrice}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-action btn-outline-primary edit-btn" data-id="${product.id}" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-action ${product.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'} toggle-status-btn" data-id="${product.id}" title="${product.status === 'active' ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}">
                            <i class="fas ${product.status === 'active' ? 'fa-eye-slash' : 'fa-eye'}"></i>
                        </button>
                        <button class="btn btn-sm btn-action btn-outline-danger delete-btn" data-id="${product.id}" title="Xóa sản phẩm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
        productTableBody.appendChild(row);
    });

    // Gắn sự kiện cho các nút
    attachEventListeners();
}


// Hàm gắn sự kiện cho các nút
function attachEventListeners() {
    // Nút chỉnh sửa
    document.querySelectorAll('#quanlysanpham .edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const productId = parseInt(this.getAttribute('data-id'));
            openEditModal(productId);
        });
    });

    // Nút thay đổi trạng thái
    document.querySelectorAll('#quanlysanpham .toggle-status-btn').forEach(button => {
        button.addEventListener('click', function () {
            const productId = parseInt(this.getAttribute('data-id'));
            toggleProductStatus(productId);
        });
    });

    // Nút xóa
    document.querySelectorAll('#quanlysanpham .delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const productId = parseInt(this.getAttribute('data-id'));
            openDeleteModal(productId);
        });
    });
}

// Hàm mở modal chỉnh sửa
function openEditModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.querySelector('#quanlysanpham #editProductId').value = product.id;
    document.querySelector('#quanlysanpham #editProductCode').value = product.code;
    document.querySelector('#quanlysanpham #editProductName').value = product.title;
    document.querySelector('#quanlysanpham #editProductAuthor').value = product.author;
    document.querySelector('#quanlysanpham #editProductCategory').value = product.category;
    document.querySelector('#quanlysanpham #editProductPrice').value = product.price;
    document.querySelector('#quanlysanpham #editProductDescription').value = product.description;
    document.querySelector('#quanlysanpham #editProductStatus').checked = product.status === 'active';

    // Hiển thị hình ảnh hiện tại
    const imagePreview = document.querySelector('#quanlysanpham #editImagePreview');
    imagePreview.innerHTML = `<img src="${product.img}" class="product-image" alt="${product.title}">`;

    document.getElementById('editProductModal').classList.add('show');
}



// Hàm mở modal xóa
function openDeleteModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentProductId = productId;
    document.querySelector('#quanlysanpham #deleteProductInfo').textContent = `Mã: ${product.code} - Tên: ${product.title}`;

    document.querySelector('#quanlysanpham #deleteProductModal').classList.add('show');
}

// Hàm thay đổi trạng thái sản phẩm
function toggleProductStatus(productId) {
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return;

    const newStatus = products[productIndex].status === 'active' ? 'inactive' : 'active';
    products[productIndex].status = newStatus;

    updateData(products);
    renderProducts();

    showAlert(`Đã ${newStatus === 'active' ? 'hiển thị' : 'ẩn'} sản phẩm "${products[productIndex].title}"`, 'success');
}


// Hàm xóa sản phẩm
function deleteProduct() {
    if (!currentProductId) return;

    const productIndex = products.findIndex(p => p.id === currentProductId);
    if (productIndex === -1) return;

    const productName = products[productIndex].title;
    products.splice(productIndex, 1);
    renderProducts();

    document.querySelector('#quanlysanpham #deleteProductModal').classList.remove('show');

    // Hiển thị thông báo
    showAlert(`Đã xóa sản phẩm "${productName}"`, 'success');

    currentProductId = null;
    updateData(products);
}
// Hàm thêm sản phẩm mới
function addProduct() {
    const code = document.querySelector('#quanlysanpham #addProductCode').value;
    const name = document.querySelector('#quanlysanpham #addProductName').value;
    const author = document.querySelector('#quanlysanpham #addProductAuthor').value;
    const category = document.querySelector('#quanlysanpham #addProductCategory').value;
    const price = parseInt(document.querySelector('#quanlysanpham #addProductPrice').value);
    const description = document.querySelector('#quanlysanpham #addProductDescription').value;
    const status = document.querySelector('#quanlysanpham #addProductStatus').checked ? 'active' : 'inactive';

    // Kiểm tra xem mã sản phẩm đã tồn tại chưa
    if (products.some(p => p.code === code)) {
        showAlert('Mã sản phẩm đã tồn tại!', 'danger');
        return;
    }

    // Kiểm tra dữ liệu nhập vào
    if (!code || !name || !author || !category || !price) {
        showAlert('Vui lòng điền đầy đủ thông tin bắt buộc!', 'warning');
        return;
    }

    // Tạo ID mới
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

    // Xử lý hình ảnh
    const imageInput = document.getElementById('addProductImage');
    let imageUrl = "./img/Error.png";

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imageUrl = e.target.result;

            // Thêm sản phẩm mới
            const newProduct = {
                id: newId,
                code: code,
                title: name,
                author: author,
                category: category,
                price: price,
                amount: 0,
                description: description,
                img: imageUrl,
                status: status
            };

            products.push(newProduct);
            updateData(products);
            renderProducts();

            // Đóng modal và reset form
            document.querySelector('#quanlysanpham #addProductModal').classList.remove('show');
            document.querySelector('#quanlysanpham #addProductForm').reset();
            document.querySelector('#quanlysanpham #addImagePreview').innerHTML = '';

            // Hiển thị thông báo
            showAlert(`Đã thêm sản phẩm "${name}" thành công!`, 'success');
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        // Thêm sản phẩm mới mà không có hình ảnh mới
        const newProduct = {
            id: newId,
            code: code,
            name: name,
            author: author,
            category: category,
            price: price,
            description: description,
            img: imageUrl,
            status: status
        };

        products.push(newProduct);
        updateData(products);
        renderProducts();

        // Đóng modal và reset form
        document.querySelector('#quanlysanpham #addProductModal').classList.remove('show');
        document.querySelector('#quanlysanpham #addProductForm').reset();
        document.querySelector('#quanlysanpham #addImagePreview').innerHTML = '';

        // Hiển thị thông báo
        showAlert(`Đã thêm sản phẩm "${name}" thành công!`, 'success');
    }
}

// Hàm cập nhật sản phẩm 
function updateProduct() {
    const productId = parseInt(document.querySelector('#quanlysanpham #editProductId').value);
    const code = document.querySelector('#quanlysanpham #editProductCode').value;
    const name = document.querySelector('#quanlysanpham #editProductName').value;
    const author = document.querySelector('#quanlysanpham #editProductAuthor').value;
    const category = document.querySelector('#quanlysanpham #editProductCategory').value;
    const price = parseInt(document.querySelector('#quanlysanpham #editProductPrice').value);
    const description = document.querySelector('#quanlysanpham #editProductDescription').value;
    const status = document.querySelector('#quanlysanpham #editProductStatus').checked ? 'active' : 'inactive';

    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return;

    // Kiểm tra xem mã sản phẩm đã tồn tại chưa (trừ sản phẩm đang chỉnh sửa)
    if (products.some(p => p.code === code && p.id !== productId)) {
        showAlert('Mã sản phẩm đã tồn tại!', 'danger');
        return;
    }

    // Kiểm tra dữ liệu nhập vào
    if (!code || !name || !author || !category || !price) {
        showAlert('Vui lòng điền đầy đủ thông tin bắt buộc!', 'warning');
        return;
    }

    // Xử lý hình ảnh
    const imageInput = document.querySelector('#quanlysanpham #editProductImage');

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            products[productIndex].code = code;
            products[productIndex].title = title;
            products[productIndex].author = author;
            products[productIndex].category = category;
            products[productIndex].price = price;
            products[productIndex].description = description;
            products[productIndex].img = e.target.result;
            products[productIndex].status = status;
            updateData(products);
            renderProducts();

            // Đóng modal
            document.querySelector('#quanlysanpham #editProductModal').classList.remove('show');

            // Hiển thị thông báo
            showAlert(`Đã cập nhật sản phẩm "${name}" thành công!`, 'success');
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        // Cập nhật thông tin sản phẩm mà không thay đổi hình ảnh
        products[productIndex].code = code;
        products[productIndex].title = title;
        products[productIndex].author = author;
        products[productIndex].category = category;
        products[productIndex].price = price;
        products[productIndex].description = description;
        products[productIndex].status = status;
        updateData(products);
        renderProducts();

        // Đóng modal
        document.querySelector('#quanlysanpham #editProductModal').classList.remove('show');

        // Hiển thị thông báo
        showAlert(`Đã cập nhật sản phẩm "${name}" thành công!`, 'success');
    }
}

// Hàm xử lý xem trước hình ảnh khi chọn file
function handleImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    input.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                preview.innerHTML = `<img src="${e.target.result}" class="product-image" alt="Preview">`;
            }

            reader.readAsDataURL(this.files[0]);
        }
    });
}

// Hàm hiển thị thông báo
function showAlert(message, type) {
    // Tạo phần tử alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible`;
    alertDiv.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-dismiss="alert">&times;</button>
            `;

    // Thêm alert vào đầu main content
    const mainContent = document.querySelector('#quanlysanpham .main-content');
    mainContent.insertBefore(alertDiv, mainContent.firstChild);

    // Tự động ẩn alert sau 5 giây
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Hàm tìm kiếm sản phẩm
function searchProducts() {
    const searchTerm = document.querySelector('#quanlysanpham #searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.author.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.code.toLowerCase().includes(searchTerm)
    );

    const productTableBody = document.querySelector('#quanlysanpham #productTableBody');
    productTableBody.innerHTML = '';

    filteredProducts.forEach(product => {
        const statusClass = product.status === 'active' ? 'status-active' : 'status-inactive';
        const statusText = product.status === 'active' ? 'Hiển thị' : 'Đã ẩn';
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(product.price) + ' đ';

        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${product.code}</td>
                    <td><img src="${product.img}" class="product-image" alt="${product.title}"></td>
                    <td>
                        <div class="fw-bold">${product.title}</div>
                        <small class="text-muted">${product.code}</small>
                    </td>
                    <td>${product.author}</td>
                    <td>${product.category}</td>
                    <td class="fw-bold">${formattedPrice}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-action btn-outline-primary edit-btn" data-id="${product.id}" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-action ${product.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'} toggle-status-btn" data-id="${product.id}" title="${product.status === 'active' ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}">
                            <i class="fas ${product.status === 'active' ? 'fa-eye-slash' : 'fa-eye'}"></i>
                        </button>
                        <button class="btn btn-sm btn-action btn-outline-danger delete-btn" data-id="${product.id}" title="Xóa sản phẩm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
        productTableBody.appendChild(row);
    });

    // Gắn lại sự kiện cho các nút
    attachEventListeners();
}

// Khởi tạo sự kiện khi tài liệu được tải
document.addEventListener('DOMContentLoaded', function () {
    // Hiển thị danh sách sản phẩm ban đầu
    renderProducts();

    // Gắn sự kiện cho nút mở modal thêm sản phẩm
    document.querySelector('#quanlysanpham #openAddProductModal').addEventListener('click', function () {
        document.querySelector('#quanlysanpham #addProductModal').classList.add('show');
    });

    // Gắn sự kiện cho nút đóng modal thêm sản phẩm
    document.querySelector('#quanlysanpham #closeAddProductModal').addEventListener('click', function () {
        document.querySelector('#quanlysanpham #addProductModal').classList.remove('show');
    });

    // Gắn sự kiện cho nút hủy thêm sản phẩm
    document.querySelector('#quanlysanpham #cancelAddProduct').addEventListener('click', function () {
        document.querySelector('#quanlysanpham #addProductModal').classList.remove('show');
    });

    // Gắn sự kiện cho nút lưu sản phẩm mới
    document.querySelector('#quanlysanpham #saveProductBtn').addEventListener('click', addProduct);

    // Gắn sự kiện cho nút đóng modal chỉnh sửa
    document.querySelector('#quanlysanpham #closeEditProductModal').addEventListener('click', function () {
        document.querySelector('#quanlysanpham #editProductModal').classList.remove('show');
    });

    // Gắn sự kiện cho nút hủy chỉnh sửa
    document.querySelector('#quanlysanpham #cancelEditProduct').addEventListener('click', function () {
        document.querySelector('#quanlysanpham #editProductModal').classList.remove('show');
    });

    // Gắn sự kiện cho nút cập nhật sản phẩm
    document.querySelector('#quanlysanpham #updateProductBtn').addEventListener('click', updateProduct);

    // Gắn sự kiện cho nút đóng modal xóa
    document.querySelector('#quanlysanpham #closeDeleteProductModal').addEventListener('click', function () {
        document.querySelector('#quanlysanpham #deleteProductModal').classList.remove('show');
    });

    // Gắn sự kiện cho nút hủy xóa
    document.querySelector('#quanlysanpham #cancelDeleteProduct').addEventListener('click', function () {
        document.querySelector('#quanlysanpham #deleteProductModal').classList.remove('show');
    });

    // Gắn sự kiện cho nút xác nhận xóa
    document.querySelector('#quanlysanpham #confirmDeleteBtn').addEventListener('click', deleteProduct);

    // Xử lý xem trước hình ảnh
    handleImagePreview('addProductImage', 'addImagePreview');
    handleImagePreview('editProductImage', 'editImagePreview');

    // Reset form khi modal thêm sản phẩm đóng
    document.querySelector('#quanlysanpham #addProductModal').addEventListener('click', function (e) {
        if (e.target === this) {
            document.querySelector('#quanlysanpham #addProductModal').classList.remove('show');
        }
    });

    document.querySelector('#quanlysanpham #editProductModal').addEventListener('click', function (e) {
        if (e.target === this) {
            document.querySelector('#quanlysanpham #editProductModal').classList.remove('show');
        }
    });

    document.querySelector('#quanlysanpham #deleteProductModal').addEventListener('click', function (e) {
        if (e.target === this) {
            document.querySelector('#quanlysanpham #deleteProductModal').classList.remove('show');
        }
    });

    // Xử lý tìm kiếm
    document.getElementById('searchInput').addEventListener('input', searchProducts);

    document.querySelectorAll(".ProductCategory").forEach(i => {
        let text = ``;
        if (i.id === "addProductCategory") {
            text += `<option value="">Chọn thể loại</option>`
        }
        categoryList.forEach(category => {
            text += `<option value="${category.id}">${category.name}</option>`
        })
        i.innerHTML = text;
    })
});


//hiern thi san pham tong quan
document.addEventListener("DOMContentLoaded", () => {
  const stats = document.querySelectorAll(".stats-number");
  if (stats.length >= 4) {
    stats[0].textContent = `${productList.length}`;
    stats[1].textContent = `${productList.filter(i => i.status === "active").length}`;
    stats[2].textContent = `${productList.filter(i => i.status === "unactive").length}`;
    stats[3].textContent = `${categoryList.length}`;
  }
});
