import { order, ready, productList, account } from "./loadData.js";

let donHangs = [];
ready.then(() => {
  donHangs = order;
  hienThiDonHang(donHangs);
})

const tbodyDonHang = document.querySelector("#tableDonHang tbody");
const btnTimDonHang = document.getElementById("btnTimDonHang");
const statusFilter = document.getElementById("statusFilter");

function hienThiDonHang(list) {
  tbodyDonHang.innerHTML = "";
  list.forEach(dh => {
    const tr = document.createElement("tr");
    const object = account.find(i => (i.username === dh.username));
    tr.innerHTML = `
      <td>${dh.id}</td>
      <td>${object.name}</td>
      <td>${dh.ngay.toLocaleDateString()}</td>
      <td>${dh.tong.toLocaleString()} đ</td>
      <td>${trangThaiHienThi(dh.trangthai)}</td>
      <td><button class="xemChiTiet" id="${dh.id}">Xem</button></td>
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
  const object = account.find(i => (i.username === dh.username));
  let text =
    `<p><b>Khách hàng:</b> ${object.name}</p>
    <p><b>Ngày đặt:</b> ${dh.ngay.toLocaleDateString("vi-VN")}</p>
    <p> </p>
    <p><b>Tổng tiền:</b> ${dh.tong.toLocaleString()} đ</p>`;
  chiTietNoiDung.innerHTML = text;
  let textTable = `Sản phẩm: `;
  dh.chitiet.forEach( (i, index) => {
    const product = productList.find(h => (h.id === i.id));
    if (index === dh.chitiet.length - 1) {
      textTable += `${product.name} (${i.soluong})`;
    }
    else {
      textTable += `${product.name} (${i.soluong}), `;
    }
  })
  document.querySelector("#chiTietNoiDung p:nth-child(3)").textContent = textTable;
  capNhatTrangThai.value = dh.trangthai;
  modal.classList.remove("hidden");

  btnCapNhatTrangThai.onclick = () => {
    dh.trangthai = capNhatTrangThai.value;
    alert("Cập nhật thành công!");
    modal.classList.add("hidden");
    hienThiDonHang(donHangs);
  };
  localStorage.setItem("orders", JSON.stringify(donHangs));
}
tbodyDonHang.addEventListener("click", (e)=> {
  if (e.target.className === "xemChiTiet") {
    xemChiTiet(Number(e.target.id));
  }
})
document.querySelector(".close").addEventListener("click", () => {
  modal.classList.add("hidden");
});
