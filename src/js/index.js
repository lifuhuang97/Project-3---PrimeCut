import { elements } from "./views/base";
import * as firebase from "./firebase/firebase.utils";
import * as loginView from "./views/loginView";

// App Initialization
const state = { currentUser: null };

firebase.auth.onAuthStateChanged(async (user) => {
    if (user) {
        state.currentUser = user.displayName;
        console.log("Auth state changed");
        console.log(state.currentUser);

        // if (state.currentUser) {
        //     console.log("i added something lols");
        //     const newItemId = await firebase.addRecipeToFirestore(user);
        //     console.log("here's my new id!");
        //     console.log(newItemId);
        // }
    } else {
        state.currentUser = null;
        console.log("sign out lo");
        console.log(state.currentUser);
    }
    loginView.LoginDisplay(state);
});

// Login Controller

const controlLogin = () => {
    // Update User State
    // Render login area UI
};



elements.googleSignIn.addEventListener("click", (e) => {
    e.preventDefault();
    // process Sign In with Google
    if (!state.currentUser) {
        firebase
            .signInWithGoogle()
            .then(controlLogin)
            .then(function () {
                loginView.LoginDisplay(state);
            });
    } else {
        (() =>
            firebase.auth.signOut().then(function () {
                console.log("User signed out");
            }))();
    }
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
    $(".datePicker").datepicker("setDate", new Date());
});
