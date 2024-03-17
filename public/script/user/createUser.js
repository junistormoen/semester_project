
async function createUser() {
    loadTemplate("tpNewUser", divContent, true);
    const createUserButton = document.getElementById("createUserButton");

    createUserButton.addEventListener("click", async function (evt) {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const user = { name, email, password };

        try {
            const response = await fetch("/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                login();
            } else {
                throw new Error("Denne brukeren finnes allerede");
            }
        } catch (error) {
            alert(error);
        }
    });
};