import { elements } from "./base";

export const clearRecipeView = () => {
    elements.recipesDisplay.innerHTML = "";
};

export const renderRecipe = (id, details) => {
    //! Pass in one doc object of name-value pair for this
    // Note that the data need to be details.data().[attributename]

    // console.log("This is UID");
    // console.log(details.id);
    // console.log("This is original data");
    // console.log(details.data());

    //TODO: Edit this markup accordingly later
    const markup = `
        <li class="food-result" data-id="${id}">
            <div class="favourite-logo">
                <svg>
                    <use
                        href="./img/icons.svg#icon-heart-outlined"
                    ></use>
                </svg>
            </div>
            <div class="food-flex-box">
                <div class="food-primary-info">
                    <div class="food-name">
                        <h2>${details.name}</h2>
                    </div>
                    <div class="food-macros-info">
                        <div class="macros">
                            <div
                                class="food-macro protein-macro"
                            >
                                P ${details.p}
                            </div>
                            <div class="food-macro carbs-macro">
                                C ${details.c}
                            </div>
                            <div class="food-macro fat-macro">
                                F ${details.f}
                            </div>
                        </div>
                        <div class="edit">DELETE</div>
                    </div>
                </div>
                <div class="food-calories">
                    <h1>${details.cal} <span>Kcal</span></h1>
                </div>
            </div>
            <div class="add-logo">
                <svg>
                    <use
                        href="./img/icons.svg#icon-circle-with-plus"
                    ></use>
                </svg>
            </div>
        </li>

    `;

    elements.recipesDisplay.insertAdjacentHTML("afterbegin", markup);
};

export const renderRecipeBySearch = (query, recipesState) => {
    if (!recipesState) return;

    console.log("this is query");
    console.log(query);
    console.log("This is stored recipes");
    console.log(recipesState);

    const result = Object.keys(recipesState).filter((key) =>
        recipesState[key].name.toLowerCase().includes(query.toLowerCase())
    );

    clearRecipeView();

    result.forEach((recipeId) =>
        renderRecipe(recipeId, recipesState[recipeId])
    );
};
