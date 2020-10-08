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

    console.log("This is processed data");
    // console.log(processedData);
    // console.log(processedData.name);
    // console.log(processedData.p);
    // console.log(processedData.c);
    // console.log(processedData.f);
    console.log(processedData.cal);

    let kcal = processedData.cal;

    if (!processedData.cal) {
        let caloriesCalc =
            parseInt(processedData.p) * 4 +
            parseInt(processedData.c) * 4 +
            parseInt(processedData.f) * 9;
        kcal = caloriesCalc;
    }

    // 2. Send to firebase
    firestore.doc(`users/${user}`).collection("recipes").add({
        p: processedData.p,
        c: processedData.c,
        f: processedData.f,
        name: processedData.name,
        cal: kcal,
    });
};
