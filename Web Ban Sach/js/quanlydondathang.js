
// DOM
const tbodyDonHang = document.querySelector("#tableDonHang tbody");
const btnTimDonHang = document.getElementById("btnTimDonHang");
const statusFilter = document.getElementById("statusFilter");
const modal = document.getElementById("chiTietDonHang");
const chiTietNoiDung = document.getElementById("chiTietNoiDung");
const capNhatTrangThai = document.getElementById("capNhatTrangThai");
const btnCapNhatTrangThai = document.getElementById("btnCapNhatTrangThai");

// Lấy dữ liệu sản phẩm và tài khoản (nếu cần)
import { productList, account } from "./loadData.js";

// 1️⃣ Load danh sách đơn từ localStorage
let donHangs = JSON.parse(localStorage.getItem("orders")) || [];

// 2️⃣ Hàm hiển thị trạng thái
function trangThaiHienThi(code) {
  switch (code) {
    case "moi": return "Mới đặt";
    case "xuly": return "Đã xử lý";
    case "giaohang": return "Đã giao";
    case "huy": return "Đã hủy";
    default: return code;
  }
}

// 3️⃣ Hiển thị danh sách đơn
function hienThiDonHang(list) {
  tbodyDonHang.innerHTML = "";

  list.forEach((dh, index) => {  
      const object = account.find(i => i.username === dh.username);
      const customerName = object ? object.name : dh.username;

      const total = typeof dh.tong === "number" ? dh.tong : 0;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>  <!-- dùng index + 1 làm mã đơn -->
        <td>${customerName}</td>
        <td>${new Date(dh.ngay).toLocaleDateString("vi-VN")}</td>
        <td>${total.toLocaleString()} đ</td>
        <td>${trangThaiHienThi(dh.trangthai)}</td>
        <td><button class="xemChiTiet" data-id="${dh.id}">Xem</button></td>
      `;
      tbodyDonHang.appendChild(tr);
});
}


//  Hàm xem chi tiết đơn
function xemChiTiet(id) {
  const dh = donHangs.find(d => d.id == id);
  if (!dh) return alert("Đơn hàng không tồn tại!");

  // Lấy tên khách
  const object = account.find(i => i.username === dh.username);
  const customerName = object ? object.name : dh.username;

  let text = `
    <p><b>Khách hàng:</b> ${customerName}</p>
    <p><b>Ngày đặt:</b> ${new Date(dh.ngay).toLocaleDateString("vi-VN")}</p>
    <p> </p>
    <p><b>Tổng tiền:</b> ${dh.tong.toLocaleString()} đ</p>
  `;
  chiTietNoiDung.innerHTML = text;

  // Sản phẩm
  let textTable = "Sản phẩm: ";
    const chitietCoSoLuong = dh.chitiet.filter(i => i.soluong > 0); // Lọc sản phẩm > 0
    chitietCoSoLuong.forEach((i, index) => {
        const product = productList.find(p => p.id === i.id);
        const name = product ? product.title || product.title : i.id;
        textTable += `${name} (${i.soluong})${index < chitietCoSoLuong.length - 1 ? ", " : ""}`;
  });

  document.querySelector("#chiTietNoiDung p:nth-child(3)").textContent = textTable;

  // Set trạng thái
  capNhatTrangThai.value = dh.trangthai;
  modal.classList.remove("hidden");

  // Cập nhật trạng thái
  btnCapNhatTrangThai.onclick = () => {
    dh.trangthai = capNhatTrangThai.value;
    localStorage.setItem("orders", JSON.stringify(donHangs));
    alert("Cập nhật thành công!");
    modal.classList.add("hidden");
    hienThiDonHang(donHangs);
  };
}

// 5️⃣ Sự kiện click Xem chi tiết
tbodyDonHang.addEventListener("click", e => {
  if (e.target.classList.contains("xemChiTiet")) {
    xemChiTiet(e.target.dataset.id);
  }
});

// 6️⃣ Đóng modal
document.querySelector(".close").addEventListener("click", () => {
  modal.classList.add("hidden");
});

// 7️⃣ Tìm kiếm theo ngày và trạng thái
btnTimDonHang.addEventListener("click", () => {
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;
  const status = statusFilter.value;

  const result = donHangs.filter(dh => {
    const dhDate = new Date(dh.ngay);
    const matchDate = (!from || dhDate >= new Date(from)) && (!to || dhDate <= new Date(to));
    const matchStatus = !status || dh.trangthai === status;
    return matchDate && matchStatus;
  });

  hienThiDonHang(result);
});

// 8️⃣ Hiển thị lần đầu
hienThiDonHang(donHangs);