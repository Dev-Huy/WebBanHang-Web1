
input.addEventListener('keydown', (e) => { //xuly tim kiem
    if (e.key === "Enter") {
        e.preventDefault();
        alert("Đã tìm kiếm!");
    }
});
const menuBtnElement = document.getElementById("menu_btn");
menuBtnElement.addEventListener("click", () => {
    document.querySelector("#menu ul").style.display = `block`;
});
let product = [];
const shopBtn = document.querySelector("#shop > button");

const overlay = document.getElementById("overlayer");



window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get("user");
    if (!action) {
        return;
    }
    document.querySelector("#header_nav ul li:first-child").style.display = "none";
    document.querySelector("#header_nav ul li:last-child").textContent = `${action}`;
})


document.querySelector("#filter-btn").addEventListener("click", () => {
    document.querySelector("#filter-form").classList.toggle("active");
})

const userELement = () => {
    userELement = sessionStorage.getItem("currentUser");
    if (!userELement) {
        return;
    }
    document.querySelector("#header_nav ul li:first-child").style.display = "none";
    document.querySelector("#header_nav ul li:last-child").textContent = `${userELement}`;
}

