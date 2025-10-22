const sideBarBtnAll = document.querySelectorAll("#side_bar_btn a");
sideBarBtnAll.forEach(sideBarBtnA => sideBarBtnA.addEventListener("click", () => {
    sideBarBtnA.classList.toggle("active")
}))