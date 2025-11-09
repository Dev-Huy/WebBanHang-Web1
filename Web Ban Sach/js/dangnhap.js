import { account, hashPassword } from "./loadData.js";
import { editProfile, editPassword } from "./suathongtin.js";

function SignUp() {
    document.getElementById("signupForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const usernameElement = document.getElementById("username-signup").value.trim();
        const passwordElement = await hashPassword(document.getElementById("password-signup").value.trim());
        const passwordAgainElement = await hashPassword(document.getElementById("passwordAgain-signup").value.trim());
        const nameElement = document.getElementById("name").value.trim();
        const addressElement = document.getElementById("address-signup").value.trim();
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
        let count = 0;
        const usernameElement = document.getElementById("username").value.trim();
        const passwordElement = await hashPassword(document.getElementById("password").value.trim());
        const object = await account.find(i => (i.username === usernameElement));
        if (!object) {
            alert("Tài khoản không tồn tại!");
            return;
        } else if (object.status == "locked") {
            alert("Tài khoản đã bị khóa!");
            return;
        } else if (object.password !== passwordElement ) {
            alert("Mật khẩu không chính xác!");
            if (count === 5) {
                alert("Quên mật khẩu ?");
            }
            count = count===5? 0: count++;
            return;
        }
        window.location.href = "index.html";
        sessionStorage.setItem("currentUser", JSON.stringify(object));
    });
}


// account.js
window.addEventListener("DOMContentLoaded", () => {
    const signinDiv = document.getElementById("signin");
    const signupDiv = document.getElementById("signup");
    const popup = document.querySelector("#editPopup");
    const editPasswordBtn = document.querySelector("#editPassword");

    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get("action"); // ?action=signup hoặc signin

    if (action === "signin") {
        signinDiv.classList.add("active");
        // Login submit
        document.querySelector("#toEdit-btn1").addEventListener("click", () => {
            location.href = "dangnhap.html?action=editpassword";
        });
        SignIn();

    } else if (action === "signup") {
        signupDiv.classList.add("active");
        // Signup submit
        SignUp();
    }
    else if (action === "edit") {
        // Ẩn phần main, hiển popup
        popup.classList.add("active");
        editProfile();
    }
    else if (action === "editpassword") {
        editPasswordBtn.classList.add("active");
        editPassword();
    }
});


