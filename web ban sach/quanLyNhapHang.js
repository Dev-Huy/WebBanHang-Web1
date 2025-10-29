

let phieuNhapList = [];
let productList = [];
let productListInput = [];

async function loadProductList() {
    const res = await fetch('SanPham.json');
    const data = await res.json();
    for (const i of data) {
            const object = {
            id: i.id,
            name: i.name,
        };
        productList.push(object); 
    }
}

loadProductList();

async function loadData() {
    const res = await fetch('phieuNhap.json');
    const data = await res.json();
    for (const i of data) {
        const object = {
            id: i.id,
            date: new Date(i.date),
            totalCost: i.totalCost,
            state: i.state,
            productlist: [...i.productlist]
        };
        phieuNhapList.push(object);
    }
    renderTable(phieuNhapList);
}

loadData();


const parentBtn = document.getElementById("phieuNhap");
let returnList = [];



const inputElement = document.getElementById("input");
const locPhieuEl = document.getElementById("locPhieu");
if (locPhieuEl) {
    locPhieuEl.addEventListener("change", () => {
        locPhieuElement();
    });
}


function renderTable(returnList) {
    const renderTableHTML = document.querySelector("#phieuNhapTable table tbody");
    if (!renderTableHTML) return; // guard: if table isn't in DOM don't try to render
    let tablePN = ``;
    returnList.forEach((i, index) => {
        tablePN += `<tr>
                        <td>${index + 1}</td>
                        <td><button id="${i.id}">${i.id}</button></td>
                        <td>${i.date.toLocaleDateString("vi-VN")}</td>
                        <td>${i.state}</td>
                        <td>${i.totalCost}</td>
                    </tr>`
    })
    tablePN += ``
    renderTableHTML.innerHTML = tablePN;
    visibleControl(document.querySelector("#phieuNhapTable"));
}


function locPhieuElement() {
    const input = document.getElementById("locPhieu").value;
    let searchValue = "";
    if (input === "trangThai") {
        inputElement.innerHTML =
            `<select id="timKiemBangTrangThai">
            <option value="Chưa Hoàn Thành">Chưa Hoàn Thành</option>
            <option value="Đã Hoàn Thành">Đã Hoàn Thành</option>
            <option value="" selected>Chọn trạng thái</option>
        </select>`
        const valueTimKiemBangTrangThai = document.getElementById("timKiemBangTrangThai");
        valueTimKiemBangTrangThai.addEventListener("change", () => {
            searchValue = valueTimKiemBangTrangThai.value;
            returnList = phieuNhapList.filter(i => (i.state === searchValue));
            renderTable(returnList);
        })
    } else if (input === "maPhieuNhap") {
        inputElement.innerHTML = `<input type="text" id="timKiemBangMa" placeholder="Nhập mã phiếu nhập để tìm kiếm...">`
        const valueTimKiemBangMa = document.getElementById("timKiemBangMa");
        valueTimKiemBangMa.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                searchValue = valueTimKiemBangMa.value;
                returnList = phieuNhapList.filter(i => (i.id === searchValue.toUpperCase()));
                renderTable(returnList);
            }
        });
    }
    else {
        renderTable(phieuNhapList);
    }
}


const dateElement = document.querySelectorAll("#fromDate, #toDate");
dateElement.forEach(input => {
    input.addEventListener("change", () => {
        const fromValue = document.getElementById("fromDate").value;
        const toValue = document.getElementById("toDate").value;

        const fromDate = fromValue ? new Date(fromValue) : null;
        const toDate = toValue ? new Date(toValue) : null;

        returnList = phieuNhapList.filter(item => {
            const d = item.date;
            return (!fromDate || d >= fromDate) && (!toDate || d <= toDate);
        });

        renderTable(returnList);
    });
});




function renderDetail(object) {
    let idValue = object.id;
    let tablePN = ``;
    visibleControl(document.querySelector("#phieuNhapDetail"))
    object.productlist.forEach((i, index) => {
        const name = productList.find(h=>(h.id === i.id)).name;
        tablePN += `<tr>
                        <td>${index + 1}</td>
                        <td>${i.id}</td>
                        <td>${name}</td>
                        <td>${i.cost}</td>
                        <td>${i.amount}</td>
                    </tr>`
    });
    const detailTbody = document.querySelector("#phieuNhapDetail table tbody");
    if (detailTbody) detailTbody.innerHTML = tablePN;
    if (object.state === "Chưa Hoàn Thành") {
        const detailBtn = document.querySelector(".detailBtn");
        if (detailBtn) detailBtn.innerHTML = `
                        <button class="continue" id="${idValue}">Thêm sản phẩm</button>    
                        <button class="doneCheck" id="${idValue}">Đánh dấu là đã hoàn thành</button>
                        <button class="cancelDetail" id="${idValue}">Hủy phiếu</button>`;
    }
    else {
        const detailBtn = document.querySelector(".detailBtn");
        if (detailBtn) detailBtn.innerHTML = `<button class="cancelDetail" id="${idValue}">Hủy phiếu</button>`
    }
}



const tbody = document.querySelector("#phieuNhapTable table tbody");
tbody.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        const id = e.target.id;
        const object = phieuNhapList.find(i => i.id === id);
        renderDetail(object);
    }
});


document.getElementById("themBtn").addEventListener("click", (e) => {
    visibleControl(document.querySelector("#nhapPhieuContainer"));
    renderProductListInput(productListInput);
});


document.getElementById("phieuNhapDetail").addEventListener("click", (e) => {
    const backBtn = document.getElementById("backDetail");
    if (e.target === backBtn) {
        renderTable(phieuNhapList);
    }
})

document.getElementById("nhapPhieuContainer").addEventListener("click", (e) => {
    const backBtn = document.querySelector("#sanPhamList #backDetail");
    if (e.target === backBtn) {
        renderTable(phieuNhapList);
    }
})

function visibleControl(e) {
    const eList = [
        document.querySelector("#nhapPhieuContainer"),
        document.querySelector("#phieuNhapDetail"),
        document.querySelector("#phieuNhapTable")
    ];
    eList.forEach(i => {
        if (i !== e) {
            i.classList.remove("active");
        } else {
            i.classList.add("active");
        }
    })
}


function renderProductListInput(list) {
    let tablePN = ``;
    let totalCostInput = 0;
    const tbodyEl = document.querySelector("#sanPhamList table tbody");
    if (!tbodyEl) return;
    list.forEach((i, index) => {
        tablePN += `<tr>
                        <td>${index + 1}</td>
                        <td>${i.id}</td>
                        <td>${i.name}</td>
                        <td>${i.cost}</td>
                        <td>${i.amount}</td>
                        <td><button id="${index + 1}">Xóa</button></td>
                    </tr>`
        totalCostInput += i.cost * i.amount;
    })
    tbodyEl.innerHTML = tablePN;
    const totalCostEl = document.querySelector("#totalCost_input");
    if (totalCostEl) totalCostEl.textContent = totalCostInput;
}

function insertProduct(productlist) {
    const idInput = document.querySelector("#nhapSanPham #id_input").value.toUpperCase();
    const costInput = Number(document.querySelector("#nhapSanPham #cost_input").value);
    const amountInput = Number(document.querySelector("#nhapSanPham #amount_input").value);

    if (!idInput || !costInput || !amountInput) {
        return false;
    }
    const object = productList.find(p => (p.id === idInput));
    if (!object) {
        alert("Sản phẩm không tồn tại!");
        return;
    }
    const newProduct = {
        id: object.id,
        name: object.name,
        cost: costInput,
        amount: amountInput,
    };
    productlist.push(newProduct);
    renderProductListInput(productlist);
}


document.querySelector("#sanPhamList table").addEventListener("click", (e) => {
    document.querySelectorAll("#sanPhamList table tbody button").forEach(i => {
        if (i.id === e.target.id) {
            productListInput = productListInput.filter((f, index) => (index !== Number(i.id) - 1));
        }
    })
    renderProductListInput(productListInput);
})

function insertInput(productListInput, idValue) {
    const idInput = document.querySelector("#nhapPhieu #id_input").value.toUpperCase();
    const dateInput = document.querySelector("#nhapPhieu #date_input").value;
    if (!idInput || dateInput === "") {
        return false;
    }
    if ( phieuNhapList.find(i => (i.id === idInput))) {
        alert("Phiếu đã tồn tại!");
        return;
    }
    let stateInput = idValue === "done_inputBtn" ? "Đã Hoàn Thành" : "Chưa Hoàn Thành";
    let totalCostInput = productListInput.reduce((sum, item) => sum + item.cost * item.amount, 0);
    phieuNhapList.push({
        id: idInput,
        date: new Date(dateInput),
        state: stateInput,
        totalCost: totalCostInput,
        productlist: productListInput
    });
    return true;
}


document.querySelector("#nhapSanPham").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (e.submitter && e.submitter.id === "done_inputProductBtn") {
        await insertProduct(productListInput); // cho insertProduct async nếu đọc file
        document.querySelector("#nhapSanPham").reset();
    }
});



document.querySelector("#nhapPhieu").addEventListener("submit", (e) => {
    e.preventDefault();

    if (e.submitter && ["done_inputBtn", "unDone_inputBtn"].includes(e.submitter.id)) {
        const check = insertInput(productListInput, e.submitter.id);

        if (check) {
            // Dùng requestAnimationFrame để render bảng mà không block UI
            requestAnimationFrame(() => {
                const newItem = phieuNhapList[phieuNhapList.length - 1]; // item mới
                appendTableRow(newItem, phieuNhapList.length - 1);
            });

            // Reset form và dữ liệu
            document.querySelector("#nhapPhieu").reset();
            productListInput = [];
            renderProductListInput(productListInput);
        }
    }
});

// Hàm append row mới vào bảng thay vì render toàn bộ
function appendTableRow(item, index) {
    const tbody = document.querySelector("#phieuNhapTable table tbody");
    if (!tbody) return;

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${index + 1}</td>
        <td><button id="${item.id}">${item.id}</button></td>
        <td>${item.date.toLocaleDateString("vi-VN")}</td>
        <td>${item.state}</td>
        <td>${item.totalCost}</td>
    `;
    tbody.appendChild(tr);
}


function continueInsert(idValue) {
    currentObject = phieuNhapList.find(i => i.id === idValue);

    // Hiển thị modal nhập phiếu
    visibleControl(document.querySelector("#nhapPhieuContainer"));

    // Clone product list để thao tác mà không ảnh hưởng gốc
    productListInput = currentObject.productlist.map(p => ({ ...p }));

    // Render danh sách hiện tại
    renderProductListInput(productListInput);

    // Hiển thị mã phiếu
    document.querySelector("#nhapPhieu #id_input").placeholder = `${currentObject.id}`;

    // Reset input khi mở modal
    document.querySelector("#nhapSanPham #id_input").value = "";
    document.querySelector("#nhapSanPham #cost_input").value = "";
    document.querySelector("#nhapSanPham #amount_input").value = "";
    document.querySelector("#nhapPhieu #done_inputBtn").addEventListener("click", (e) => {
        if (!currentObject) return;

        // Cập nhật danh sách sản phẩm vào phiếu
        currentObject.productlist = [...productListInput];

        renderTable(phieuNhapList);

        // Reset currentObject và input sau khi hoàn thành
        currentObject = null;
        document.querySelector("#nhapSanPham #id_input").value = "";
        document.querySelector("#nhapSanPham #cost_input").value = "";
        document.querySelector("#nhapSanPham #amount_input").value = "";
    });
}





document.querySelector("#phieuNhapDetail").addEventListener("click", (e) => {
    if (e.target.classList.contains("continue")) {
        continueInsert(e.target.id);
    }
    if (e.target.classList.contains("doneCheck")) {
        phieuNhapList.forEach(i => {
            if (i.id === e.target.id) {
                i.state = "Đã Hoàn Thành";
            }
        })
        renderTable(phieuNhapList);
    }
    if (e.target.classList.contains("cancelDetail")) {
        phieuNhapList = phieuNhapList.filter(i => (i.id !== e.target.id));
        renderTable(phieuNhapList);
    }
})



