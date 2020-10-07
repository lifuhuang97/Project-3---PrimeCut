import { elements } from "../views/base";

export const LoginDisplay = ({ currentUser }) => {
    if (currentUser) {
        elements.signInButtonText.innerHTML = "Sign Out";
        elements.googleSignInBtn.classList.add("signed-out-width");
        elements.googleSignInBtn.classList.remove("signed-in-width");

        document.querySelector(".unloggedin-container").style.display = "none";
        document.querySelector(".container-white").style.display = "flex";
        console.log("Login View: View changed to Logged In View");
    } else {
        elements.signInButtonText.innerHTML = "Sign In with Google";
        elements.googleSignInBtn.classList.add("signed-in-width");
        elements.googleSignInBtn.classList.remove("signed-out-width");

        document.querySelector(".unloggedin-container").style.display = "flex";
        document.querySelector(".container-white").style.display = "none";
        console.log("Login View: View changed to Logged Out View");
    }
};
