const input = document.getElementById("search");
const submitBtnElement = document.getElementById("submit_btn");
submitBtnElement.addEventListener("click", () => {
    alert("Đã bấm search!");
});
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
const scrollBtnElement = document.getElementById("scroll_top")
scrollBtnElement.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
})



