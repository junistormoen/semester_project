
function addRecipe() {
    loadTemplate("tpAddRecipes", divContent, true);

    const btnAddRes = document.getElementById("btnAdd");

    btnAddRes.addEventListener("click", async function (evt) {
        console.log("inne")
        const token = localStorage.getItem("token");

        const name = document.getElementById("name").value;
        const ingredients = document.getElementById("ingredients").value;
        const description = document.getElementById("description").value;

        const recipe = { name, ingredients, description};
        console.log(JSON.stringify(recipe))

        const response = await fetch("/user/recipes", {
            method: "POST", 
            headers: {
                "authorization": token,
            },
            body: JSON.stringify(recipe)
        })

        if(response.ok){
            const userData = await response.json();
            console.log(userData + "HEI")
            console.log("Oppskrift lagt til")
            homePage();
        } else (
            console.log("Problemer")
        )

    })
}