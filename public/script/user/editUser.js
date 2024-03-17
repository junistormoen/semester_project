
async function editUser() {
    loadTemplate("tpEditUser", divContent, true);

    const userName = document.getElementById("editName");
    const userEmail = document.getElementById("editEmail");

    const token = localStorage.getItem("token");
    const response = await fetch("/user/profile", {
        method: "GET",
        headers: {
            "authorization": token
        }
    });

    if (response.ok) {
        const userData = await response.json();
        userName.value = userData.name;
        userEmail.value = userData.email;
    } else {
        console.error("Failed to fetch user profile");
    };

    //

    const btnSave = document.getElementById("btnSave");
    btnSave.addEventListener("click", async function () {
        const name = document.getElementById("editName").value;
        const email = document.getElementById("editEmail").value;

        const response = await fetch("/user/profile", {
            method: "PUT",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email })
        });

        if (response.ok) {
            const result = await response.json();
            userPage();
        } else {
            console.error("Failed to update user information");
        }
    })

    //

    const btnDeleteUser = document.getElementById("btnDeleteUser");
    btnDeleteUser.addEventListener("click", deleteUser)
}

// ------------------------------

async function deleteUser() {
    const confirmation = confirm("Er du sikker på at du ønsker å slette brukeren din?")

    if (confirmation) {
        const token = localStorage.getItem("token");
        const userID = localStorage.getItem("ID");
        const response = await fetch("/user/profile", {
            method: "DELETE",
            headers: {
                "authorization": token
            }
        });

        if (response.ok) {
            localStorage.removeItem("token");
            loginPage();
        } else {
            console.error("Failed to delete user");
        }
    }
};

// ------------------------------

function logoutUser() {
    localStorage.removeItem("token");
    login();
};





