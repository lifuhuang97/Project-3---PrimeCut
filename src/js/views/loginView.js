import { elements } from "../views/base";

export const LoginDisplay = (state) => {
    if (state.currentUser) {
        elements.signInButtonText.innerHTML = "Sign Out";
        elements.googleSignInBtn.classList.add("signed-out-width");
        elements.googleSignInBtn.classList.remove("signed-in-width");
    } else {
        elements.signInButtonText.innerHTML = "Sign In with Google";
        elements.googleSignInBtn.classList.add("signed-in-width");
        elements.googleSignInBtn.classList.remove("signed-out-width");
    }
};
