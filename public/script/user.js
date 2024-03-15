
async function loginUser(evt) {
    evt.preventDefault();

    const email = document.getElementById("loginMail").value;
    const pswHash = document.getElementById("loginPassword").value;

    const response = await postTo("/user/login", { email, pswHash });

    if (response.ok) {
        const data = await response.json();
        console.log(data)
        localStorage.setItem("token", data.token);
        homePage();
    } else {
        const error = await response.json();
        console.error(error.message);
    }
};

// ------------------------------

function logoutUser() {
    localStorage.removeItem("token");
    loginPage();
};

// ------------------------------

async function createUser() {
    loadTemplate("tpNewUser", divContent, true);
    const createUserButton = document.getElementById("createUserButton");

    createUserButton.addEventListener("click", async function (evt) {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const pswHash = document.getElementById("pswHash").value;

        const user = { name, email, pswHash };

        const response = await postTo("/user/register", user);
        loginUser();
    });
};

// ------------------------------

async function editUser() {
    loadTemplate("tpEditUser", divContent, true);

    const token = localStorage.getItem("token");

    const userName = document.getElementById("editName");
    const userEmail = document.getElementById("editEmail");

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


    const btnSave = document.getElementById("btnSave")
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
            console.log(result);
            userPage();
        } else {
            console.error("Failed to update user information");
        }
    })

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
}


// ------------------------------

async function postTo(url, data) {
    const header = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    console.log(header.body);

    const response = await fetch(url, header);
    return response;
}

// ------------------------------