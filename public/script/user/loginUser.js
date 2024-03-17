
async function login() {
    loadTemplate("tpLoginPage", divContent, true)

    const btnSignIn = document.getElementById("btnSignIn");
    const btnNewUser = document.getElementById("btnNewUser");

    btnNewUser.addEventListener("click", createUser);

    btnSignIn.addEventListener("click", async function () {
        const email = document.getElementById("loginMail").value;
        const password = document.getElementById("loginPassword").value;

        const user = { email, password };

        try {
        const response = await fetch("/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            homePage();
        } else {
            const error = await response.json();
            console.error(error.message);
            throw new Error("Feil brukernavn eller passord")
        }
    } catch (error){
        alert(error)
    }
    });
};


