

async function editRecipe(recipe) {
    loadTemplate("tpEditRecipe", divContent, true);

    const btnHome = document.getElementById("btnHome");
    const btnDelete = document.getElementById("btnDelete");
    const btnAddIngredient = document.getElementById("addIngredient");
    const btnAddDescription = document.getElementById("addDescription");
    const btnSave = document.getElementById("btnSave");

    const nameContainer = document.getElementById("nameContainer");
    const ingredientContainer = document.getElementById("ingredientContainer");
    const descriptionContainer = document.getElementById("descriptionContainer");

    let ingredientLenght = 1;
    let descriptionLengt = 1;

    console.log(recipe)

    const recipeName = document.createElement("input");
    recipeName.value = recipe.name;
    nameContainer.appendChild(recipeName);

    const ingredients = JSON.parse(recipe.ingredients);
    console.log(ingredients)
    for (let key in ingredients) {
        const ingredient = document.createElement("p");
        const btnDeleteIngredient = document.createElement("button");

        ingredient.innerHTML = ingredients[key].quantity + ingredients[key].value + " " + ingredients[key].type;
        btnDeleteIngredient.innerHTML = "-";

        ingredientContainer.appendChild(ingredient)
        ingredientContainer.appendChild(btnDeleteIngredient);

        btnDeleteIngredient.addEventListener("click", function () {
            delete ingredients[key];
            recipe.ingredients = JSON.stringify(ingredients);
            editRecipe(recipe);
        })

        ingredientLenght++;
    }

    btnAddIngredient.addEventListener("click", function () {
        const quant = document.getElementById("quant").value;
        const val = document.getElementById("val").value;
        const type = document.getElementById("type").value;

        ingredient = { quantity: quant, value: val, type: type };
        ingredients[ingredientLenght] = ingredient;
        console.log(ingredients)

        recipe.ingredients = JSON.stringify(ingredients);
        editRecipe(recipe);
    });


    const descriptions = JSON.parse(recipe.description);
    console.log(descriptions)
    for (let key in descriptions) {
        const description = document.createElement("p");
        const btnDeleteDescription = document.createElement("button");

        description.innerHTML = descriptions[key].info;
        btnDeleteDescription.innerHTML = "-";

        descriptionContainer.appendChild(description)
        descriptionContainer.appendChild(btnDeleteDescription);

        btnDeleteDescription.addEventListener("click", function () {
            delete descriptions[key];
            recipe.description = JSON.stringify(descriptions);
            editRecipe(recipe);
        })

        descriptionLengt++;
    }


    btnAddDescription.addEventListener("click", function () {
        const text = document.getElementById("newDescription").value;

        description = { info: text };
        descriptions[descriptionLengt] = description;

        recipe.description = JSON.stringify(descriptions);
        editRecipe(recipe);
    })

    btnSave.addEventListener("click", function () {
        const newName = recipeName.value
        recipe.name = newName
        updateRecipe(recipe)
    })

    btnHome.addEventListener("click", homePage)
    btnDelete.addEventListener("click", deleteRecipe);
};


async function updateRecipe(recipe) {
    const token = localStorage.getItem("token");
    const recipeId = localStorage.getItem("recipeId");

    const response = await fetch("/user/recipe/", {
        method: "PUT",
        headers: {
            "authorization": token,
            "recipeid": recipeId,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(recipe)
    });

    if (response.ok) {
        const result = await response.json();
        console.log(result);
        loadRecipe();
    } else {
        console.error("Failed to update user information", response.statusText);
    }

}



async function deleteRecipe() {
    const token = localStorage.getItem("token");
    const recipeId = localStorage.getItem("recipeId");

    const response = await fetch("/user/recipe/", {
        method: "DELETE",
        headers: {
            "authorization": token,
            "recipeid": recipeId
        }
    });

    if (response.ok) {
        const result = await response.json();
        console.log(result);
        localStorage.removeItem("recipeId");
        homePage();
    } else {
        console.error("Failed to delete recipe", response.statusText);
    }

}
