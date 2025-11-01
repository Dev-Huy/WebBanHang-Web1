const app = document.getElementById('admin-app');
const modalRoot = document.getElementById('modal-root'),
    modalTitle = document.getElementById('modal-title'),
    modalBody = document.getElementById('modal-body'),
    modalOk = document.getElementById('modal-ok'),
    modalCancel = document.getElementById('modal-cancel');

let users = [{
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'a.nguyen@example.com',
    phone: '0912345678',
    created: '2024-07-10',
    status: 'active'
},
{
    id: 2,
    name: 'Trần Thị B', 
    email: 'b.tran@example.com', 
    phone: '0987654321', 
    created: '2024-08-01', 
    status: 'locked'
}];
function renderUsers() { 
    const tbody = document.querySelector('#users-table tbody'); 
    tbody.innerHTML = ''; 
    users.forEach(u => { 
        tbody.insertAdjacentHTML('beforeend', 
            `<tr>
                <td>${u.id}</td>
                <td>
                    <strong>${u.name}</strong><br>
                    <small>${u.email}</small>
                </td>
                <td>${u.phone}</td>
                <td>${u.created}</td>
                <td><span class='status ${u.status}'>${u.status}</span></td>
                <td>
                    <button onclick='resetPw(${u.id})'>Reset</button>
                    <button onclick='toggleUser(${u.id})'>${u.status === 'locked' ? 'Mở' : 'Khóa'}</button>
                </td>
            </tr>`) 
    });
}
renderUsers(users);
function resetPw(id) { 
    const u = users.find(x => x.id === id); 
    if (confirm('Đặt lại mật khẩu cho ' + u.email + '?')) {
        alert('Mật khẩu mới: ' + Math.random().toString(36).slice(2, 10)); 
    }   
}
function toggleUser(id) { 
    const u = users.find(x => x.id === id); 
    u.status = u.status === 'locked' ? 'active' : 'locked'; 
    renderUsers(); }