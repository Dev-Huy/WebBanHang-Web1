

const menuBtnElement = document.getElementById("menu_btn");
menuBtnElement.addEventListener("click", () => {
    document.querySelector("#menu ul").style.display = `block`;
});
let product = [];
const shopBtn = document.querySelector("#shop > button");

const overlay = document.getElementById("overlayer");



window.addEventListener("DOMContentLoaded", () => {
    const username = sessionStorage.getItem("currentUser");
    if (username) {
        const accountElement = document.querySelector("#header_nav ul li:last-child a");
        document.querySelector("#header_nav ul li:first-child").style.display = "none";
        accountElement.textContent = `${username}`;
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
