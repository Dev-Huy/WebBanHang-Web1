
let checkAdmin = false;
// Xử lý hiển thị tab theo hash trong URL
function showTabFromHash() {
    const hash = location.hash.slice(1) || 'home'; // Mặc định là home nếu không có hash
    const targetTab = document.querySelector(`#${hash}`);
    if (targetTab) {
        // Ẩn tất cả các tab
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
        });
        // Hiển thị tab được chọn
        targetTab.style.display = 'block';
        // Cập nhật trạng thái active của sidebar
        document.querySelectorAll("#side_bar_btn a").forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('href') === `#${hash}`);
        });
    }
}

// Khởi tạo khi load trang
showTabFromHash();

// Xử lý sự kiện click sidebar
const sideBarBtnAll = document.querySelectorAll("#side_bar_btn a");
sideBarBtnAll.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const hash = btn.getAttribute('href').slice(1);
        location.hash = hash;
        showTabFromHash(hash);
    });
});

// Xử lý khi hash thay đổi (ví dụ: người dùng dùng nút back/forward)
window.addEventListener('hashchange', showTabFromHash);

const user = sessionStorage.getItem("currentUser");

document.getElementById("userShow").textContent = `${user}` || `Khách`;


