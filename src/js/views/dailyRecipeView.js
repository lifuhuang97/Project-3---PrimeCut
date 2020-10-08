import { elements } from "../views/base";
import { firestore } from "../firebase/firebase.utils";

export const clearDailyView = () => {
    elements.dailyDisplay.innerHTML = "";
};

export const processDeleteDaily = (user, date, recipeId) => {
    // Use ID, retrieve ID, delete it
    if (!user || !recipeId) return;

    firestore
        .doc(`users/${user}`)
        .collection("daily")
        .doc(date)
        .collection("daily-recipes")
        .doc(recipeId)
        .delete();
};

export const processAddDaily = async (user, date, recipe, recipeId) => {
    // Don't continue if there's no user object

    // console.log("This is from within processAddRecipe method");
    // console.log(user, date, recipe);

    if (!user || !recipe) return;
    // 1. Clean Data into JSON Object

    // TBD

    // 2. Send to firebase
    const reference = firestore
        .doc(`users/${user}`)
        .collection("daily")
        .doc(date)
        .collection("daily-recipes")
        .doc(recipeId);
    // ^ Set recipeId to that that came from recipe in args

    try {
        await reference.set({
            // Recipe Data that's parsed
            p: recipe.p,
            c: recipe.c,
            f: recipe.f,
            name: recipe.name,
            cal: recipe.cal,
        });
    } catch (error) {
        console.log("Failed adding recipe to daily", error.message);
    }
};

const renderNameLength = (name) => {
    const limit = 40;

    if (name.length > limit) {
        return `${name.substring(0, 40)} ...`;
    }

    return name;
};

export const renderDaily = (details) => {
    console.log("This is UID in renderDaily");
    console.log(details.id);

    let fixedDailyItemName = renderNameLength(details.data().name);

    // console.log("This is original data in renderDaily");
    // console.log(details.data());

    const markup = `
    <li class="summary-food-item" data-id="${details.id}">
    <div class="food-summary">
        <div class="food-info">
            <div class="food-name">
                <h2>
                    ${fixedDailyItemName}
                </h2>
            </div>
            <div class="food-macros-info">
                <div class="food-macro protein-macro">
                    P ${details.data().p}

                </div>
                <div class="food-macro carbs-macro">
                    C ${details.data().c}

                </div>
                <div class="food-macro fat-macro">
                    F ${details.data().f}
                </div>
            </div>
        </div>
        <div class="food-calories">
            <h1>${details.data().cal} <span>Kcal</span></h1>
        </div>
    </div>
    <div class="delete-logo">
        <svg>
            <use
                href="./img/icons.svg#icon-circle-with-plus"
            ></use>
        </svg>
    </div>
</li>
    `;

    elements.dailyDisplay.insertAdjacentHTML("afterbegin", markup);
};

export const clearSummaryInfo = () => {
    elements.totalCalories.querySelector("h1").innerText = 0;
    elements.totalProtein.innerHTML = "P " + 0;
    elements.totalCarbs.innerHTML = "C " + 0;
    elements.totalFat.innerHTML = "F " + 0;
};

export const processSummaryInfo = (dailyRecipes) => {
    if (!dailyRecipes) return;

    console.log("I'm in processSummaryInfo");
    console.log(dailyRecipes);

    let p = 0;
    let c = 0;
    let f = 0;
    let cal = 0;
    // Calculate P, C, F, Kcal Total

    Object.keys(dailyRecipes).map((recipeKey) => {
        let recipe = dailyRecipes[recipeKey];

        p += parseInt(recipe.p, 10);
        c += parseInt(recipe.c, 10);
        f += parseInt(recipe.f, 10);
        cal += parseInt(recipe.cal, 10);
    });

    // Change innerHTML accordingly
    elements.totalCalories.querySelector("h1").innerText = cal;
    elements.totalProtein.innerHTML = "P " + p;
    elements.totalCarbs.innerHTML = "C " + c;
    elements.totalFat.innerHTML = "F " + f;
};
