import { account, ready } from "./loadData.js";

let users = [];
ready.then(() => {
    users = account;
    renderUsers(users);
})

function renderUsers(users) {
    const tbody = document.querySelector('#users-table tbody');
    tbody.innerHTML = '';
    users.forEach(u => {
        tbody.insertAdjacentHTML('beforeend',
            `<tr>
                <td>${u.id}</td>
                <td>
                    <strong>${u.name}</strong><br>
                    <small>${u.username}</small>
                </td>
                <td>${u.email}</td>
                <td>${u.phone}</td>
                <td><small>${u.address}</small></td>
                <td>${u.created.toLocaleDateString("vi-VN")}</td>
                <td><span class='status ${u.status}'>${u.status}</span></td>
                <td>
                    <div style="display: flex; justify-content:center; aligh-items: center; gap: 5px;">                    
                        <button class="toggleUser" id='${u.id}'>${u.status === 'locked' ? 'Mở' : 'Khóa'}</button>
                        <button class="deleteUser" id='${u.id}' style="margin-top: 5px;">Xóa</button>
                    </div>
                </td>
            </tr>
            `)
    });
}


function toggleUser(id) {
    const u = users.find(x => x.id === id);
    u.status = u.status === 'locked' ? 'active' : 'locked';
    renderUsers(users);
}

function deleteUser(id) {
    users = users.filter(u => u.id !== id);
    renderUsers(users);
}

document.querySelector('#users-table tbody').addEventListener("click", (e) => {
    if (e.target.classList.contains("toggleUser")) {
        const id = Number(e.target.id);
        toggleUser(id);
        localStorage.setItem("accounts", JSON.stringify(users));
    }
    else if (e.target.classList.contains("deleteUser")) {
        const id = Number(e.target.id);
        deleteUser(id);
        localStorage.setItem("accounts", JSON.stringify(users));
    }
});

function search(input) {
    const kqEmail = users.filter(i => (input.trim() === i.email));
    const kqName = users.filter(i => (i.name.toUpperCase().includes(input.trim().toUpperCase())));
    const kqUsername = users.filter(i => (input.trim() === i.username));
    if (kqEmail.length > 0) {
        renderUsers(kqEmail);
    }
    else if (kqName.length > 0) {
        renderUsers(kqName);
    }
    else if (kqUsername.length > 0) {
        renderUsers(kqUsername);
    } else {
        renderUsers(users);
    }
}

document.querySelector("#qly-taikhoan #search").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        search(e.target.value);
    }
})