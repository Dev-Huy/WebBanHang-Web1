import {productList, ready} from "./loadData.js";
let sanPhams = [];
ready.then(()=>{
    sanPhams = productList;
    hienThiTonKho(sanPhams);
})

const tbodyTonKho = document.querySelector("#tableTonKho tbody");
const btnTraCuuTon = document.getElementById("btnTraCuuTon");
const loaiSanPhamFilter = document.getElementById("loaiSanPhamFilter");

function hienThiTonKho(list) {
  tbodyTonKho.innerHTML = "";
  list.forEach(sp => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${sp.id}</td>
      <td>${sp.name}</td>
      <td>${sp.category}</td>
      <td>${sp.amount}</td>
      <td class="${sp.amount <= 3 ? "canhbao" : ""}">
        ${sp.amount <= 3 && sp.amount > 0 ? "Sắp hết hàng!" : ""}
        ${sp.amount === 0 ? "Hết hàng!" : ""}
      </td>
    `;
    tbodyTonKho.appendChild(tr);
  });
}


btnTraCuuTon.addEventListener("click", () => {
  const loai = loaiSanPhamFilter.value;
  const result = sanPhams.filter(sp => !loai || sp.category === loai);
  hienThiTonKho(result);
});
