
async function homePage() {
    loadTemplate("tpHomePage", divContent, true);

    const btnUser = document.getElementById("btnUser");
    const btnAddRsp = document.getElementById("btnAddRsp");

    let recepiesContainer = document.getElementById("recipesContainer");

    const token = localStorage.getItem("token");
    const response = await fetch("/user/recipes", {
        method: "GET",
        headers: {
            "authorization": token
        }
    });

    if (response.ok) {
        const recipeData = await response.json();

        for (let data of recipeData) {
            const recipeName = document.createElement("p")
            recipeName.innerHTML = data.name;
            recepiesContainer.appendChild(recipeName);

            recipeName.addEventListener("click", function () {
                localStorage.setItem("recipeId", data.recipeid);
                loadRecipe(false);;
            });
        }
    } else {
        console.error("Failed to recepies");
    };

    if (!recepiesContainer.innerHTML) {
        recepiesContainer.innerHTML = "Du har ingen oppskrifter";
    };

    btnAddRsp.addEventListener("click", addRecipe);
    btnUser.addEventListener("click", userPage);
};