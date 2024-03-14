"user strict"

let divHeader = null;
let divContent = null;
let divFooter = null;

document.addEventListener("DOMContentLoaded", loadPage);

function loadPage() {
    divContent = document.getElementById("divContent");
    const token = localStorage.getItem("token");
    console.log("hei")
    if (token) {
        homePage();
    } else {
        loginPage();
    };
};

// ------------------------------

async function homePage() {
    loadTemplate("tpHomePage", divContent, true);

    const btnUser = document.getElementById("btnUser");
    const btnAddRsp = document.getElementById("btnAddRsp");

    btnUser.addEventListener("click", userPage);

    // Profilknapp  -> Logge ut, slette bruker, tilbake

    // Legge til oppskrift, Liste oppskrift navn, redigere oppskrifter, fjerne oppskrifter
}

// ------------------------------

function loginPage() {
    loadTemplate("tpLoginPage", divContent, true)
    const loginForm = document.getElementById("loginForm");

    const btnSignIn = document.getElementById("btnSignIn");
    const btnNewUser = document.getElementById("btnNewUser");

    btnSignIn.addEventListener("click", loginUser);

    btnNewUser.addEventListener("click", createUser);
};

// ------------------------------

async function userPage() {
    loadTemplate("tpUserPage", divContent, true);

    const userInfo = document.getElementById("userInfo");

    const token = localStorage.getItem("token")
    const response = await fetch("/user/profile", {
        method: "GET",
        headers: {
            "authorization": token
        }
    });

    if (response.ok) {
        const userData = await response.json();
        userInfo.innerHTML = `
            <p>Brukernavn: ${userData.name}</p>
            <p>Epost: ${userData.email}</p>   
        `;
    } else {
        console.error("Failed to fetch user profile");
    };

    const btnLogOut = document.getElementById("btnLogOut");
    const btnEditUser = document.getElementById("btnEditUser");

    btnLogOut.addEventListener("click", logoutUser);
    btnEditUser.addEventListener("click", editUser);
}

// ------------------------------





