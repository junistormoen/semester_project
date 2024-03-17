
async function loadRecipe() {
    loadTemplate("tpLoadRecipe", divContent, true);

    const btnHome = document.getElementById("btnHome");
    const btnEdit = document.getElementById("btnEdit");

    const nameContainer = document.getElementById("nameContainer");
    const ingredientContainer = document.getElementById("ingredientContainer");
    const descriptionContainer = document.getElementById("descriptionContainer");

    const token = localStorage.getItem("token");
    const recipeId = localStorage.getItem("recipeId");
    const response = await fetch("/user/recipe", {
        method: "GET",
        headers: {
            "authorization": token,
            "recipeId": recipeId
        }
    });

    if (response.ok) {
        const recipeData = await response.json();

        if (recipeData.length > 0) {
            const recipe = recipeData[0];

            const recipeName = document.createElement("h2");
            recipeName.innerHTML = recipe.name;
            nameContainer.appendChild(recipeName);

            //

            const ingredients = JSON.parse(recipe.ingredients);
            for (let key in ingredients) {
                const ingredient = document.createElement("p");

                ingredient.innerHTML = ingredients[key].quantity + ingredients[key].value + " " + ingredients[key].type;

                ingredientContainer.appendChild(ingredient)
            };

            //

            const descriptions = JSON.parse(recipe.description);
            for (let key in descriptions) {
                const description = document.createElement("p");

                description.innerHTML = key + ". " + descriptions[key].info;

                descriptionContainer.appendChild(description)
            };

            //

            btnEdit.addEventListener("click", function () {
                editRecipe(recipe)
            });
        } else {
            console.error("No recipe data found");
        }
    } else {
        console.error("Failed to fetch recipe");
    }

    btnHome.addEventListener("click", homePage);
};




