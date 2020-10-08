import firebase, { initializeApp } from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const config = {
    apiKey: "AIzaSyALCwn8F8FiVQenlE_ssgAkW8wpQ3pnKqI",
    authDomain: "primecut-bcefb.firebaseapp.com",
    databaseURL: "https://primecut-bcefb.firebaseio.com",
    projectId: "primecut-bcefb",
    storageBucket: "primecut-bcefb.appspot.com",
    messagingSenderId: "815414462176",
    appId: "1:815414462176:web:cdec08692b96363295f285",
    measurementId: "G-PFK14EXK2B",
};

firebase.initializeApp(config);
var a = 2;

// Create
export const createUserProfileDocument = async (userAuth, additionalData) => {
    // Return if no users found
    if (!userAuth) return;

    // Create user reference
    const userRef = firestore.doc(`users/${userAuth.uid}`);

    // Get a snapshot of this user reference
    const snapShot = await userRef.get();

    if (!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();
        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData,
            });
        } catch (error) {
            console.log("error creating user", error.message);
        }
    }

    return userRef;
};

export const addRecipeToFirestore = async (userAuth, details) => {
    const allDetails = { ...details };
    console.log("this is name");
    console.log(allDetails.name);
    console.log("this is protein");
    console.log(allDetails.p);
    console.log(allDetails.c);
    console.log(allDetails.f);
    console.log(allDetails.cal);

    if (!userAuth) return;

    // Holds a reference to a new document created in recipes
    const reference = firestore
        .doc(`users/${userAuth.uid}`)
        .collection("recipes")
        .doc();

    try {
        console.log("starting to write to recipes");
        // Use this to set the data in this new document
        await reference.set({
            name: "Big Juicy Steak",
            p: "17",
            c: "25",
            f: "90",
            cal: "1675",
        });
        console.log();
        console.log("finished writing to recipes");
    } catch (error) {
        console.log("Failed to create subcollection", error.message);
    }

    //* Returns the randomly generated UID
    return reference.id;
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = async () => auth.signInWithPopup(provider);
