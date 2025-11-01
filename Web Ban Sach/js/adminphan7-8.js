
const donHangs = [
  { id: 1, khach: "Nguyễn Văn A", ngay: "2025-10-25", tong: 189000, trangthai: "moi", chitiet: "Tâm Lý Học Về Tiền" },
  { id: 2, khach: "Trần Thị B", ngay: "2025-10-26", tong: 108000, trangthai: "giaohang", chitiet: "Cây Cam Ngọt Của Tôi" },
  { id: 3, khach: "Lê Anh C", ngay: "2025-10-27", tong: 35000, trangthai: "huy", chitiet: "Vật Lí Lớp 8" },
];

const sanPhams = [
  { id: "SP01", ten: "Tâm Lý  Học Về Tiền", loai: "SachTamLyHoc", ton: 12 },
  { id: "SP02", ten: "Phi Lý Trí", loai: "SachTamLyHoc", ton: 3 },
  { id: "SP03", ten: "Sức Mạnh Của Hiện Tại", loai: "SachTamLyHoc", ton: 25 },
  { id: "SP04", ten: "Trí Tuệ Xúc Cảm", loai: "SachTamLyHoc", ton: 7 },
  { id: "SP05", ten: "Cây Cam Ngọt Của Tôi", loai: "SachVanHoc", ton: 17 },
  { id: "SP06", ten: "Thiên Tài Bên Trái Kẻ Điên Bên Phải", loai: "SachVanHoc", ton: 9 },
  { id: "SP07", ten: "Thuyền", loai: "SachVanHoc", ton: 4 },
  { id: "SP08", ten: "Nhà Giả Kim", loai: "SachVanHoc", ton: 2 },
  { id: "SP09", ten: "Toán Lớp 7", loai: "SachGiaoKhoa", ton: 0 },
  { id: "SP10", ten: "Ngữ Văn Lớp 11", loai: "SachGiaoKhoa", ton: 1 },
  { id: "SP11", ten: "Tiếng Anh Lớp 12", loai: "SachGiaoKhoa", ton: 6 },
  { id: "SP12", ten: "Vật Lí Lớp 8", loai: "SachGiaoKhoa", ton: 3 },
]


const btnDonHang = document.getElementById("btnDonHang");
const btnTonKho = document.getElementById("btnTonKho");
const quanLyDonHang = document.getElementById("quanLyDonHang");
const quanLyTonKho = document.getElementById("quanLyTonKho");

btnDonHang.addEventListener("click", () => {
  quanLyDonHang.classList.add("active");
  quanLyTonKho.classList.remove("active");
});

btnTonKho.addEventListener("click", () => {
  quanLyTonKho.classList.add("active");
  quanLyDonHang.classList.remove("active");
});

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

const tbodyTonKho = document.querySelector("#tableTonKho tbody");
const btnTraCuuTon = document.getElementById("btnTraCuuTon");
const loaiSanPhamFilter = document.getElementById("loaiSanPhamFilter");

function hienThiTonKho(list) {
  tbodyTonKho.innerHTML = "";
  list.forEach(sp => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${sp.id}</td>
      <td>${sp.ten}</td>
      <td>${sp.loai}</td>
      <td>${sp.ton}</td>
      <td class="${sp.ton <= 3 ? "canhbao" : ""}">
        ${sp.ton <= 3 && sp.ton > 0 ? "Sắp hết hàng!" : ""}
        ${sp.ton == 0 ? "Hết hàng!" : ""}
      </td>
    `;
    tbodyTonKho.appendChild(tr);
  });
}
hienThiTonKho(sanPhams);

btnTraCuuTon.addEventListener("click", () => {
  const loai = loaiSanPhamFilter.value;
  const result = sanPhams.filter(sp => !loai || sp.loai === loai);
  hienThiTonKho(result);
});

const btnXemBaoCao = document.getElementById("btnXemBaoCao");
const ketQuaBaoCao = document.getElementById("ketQuaBaoCao");

btnXemBaoCao.addEventListener("click", () => {
  const from = document.getElementById("fromNhapXuat").value;
  const to = document.getElementById("toNhapXuat").value;

  ketQuaBaoCao.innerHTML = `
    <p>Báo cáo từ ${from || "..."} đến ${to || "..."}:</p>
    <ul>
      <li>Tổng số sản phẩm nhập: 120</li>
      <li>Tổng số sản phẩm xuất: 95</li>
      <li>Tồn cuối kỳ: 25</li>
    </ul>
  `;
});
