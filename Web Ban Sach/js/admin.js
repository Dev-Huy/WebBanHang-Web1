import { hashPassword } from "./loadData.js";

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

let adminAccounts = [{
    email: "baodeptrai@gmail.com",
    password: "7a460947a7ac5ece7d4b3a14f14a7f256a9042624c9cb253c896282828925bea"
}];

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

// const loginElement = document.querySelector("#login-form");
// loginElement.addEventListener("submit", async (event) => {
//     // let countLock = 0;
//     event.preventDefault();
//     if (!isReload) {
//         sessionStorage.setItem("admin", JSON.stringify(email));
//         document.getElementById("login-screen").style.display = "none";
//         document.getElementById("container").classList.add("loggedin");
//         const user = sessionStorage.getItem("admin");
//         document.getElementById("userShow").textContent = `${JSON.parse(user)}`;
//     }
//     const email = document.getElementById("admin-email").value.trim();
//     const password = await hashPassword(document.getElementById("admin-password").value.trim());
//     console.log(email);
//     console.log(password);
//     const em = adminAccounts.find(i => i.email === email);
//     console.log(em);

//     if (!em) {
//         alert(`Tài khoản không tồn tại!\nVui lòng liên hệ với nhà cung cấp!`);
//         return;
//     }

//     if (em.password !== password) {
//         alert("Mật khẩu không chính xác!\nNếu cần cấp hoặc đổi mật khẩu, vui lòng liên hệ nhà cung cấp!");
//         return;
//     }
// });


