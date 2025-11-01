
const donHangs = [
  { id: 1, khach: "Nguyễn Văn A", ngay: "2025-10-25", tong: 189000, trangthai: "moi", chitiet: "Tâm Lý Học Về Tiền" },
  { id: 2, khach: "Trần Thị B", ngay: "2025-10-26", tong: 108000, trangthai: "giaohang", chitiet: "Cây Cam Ngọt Của Tôi" },
  { id: 3, khach: "Lê Anh C", ngay: "2025-10-27", tong: 35000, trangthai: "huy", chitiet: "Vật Lí Lớp 8" },
];


const tbodyDonHang = document.querySelector("#tableDonHang tbody");
const btnTimDonHang = document.getElementById("btnTimDonHang");
const statusFilter = document.getElementById("statusFilter");

function hienThiDonHang(list) {
  tbodyDonHang.innerHTML = "";
  list.forEach(dh => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${dh.id}</td>
      <td>${dh.khach}</td>
      <td>${dh.ngay}</td>
      <td>${dh.tong.toLocaleString()} đ</td>
      <td>${trangThaiHienThi(dh.trangthai)}</td>
      <td><button onclick="xemChiTiet(${dh.id})">Xem</button></td>
    `;
    tbodyDonHang.appendChild(tr);
  });
}
function trangThaiHienThi(code) {
  switch (code) {
    case "moi": return "Mới đặt";
    case "xuly": return "Đã xử lý";
    case "giaohang": return "Đã giao";
    case "huy": return "Đã hủy";
    default: return code;
  }
}
hienThiDonHang(donHangs);

btnTimDonHang.addEventListener("click", () => {
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;
  const status = statusFilter.value;

  const result = donHangs.filter(dh => {
    const matchDate = (!from || dh.ngay >= from) && (!to || dh.ngay <= to);
    const matchStatus = !status || dh.trangthai === status;
    return matchDate && matchStatus;
  });

  hienThiDonHang(result);
});

const modal = document.getElementById("chiTietDonHang");
const chiTietNoiDung = document.getElementById("chiTietNoiDung");
const capNhatTrangThai = document.getElementById("capNhatTrangThai");
const btnCapNhatTrangThai = document.getElementById("btnCapNhatTrangThai");

function xemChiTiet(id) {
  const dh = donHangs.find(d => d.id === id);
  chiTietNoiDung.innerHTML = `
    <p><b>Khách hàng:</b> ${dh.khach}</p>
    <p><b>Ngày đặt:</b> ${dh.ngay}</p>
    <p><b>Sản phẩm:</b> ${dh.chitiet}</p>
    <p><b>Tổng tiền:</b> ${dh.tong.toLocaleString()} đ</p>
  `;
  capNhatTrangThai.value = dh.trangthai;
  modal.classList.remove("hidden");

  btnCapNhatTrangThai.onclick = () => {
    dh.trangthai = capNhatTrangThai.value;
    alert("Cập nhật thành công!");
    modal.classList.add("hidden");
    hienThiDonHang(donHangs);
  };
}
document.querySelector(".close").onclick = () => modal.classList.add("hidden");
