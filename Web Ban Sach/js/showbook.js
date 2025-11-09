import { productList, categoryList } from "./loadData.js";
import { renderFilteredProducts } from "./render.js";



const backBtn = document.getElementById("back-home");

// Gắn sự kiện click cho từng menu item
// === Ẩn/hiện danh mục khi click menu ===
function renderTheLoai() {
  let text = ``;
  categoryList.forEach(i => {
    text += `<li><a href="#" id="${i.id}">${i.name}</a></li>`
  });
  document.getElementById("sach_truyen").innerHTML = text;
}

renderTheLoai();

document.querySelectorAll("#sach_truyen li a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const menuId = e.target.id;
    const banner = document.querySelector(".container");
    // Nếu không tìm thấy danh mục tương ứng thì dừng
    if (!menuId) return;

    // Ẩn tất cả danh mục
    banner.style.display = "none";
    if (banner) banner.style.display = "none";
    document.querySelectorAll(".section-box").forEach(section => {
      section.style.display = "none";
    });

    // Chỉ hiện danh mục được chọn
    backBtn.style.display = "block"
    const selectedSection = document.querySelector(`.section-box[data-cat="${menuId}"]`);
    if (selectedSection) {
      selectedSection.style.display = "block";
      selectedSection.scrollIntoView({ behavior: "smooth" }); // cuộn đến danh mục đó (tùy chọn)
    }
  });
});
backBtn.addEventListener("click", () => {
  location.href = "index.html";
});

