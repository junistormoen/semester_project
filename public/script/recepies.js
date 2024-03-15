
function addRecipe() {
    loadTemplate("tpAddRecipes", divContent, true);

    const btnAddRes = document.getElementById("btnAdd");

    btnAddRes.addEventListener("click", async function (evt) {
        const token = localStorage.getItem("token");

        const name = document.getElementById("name").value;
        const ingredients = document.getElementById("ingredients").value;
        const description = document.getElementById("description").value;

        const recipe = { name, ingredients, description};

        const response = await fetch("/user/recipes", {
            method: "POST", 
            header: {
                "authorization": token,
            },
            body: JSON.stringify(recipe)
        })

        if(response.ok){
            console.log("Oppskrift lagt til")
            homePage();
        } else (
            console.log("Problemer")
        )

    })
}