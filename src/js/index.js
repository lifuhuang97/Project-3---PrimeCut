import { elements } from "./views/base";
import * as firebase from "./firebase/firebase.utils";
import * as loginView from "./views/loginView";
import * as addRecipeView from "./views/addRecipeView";
import * as dailyRecipeView from "./views/dailyRecipeView";

// App Initialization
// Current User stores the UID

const getDateInDDMMYY = () => {
    let today = new Date();
    // const date = jsDate.getDate();
    const day = ("0" + today.getDate()).slice(-2);
    // const month = jsDate.getMonth();

    const month = ("0" + (today.getMonth() + 1)).slice(-2);

    const year = today.getFullYear().toString().substr(-2);

    return day + month + year;
};

const state = {
    currentUser: null,
    currentDate: getDateInDDMMYY(),
    recipes: {},
    daily: {},
};

// Login Handling Code --- Messy because don't understand google login & firebase well, to be optimized
firebase.auth.onAuthStateChanged(async (user) => {
    if (user) {
        state.currentUser = user.uid;
        console.log("User logged in, firebase auth detected");
        console.log(state.currentUser);
        openStreams(state.currentUser);
        processDailyRecipes();
    } else {
        console.log("User logged out, firebase auth detected");
        state.currentUser = null;
        console.log(state.currentUser);
    }
    loginView.LoginDisplay(state);
});

elements.googleSignIn.addEventListener("click", (e) => {
    e.preventDefault();
    // process Sign In with Google
    if (!state.currentUser) {
        firebase.signInWithGoogle().then(function () {
            // loginView.LoginDisplay(state);
        });
    } else {
        (() =>
            firebase.auth.signOut().then(function () {
                console.log("User signed out");
            }))();
    }
});

const openStreams = (userId) => {
    // User's Recipes Stream
    firebase.firestore
        .collection("users")
        .doc(userId)
        .collection("recipes")
        .onSnapshot((snapshot) => {
            // console.log(snapshot);
            let changes = snapshot.docChanges();

            changes.forEach((change) => {
                let thisRecipeId = change.doc.id;

                if (change.type == "added") {
                    addRecipeView.renderRecipe(change.doc);

                    const { name, p, c, f, cal } = change.doc.data();

                    // console.log("This is change.doc.data().cal");
                    // console.log(change.doc.data().cal);

                    state.recipes = {
                        ...state.recipes,
                        [thisRecipeId]: { name, p, c, f, cal },
                    };
                    // console.log("This is state for recipes after adding");
                    // console.log(state.recipes);
                } else if (change.type == "removed") {
                    // console.log("change.doc.id is " + thisRecipeId);
                    let li = elements.recipesDisplay.querySelector(
                        "[data-id=" + change.doc.id + "]"
                    );
                    elements.recipesDisplay.removeChild(li);

                    delete state.recipes[thisRecipeId];
                    // console.log("This is state for recipes after deleting");

                    // console.log(state.recipes);
                }
            });
        });
};

//Users Daily Stream

const processDailyRecipes = () => {
    // User's Daily Stream
    firebase.firestore
        .collection("users")
        .doc(state.currentUser)
        .collection("daily")
        .doc(state.currentDate)
        .collection("daily-recipes")
        .onSnapshot((snapshot) => {
            // console.log(snapshot);
            let changes = snapshot.docChanges();
            // console.log(
            // "This is the real time DAILY RECIPES data FROM MAIN PAGE"
            // );
            // console.log(changes);

            changes.forEach((change) => {
                let thisRecipeId = change.doc.id;

                if (change.type == "added") {
                    dailyRecipeView.renderDaily(change.doc);

                    const { name, p, c, f, cal } = change.doc.data();

                    state.daily = {
                        ...state.daily,
                        [thisRecipeId]: { name, p, c, f, cal },
                    };
                    dailyRecipeView.processSummaryInfo(state.daily);
                } else if (change.type == "removed") {
                    // console.log("change.doc.id is " + thisRecipeId);
                    let li = elements.dailyDisplay.querySelector(
                        "[data-id=" + change.doc.id + "]"
                    );

                    // console.log(li);

                    elements.dailyDisplay.removeChild(li);
                    delete state.daily[thisRecipeId];
                    dailyRecipeView.processSummaryInfo(state.daily);
                }
            });
        });
};

const controlAddRecipe = (data) => {
    // 2. Add Data to Firebase Recipe
    if (data) {
        addRecipeView.processAddRecipe(state.currentUser, data);
    }
};

elements.addRecipeButton.addEventListener("click", (e) => {
    // Display add recipe
    addRecipeView.showAddRecipe();
});

elements.recipesDisplay.addEventListener("click", (e) => {
    if (!state.currentUser || !state.currentDate) return;

    const id = e.target.closest(".food-result").getAttribute("data-id");
    // console.log("This node's id is " + id);

    if (e.target.classList.contains("edit")) {
        // Delete recipe from database
        // console.log("Delete is clicked");
        addRecipeView.processDeleteRecipe(state.currentUser, id);
        // elements.recipesDisplay.innerHTML = "";
        // console.log("recipe display should be cleared la");
        // yes it cleared.
    } else if (
        // Add recipe to daily recipes here
        (e.target && e.target.parentElement.classList.contains("add-logo")) ||
        e.target.parentElement.parentElement.classList.contains("add-logo")
    ) {
        dailyRecipeView.processAddDaily(
            state.currentUser,
            state.currentDate,
            state.recipes[id],
            id
        );
        // console.log("Add is clicked");
    }
});

elements.submitAddRecipeButton.addEventListener("click", (e) => {
    // Submit form input to firebase to add to database
    e.preventDefault();
    const data = $(".add-food-flex-box").serializeArray();
    controlAddRecipe(data);
    addRecipeView.hideAddRecipe();
});

elements.returnFromAddRecipeButton.addEventListener("click", (e) => {
    // Change add recipe display to none
    addRecipeView.hideAddRecipe();
});

// Daily Recipes Control

elements.dailyDisplay.addEventListener("click", (e) => {
    if (!state.currentUser || !state.currentDate) return;

    if (e.target.closest(".summary-food-item")) {
        const id = e.target
            .closest(".summary-food-item")
            .getAttribute("data-id");

        if (
            (e.target &&
                e.target.parentElement.classList.contains("delete-logo")) ||
            e.target.parentElement.parentElement.classList.contains(
                "delete-logo"
            )
        ) {
            dailyRecipeView.processDeleteDaily(
                state.currentUser,
                state.currentDate,
                id
            );
        }
    }
});

// Auto Search (To be completed)
var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

document.querySelector(".search__field").addEventListener("keyup", (event) => {
    // console.log("event target value is " + event.target.value);
    delay(function () {
        alert("Hi, func called");
    }, 300);
});

// To be thrown somewhere else later
$("#datepicker")
    .datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "dd M yy",
        yearRange: "2015:c+100",
        maxDate: "+0D",
        showButtonPanel: true,
    })
    .datepicker("setDate", new Date());

$(document).on("click", "button.ui-datepicker-current", function () {
    $("#datepicker").datepicker("setDate", new Date());
});

$("#datepicker")
    .datepicker()
    .on("input change", function (e) {
        // console.log("Date changed: ", e.target.value);
        var jsDate = $("#datepicker").datepicker("getDate");
        if (jsDate !== null) {
            jsDate instanceof Date; // -> true

            // const date = jsDate.getDate();
            const date = ("0" + jsDate.getDate()).slice(-2);
            // const month = jsDate.getMonth();

            const month = ("0" + (jsDate.getMonth() + 1)).slice(-2);

            const year = jsDate.getFullYear().toString().substr(-2);

            // console.log(
            // "Date: " + date + " Month: " + month + " Year: " + year
            // );

            state.currentDate = date + month + year;
            dailyRecipeView.clearDailyView();
            processDailyRecipes();
        }
    });
