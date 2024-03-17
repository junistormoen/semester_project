
function addRecipe() {
    loadTemplate("tpAddRecipes", divContent, true);

    const btnHome = document.getElementById("btnHome");
    const btnAddIngredient = document.getElementById("addIngredient");
    const btnAddDescription = document.getElementById("addDescription");
    const btnAddRes = document.getElementById("btnAdd");

    const ingredientContainer = document.getElementById("ingredientContainer");
    const descriptionContainer = document.getElementById("descriptionContainer");

    const ingredients = {};
    const descriptions = {};

    let iIndex = 1;
    let dIndex = 1;

    //

    btnAddIngredient.addEventListener("click", function () {
        const quant = document.getElementById("quant").value;
        const val = document.getElementById("val").value;
        const type = document.getElementById("ingredient").value;

        ingredient = { quantity: quant, value: val, type: type };
        ingredients[iIndex] = ingredient;

        const printIngredient = document.createElement("p");
        printIngredient.innerHTML = ingredients[iIndex].quantity + " " + ingredients[iIndex].value + " " + ingredients[iIndex].type;
        ingredientContainer.appendChild(printIngredient);

        iIndex++
        document.getElementById("quant").value = "";
        document.getElementById("ingredient").value = "";
    });

    //

    btnAddDescription.addEventListener("click", function () {
        const text = document.getElementById("description").value;

        description = { info: text };
        descriptions[dIndex] = description;

        const printDescription = document.createElement("p");
        printDescription.innerHTML = dIndex + ". " + descriptions[dIndex].info;
        descriptionContainer.appendChild(printDescription);

        dIndex++;
        document.getElementById("description").value = "";
    });

    //

    btnAddRes.addEventListener("click", async function () {
        const token = localStorage.getItem("token");

        const name = document.getElementById("name").value;
        const recipe = { name, ingredients, descriptions };

        const response = await fetch("/user/recipes", {
            method: "POST",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(recipe)
        });

        if (response.ok) {
            const userData = await response.json();
            homePage();
        } else {
            console.log("Problemer");
        }
    })

    btnHome.addEventListener("click", homePage);
};

