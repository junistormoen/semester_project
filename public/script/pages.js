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
        loginPage();
    };
};

// ------------------------------

async function homePage() {
    loadTemplate("tpHomePage", divContent, true);

    const btnUser = document.getElementById("btnUser");
    const btnAddRsp = document.getElementById("btnAddRsp");

    let recepiesContainer = document.getElementById("recipesContainer");

    const token = localStorage.getItem("token")
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
            recepiesContainer.appendChild(recipeName)

            recipeName.addEventListener("click", function () {
                recipePage(data.recipeid)
            })
        }
    } else {
        console.error("Failed to recepies");
    };

    if (!recepiesContainer.innerHTML) {
        recepiesContainer.innerHTML = "Du har ingen oppskrifter"
    };

    btnAddRsp.addEventListener("click", addRecipe)
    btnUser.addEventListener("click", userPage);


    // Legge til oppskrift, Liste oppskrift navn, redigere oppskrifter, fjerne oppskrifter
}

// ------------------------------

function loginPage() {
    loadTemplate("tpLoginPage", divContent, true)
    const loginForm = document.getElementById("loginForm");

    const btnSignIn = document.getElementById("btnSignIn");
    const btnNewUser = document.getElementById("btnNewUser");

    btnSignIn.addEventListener("click", loginUser);

    btnNewUser.addEventListener("click", createUser);
};

// ------------------------------

async function userPage() {
    loadTemplate("tpUserPage", divContent, true);

    const userInfo = document.getElementById("userInfo");

    const token = localStorage.getItem("token")
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
    };

    const btnHome = document.getElementById("btnHome");
    const btnEditUser = document.getElementById("btnEditUser");
    const btnLogOut = document.getElementById("btnLogOut");

    btnHome.addEventListener("click", homePage);
    btnEditUser.addEventListener("click", editUser);
    btnLogOut.addEventListener("click", logoutUser);

}

// ------------------------------

async function recipePage(recipeID) {
    loadTemplate("tpRecipePage", divContent, true);
    const btnHome = document.getElementById("btnHome");

    const nameContainer = document.getElementById("nameContainer");
    const ingredientContainer = document.getElementById("ingredientContainer");
    const descriptionContainer = document.getElementById("descriptionContainer");

    const token = localStorage.getItem("token");
    const response = await fetch("/user/recipe", {
        method: "GET",
        headers: {
            "authorization": token,
            "recipeid": recipeID
        }
    });


    if (response.ok) {
        const recipeData = await response.json();


        if (recipeData.length > 0) {
            const recipe = recipeData[0];

            console.log(recipe)
            const recipeName = document.createElement("h2");
            const recipeIngr = document.createElement("p");
            const recipeDescr = document.createElement("p");

            recipeName.innerHTML = recipe.name;
            nameContainer.appendChild(recipeName);

            const ingredients = JSON.parse(recipe.ingredients);
            for (let key in ingredients) {
                console.log(ingredients[key])
                const ingredient = document.createElement("p");

                ingredient.innerHTML = ingredients[key].quantity + ingredients[key].value + " " + ingredients[key].type;

                ingredientContainer.appendChild(ingredient)
            };

            
            const descriptions = JSON.parse(recipe.description);
            for (let key in descriptions) {
                console.log(descriptions[key])
                const description = document.createElement("p");

                description.innerHTML = key + ". " + descriptions[key].info;

                ingredientContainer.appendChild(description)
            };

        } else {
            console.error("No recipe data found");
        }


    } else {
        console.error("Failed to fetch recipe");
    };

    btnHome.addEventListener("click", homePage)
}



