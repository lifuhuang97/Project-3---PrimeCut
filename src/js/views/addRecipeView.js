import { elements } from "../views/base";
import { firestore } from "../firebase/firebase.utils";

export const showAddRecipe = () => {
    elements.addRecipeDisplay.style.display = "flex";
};

export const hideAddRecipe = () => {
    elements.addRecipeDisplay.style.display = "none";
    elements.addRecipeForm.reset();
};

export const processDeleteRecipe = (user, recipeId) => {
    // Use ID, retrieve ID, delete it
    if (!user || !recipeId) return;

    firestore.doc(`users/${user}`).collection("recipes").doc(recipeId).delete();
};

export const processAddRecipe = (user, foodRawData) => {
    // Don't continue if there's no user object

    if (!user || !foodRawData) return;
    // 1. Clean Data into JSON Object

    // console.log("This is food raw data");
    // console.log(foodRawData);

    const processedData = foodRawData.reduce((result, pair) => {
        result[pair.name] = pair.value;
        return result;
    }, {});

    // console.log("This is processed data");
    // console.log(processedData);
    // console.log(processedData.name);
    // console.log(processedData.p);
    // console.log(processedData.c);
    // console.log(processedData.f);
    // console.log(processedData.cal);

    // 2. Send to firebase
    firestore.doc(`users/${user}`).collection("recipes").add({
        p: processedData.p,
        c: processedData.c,
        f: processedData.f,
        name: processedData.name,
        cal: processedData.cal,
    });
};

export const renderRecipe = (details) => {
    //! Pass in one doc object of name-value pair for this
    // Note that the data need to be details.data().[attributename]

    // console.log("This is UID");
    // console.log(details.id);
    // console.log("This is original data");
    // console.log(details.data());

    //TODO: Edit this markup accordingly later
    const markup = `
        <li class="food-result" data-id="${details.id}">
            <div class="favourite-logo">
                <svg>
                    <use
                        href="./img/icons.svg#icon-heart"
                    ></use>
                </svg>
            </div>
            <div class="food-flex-box">
                <div class="food-primary-info">
                    <div class="food-name">
                        <h2>${details.data().name}</h2>
                    </div>
                    <div class="food-macros-info">
                        <div class="macros">
                            <div
                                class="food-macro protein-macro"
                            >
                                P ${details.data().p}
                            </div>
                            <div class="food-macro carbs-macro">
                                C ${details.data().c}
                            </div>
                            <div class="food-macro fat-macro">
                                F ${details.data().f}
                            </div>
                        </div>
                        <div class="edit">DELETE</div>
                    </div>
                </div>
                <div class="food-calories">
                    <h1>${details.data().cal} <span>Kcal</span></h1>
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
