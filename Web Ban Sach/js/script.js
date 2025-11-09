import { productList, categoryList } from "./loadData.js";
import { onAdd, onBuy, renderFilteredProducts, renderCategory, renderProduct, openPopup, attachBuyHandlers, css } from "./render.js";

const menuBtnElement = document.getElementById("menu_btn");
menuBtnElement.addEventListener("click", () => {
  document.querySelector("#menu ul").style.display = `block`;
});
let product = [];
const shopBtn = document.querySelector("#shop > button");

const overlay = document.getElementById("overlayer");



window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  if (user) {
    const accountElement = document.querySelector("#header_nav ul li:last-child a");
    document.querySelector("#header_nav ul li:first-child").style.display = "none";
    accountElement.textContent = `${user.username}`;
    document.querySelector("#nameinfo").textContent = `${user.name}`;
    document.querySelector("#emailinfo").textContent = `${user.email}`;
    document.querySelector("#phoneinfo").textContent = `${user.phone}`;
    document.querySelector("#addressinfo").textContent = `${user.address}`;

    accountElement.style.fontWeight = "600";
    accountElement.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("user-info").classList.toggle("active");
    });
  }
})
document.getElementById("logout-btn").addEventListener("click", () => {
  sessionStorage.removeItem("currentUser");
  window.location.reload();
})

document.querySelector("#filter-btn").addEventListener("click", (e) => {
  e.target.classList.toggle("active");
})

document.getElementById("filter-btn").addEventListener("click", (e) => {
  document.getElementById("filter-form").classList.toggle("active");
})


const editBtn = document.querySelector("#edit-btn");
editBtn.addEventListener("click", (e) => {
  location.href = "dangnhap.html?action=edit";
})

const editPassBtn = document.querySelector("#toEdit-btn2");
editPassBtn.addEventListener("click", (e) => {
  location.href = "dangnhap.html?action=editpassword";
})

document.addEventListener("DOMContentLoaded", () => {

  const priceSelect = document.querySelector("#filter-form select");
  const minInput = document.getElementById("minRange");
  const maxInput = document.getElementById("maxRange");
  priceSelect.addEventListener("change", () => {
    let sorted = [...productList];
    if (priceSelect.value === "Thấp đến cao") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (priceSelect.value === "Cao đến thấp") {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      return;
    }
    renderFilteredProducts(sorted);
  });

  [minInput, maxInput].forEach(input => {
    input.addEventListener("change", () => {
      const min = parseInt(minInput.value) || 0;
      const max = parseInt(maxInput.value) || Infinity;
      const filtered = productList.filter(p => p.price >= min && p.price <= max);
      renderFilteredProducts(filtered);
    });
  });
});



document.addEventListener("DOMContentLoaded", () => {
  renderCategory();
  renderProduct();
  attachBuyHandlers(onAdd, onBuy);
  css();
})