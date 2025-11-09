import { ready, categoryList } from "./loadData.js";
await ready;

document.addEventListener("DOMContentLoaded", () => {
  const tabCategory = document.querySelector('a[href="#quanlytheloai"]');


  tabCategory.addEventListener("click", initCategoryManager);
  if (window.location.hash === "#quanlytheloai") {
  initCategoryManager();
}

  function initCategoryManager() {
    if (window.categoryManagerLoaded) return;
    window.categoryManagerLoaded = true;

    const tableBody = document.getElementById("categoryTableBody");
    const btnAdd = document.querySelector('#quanlytheloai #btnAddCategory');
    const modal = document.getElementById("modalCategory");
    const closeBtn = document.getElementById("closeCategoryModal");
    const cancelBtn = document.getElementById("cancelCategory");
    const saveBtn = document.getElementById("saveCategoryBtn");
    const form = document.getElementById("categoryForm");
    const idInput = document.getElementById("categoryId");
    const nameInput = document.getElementById("categoryName");
    const title = document.getElementById("categoryModalTitle");

    let editIndex = null;
    let categories = JSON.parse(localStorage.getItem("categories")) || categoryList;

    function renderTable() {
  const tbody = document.getElementById("categoryTableBody");
  tbody.innerHTML = "";

  categories.forEach((c, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.status ? "Hiển thị" : "Ẩn"}</td>
      <td>
        <button class="btn btn-sm btn-warning btn-edit" data-i="${i}">
          <i class="fas fa-edit"></i> Sửa
        </button>
        <button class="btn btn-sm btn-danger btn-del" data-i="${i}">
          <i class="fas fa-trash"></i> Xóa
        </button>
        <button class="btn btn-sm btn-secondary btn-toggle" data-i="${i}">
          ${c.status ? "Ẩn" : "Hiện"}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  localStorage.setItem("categories", JSON.stringify(categories));
}

    btnAdd.onclick = () => {
      form.reset();
      editIndex = null;
      title.textContent = "Thêm thể loại";
      modal.style.display = "flex";
    };

    closeBtn.onclick = () => (modal.style.display = "none");
    
    cancelBtn.onclick = () => modal.style.display = "none";


    saveBtn.onclick = () => {
  const id = idInput.value.trim();
  const name = nameInput.value.trim();
  if (!id || !name) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (editIndex !== null) {
    categories[editIndex].id = id;
    categories[editIndex].name = name;
  } else {
    categories.push({ id, name, status: true });
  }

  renderTable();
  modal.style.display = "none";
};

    
    tableBody.onclick = (e) => {
      const i = e.target.dataset.i;
      if (e.target.classList.contains("btn-edit")) {
        editIndex = i;
        idInput.value = categories[i].id;
        nameInput.value = categories[i].name;
        title.textContent = "Sửa thể loại";
        modal.style.display = "flex";
      } else if (e.target.classList.contains("btn-del")) {
        if (confirm("Xóa thể loại này?")) {
          categories.splice(i, 1);
          renderTable();
        }
      } else if (e.target.classList.contains("btn-toggle")) {
        categories[i].status = !categories[i].status;
        renderTable();
      }
    };

    renderTable();
  }
});


