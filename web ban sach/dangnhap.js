async function hashPassword(password) {
    // Chuyển string thành Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Dùng crypto.subtle để hash SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Chuyển ArrayBuffer sang hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

let account = [];
async function loadAccount() {
    const res = await fetch('account.json');
    const data = await res.json();
    for (const i of data) {
        const object = {
            username: i.username,
            password: i.password,
            accessMode: i.accessMode
        }
        account.push(object);
    }
}

loadAccount();
const usernameElement = document.getElementById("username");
const passwordElement = document.getElementById("password");
document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    // await 
    e.preventDefault();
    const passwordInput = await hashPassword(passwordElement.value.trim());
    const object = account.find(i => (i.username === usernameElement.value.trim() && i.password === passwordInput));
    if (!object) {
        console.log("Khoong lay ra duoc tai khoan!");
        return;
    }
    if (object.accessMode === "admin") {
        location.href = "admin.html";
    }
    else {
        location.href = "index.html";
    }
    localStorage.setItem("currentUser",object.username);
});