
async function userPage() {
    loadTemplate("tpUserPage", divContent, true);

    const btnHome = document.getElementById("btnHome");
    const btnEditUser = document.getElementById("btnEditUser");
    const btnLogOut = document.getElementById("btnLogOut");

    const userInfo = document.getElementById("userInfo");

    const token = localStorage.getItem("token");
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
        localStorage.clear();
        location.reload();
        return;
    }

    btnHome.addEventListener("click", homePage);
    btnEditUser.addEventListener("click", editUser);
    btnLogOut.addEventListener("click", logoutUser);
};