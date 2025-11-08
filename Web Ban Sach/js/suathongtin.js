import { account, hashPassword } from "./loadData.js";

export function editProfile() {

  const popup = document.querySelector("#editPopup");
  const closeBtn = document.querySelector("#closeBtn");
  const saveBtn = document.querySelector("#saveBtn");
  const editForm = document.querySelector("#editForm");

  // Lấy người dùng hiện tại
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser) return;


  // Hiển thị dữ liệu hiện tại của user vào form
  document.getElementById("name-edit").value = currentUser.name || "";
  document.getElementById("email-edit").value = currentUser.email || "";
  document.getElementById("phone-edit").value = currentUser.phone || "";
  document.getElementById("address-edit").value = currentUser.address || "";


  // Khi nhấn "Đóng"
  closeBtn.addEventListener("click", () => {
    location.href = "index.html";
  });

  // Khi nhấn "Lưu"
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newName = document.getElementById("name-edit").value.trim();
    const newEmail = document.getElementById("email-edit").value.trim();
    const newPhone = document.getElementById("phone-edit").value.trim();
    const newAddress = document.getElementById("address-edit").value.trim();

    // Cập nhật thông tin
    currentUser.name = newName;
    currentUser.email = newEmail;
    currentUser.phone = newPhone;
    currentUser.address = newAddress;

    // Khi bấm nút "Sửa thông tin"
    const index = account.findIndex(u => u.username === currentUser.username);
    account[index] = currentUser;

    // Lưu lại toàn bộ danh sách tài khoản
    localStorage.setItem("accounts", JSON.stringify(account));
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
    alert("Cập nhật thông tin thành công!");
    location.href = "index.html";
  });
}

export function editPassword() {
  document.getElementById("editPassword").addEventListener("submit", async () => {

    const username = document.getElementById("username-edit").value.trim();
    const password = await hashPassword(document.getElementById("password-edit").value.trim());
    const passwordAgain = await hashPassword(document.getElementById("passwordAgain-edit").value.trim());
    const user = account.find(i => (i.username === username));
    if (!user) {
      alert("Tài khoản không tồn tại!");
      return;
    }
    if (password !== passwordAgain) {
      alert("Mật khẩu mới nhập lại không trùng khớp với mật khẩu mới đã nhập!");
      return;
    }
    user.password = passwordAgain;
    localStorage.setItem("accounts", JSON.stringify(account));
    window.location.href = "dangnhap.html?action=signin";
  })
}
