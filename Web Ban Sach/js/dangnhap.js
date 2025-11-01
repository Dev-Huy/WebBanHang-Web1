const key = "account";
import { loadData } from "./loadData";

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
console.log(await hashPassword("test311025"));
let account = [];
async function loadAccount() {
    const data = await loadData('./json/account.json', key);
    for (const i of data) {
        const object = {
            username: i.username,
            password: i.password
        }
        account.push(object);
    }
}
await loadAccount();
function pushData() {
    localStorage.setItem(key, JSON.stringify(account));
}


function SignUp() {

}

function SignIn() {
    document.getElementById("signinForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const usernameElement = document.getElementById("username");
        const passwordElement = document.getElementById("password");
        const passwordInput = await hashPassword(passwordElement.value.trim());
        const object = account.find(i => (i.username === usernameElement.value.trim() && i.password === passwordInput));
        if (!object) {
            console.log("Tài khoản không tồn tại!");
            return;
        }
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

    } else if (action == "signup") {
        signupDiv.classList.add("active");

        // Signup submit
        document.getElementById("signupForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const usernameElement = document.getElementById("username-signup");
            const passwordElement = document.getElementById("password-signup");
            const passwordAgainElement = document.getElementById("passwordAgain-signup");
            // const 
        });
    } else {
        document.body.textContent = `Không được phép!`;
        
        document.body.style.textAlign = `center`;
        document.body.style.color = `red`;
        document.body.style.fontSize = `30px`;
        document.body.style.fontWeight = '600';
    }
});


