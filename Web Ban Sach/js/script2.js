import { loadData } from "./loadData";
const ADMIN_EMAIL = 'bao123', ADMIN_PASSWORD = 'bao456';



const loginScreen = document.getElementById('login-screen'),
    app = document.getElementById('admin-app'),
    loginBtn = document.getElementById('login-btn'),
    loginError = document.getElementById('login-error');
const modalRoot = document.getElementById('modal-root'),
    modalTitle = document.getElementById('modal-title'),
    modalBody = document.getElementById('modal-body'),
    modalOk = document.getElementById('modal-ok'),
    modalCancel = document.getElementById('modal-cancel');



let users = [];

const loadUsers = () => {
    const data = loadData('account.json');
    for (i of data) {
        const object = {...i};
        data.push()
    }
}

function pushData() {
    
}

function showApp() { 
    loginScreen.style.display = 'none'; 
    app.style.display = 'grid'; 
    document.getElementById('admin-email-display').textContent = ADMIN_EMAIL; 
    renderUsers(); }
loginBtn.onclick = () => { 
    const email = document.getElementById('admin-email').value.trim(), 
    pwd = document.getElementById('admin-password').value; 
    if (email === ADMIN_EMAIL && pwd === ADMIN_PASSWORD) showApp(); 
    else loginError.style.display = 'block'; 
};
function renderUsers() { 
    const tbody = document.querySelector('#users-table tbody'); 
    tbody.innerHTML = ''; 
    users.forEach(u => { 
        tbody.insertAdjacentHTML('beforeend', `<tr><td>${u.id}</td><td><strong>${u.name}</strong><br><small>${u.email}</small></td><td>${u.phone}</td><td>${u.created}</td><td><span class='status ${u.status}'>${u.status}</span></td><td><button onclick='resetPw(${u.id})'>Reset</button><button onclick='toggleUser(${u.id})'>${u.status === 'locked' ? 'Mở' : 'Khóa'}</button></td></tr>`) 
    });
}
function resetPw(id) { 
    const u = users.find(x => x.id === id); 
    if (confirm('Đặt lại mật khẩu cho ' + u.email + '?')) 
        alert('Mật khẩu mới: ' + Math.random().toString(36).slice(2, 10)); 
}

function toggleUser(id) { 
    const u = users.find(x => x.id === id); 
    u.status = u.status === 'locked' ? 'active' : 'locked'; 
    renderUsers(); 
}
renderUsers();
