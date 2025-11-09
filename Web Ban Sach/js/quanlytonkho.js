import { productList, categoryList, ready } from "./loadData.js";
let sanPhams = [];
ready.then(() => {
  sanPhams = productList;
  hienThiTonKho(sanPhams);
  renderCategoryFilter();
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
      <td>${sp.title}</td>
      <td>${categoryList.find(i => (i.id === sp.category)).name}</td>
      <td>${sp.amount}</td>
      <td class="${sp.amount <= 3 ? "canhbao" : ""}">
        ${sp.amount <= 3 && sp.amount > 0 ? "Sắp hết hàng!" : ""}
        ${sp.amount === 0 ? "Hết hàng!" : ""}
      </td>
    `;
    tbodyTonKho.appendChild(tr);
  });
}


function renderCategoryFilter() {
  let text = ``;
  categoryList.forEach(i => {
    text += `<option value="${i.id}">${i.name}</option>`
  })
  document.getElementById("loaiSanPhamFilter").innerHTML = text; 
}

btnTraCuuTon.addEventListener("click", () => {
  const loai = loaiSanPhamFilter.value;
  const result = sanPhams.filter(sp => !loai || sp.category === loai);
  hienThiTonKho(result);
});
