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
                <td>${u.created.toLocaleDateString("vi-VN")}</td>
                <td><span class='status ${u.status}'>${u.status}</span></td>
                <td>
                    <button class="toggleUser" id='${u.id}'>${u.status === 'locked' ? 'Mở' : 'Khóa'}</button>
                </td>
            </tr>`)
    });
}


function toggleUser(id) {
    const u = users.find(x => x.id === id);
    u.status = u.status === 'locked' ? 'active' : 'locked';
    renderUsers(users);
}


document.querySelector('#users-table tbody').addEventListener("click", (e) => {
    if (e.target.classList.contains("toggleUser")) {
        const id = Number(e.target.id);
        toggleUser(id);
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