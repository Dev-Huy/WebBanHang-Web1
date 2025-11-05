import { account, hashPassword } from "./loadData.js";

function SignUp() {
    document.getElementById("signupForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const usernameElement = document.getElementById("username-signup").value.trim();
        const passwordElement = await hashPassword(document.getElementById("password-signup").value.trim());
        const passwordAgainElement = await hashPassword(document.getElementById("passwordAgain-signup").value.trim());
        const nameElement = document.getElementById("name").value.trim();
        const addressElement = documnet.getElementById("address-signup");
        const emailElement = document.getElementById("email-signup").value.trim();
        const phoneElement = document.getElementById("phone-signup").value.trim();
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        const statusElement = "active";
        const check = account.find(i => i.username === usernameElement); // không có 2 tài khoản cùng username
        if (check) {
            alert("Tài khoản đã tồn tại!");
            return;
        }
        if (passwordAgainElement === passwordElement) {
            const object = {
                id: account.length + 1,
                username: usernameElement,
                password: passwordElement,
                name: nameElement,
                address: addressElement,
                email: emailElement,
                status: statusElement,
                created: dateString,
                phone: phoneElement
            };
            account.push(object);
            localStorage.setItem("accounts", JSON.stringify(account));
            window.location.href = "dangnhap.html?action=signin";
        }
        else {
            alert("Mật khẩu được nhập lại không trùng khớp!");
        }
    });
}

function SignIn() {
    document.getElementById("signinForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const usernameElement = document.getElementById("username").value.trim();
        const passwordElement = await hashPassword(document.getElementById("password").value.trim());
        const object = await account.find(i => (i.username === usernameElement && i.password === passwordElement));
        if (!object) {
            alert("Tài khoản không tồn tại!");
            return;
        } else if (object.status == "locked") {
            alert("Tài khoản đã bị khóa!");
            return;
        }
        window.location.href = "index.html";
        sessionStorage.setItem("currentUser", object.username);
    });
}


// account.js
window.addEventListener("DOMContentLoaded", () => {
    const signinDiv = document.getElementById("signin");
    const signupDiv = document.getElementById("signup");

    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get("action"); // ?action=signup hoặc signin

    if (action === "signin") {
        signinDiv.classList.add("active");
        // Login submit
        SignIn();

    } else if (action === "signup") {
        signupDiv.classList.add("active");
        // Signup submit
        SignUp();
    }
});


