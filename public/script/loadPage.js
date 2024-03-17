"user strict"

let divHeader = null;
let divContent = null;
let divFooter = null;

document.addEventListener("DOMContentLoaded", loadPage);

function loadPage() {
    divContent = document.getElementById("divContent");
    const token = localStorage.getItem("token");
    if (token) {
        homePage();
    } else {
        login();
    };
};

