// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA1GPCnUXwojdNd5dgjABkeCqgNkPHmc44",
  authDomain: "orv-character.firebaseapp.com",
  projectId: "orv-character",
  storageBucket: "orv-character.firebasestorage.app",
  messagingSenderId: "770517353563",
  appId: "1:770517353563:web:121d93d9ce085fe9966b7e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to save character
async function saveCharacter(character) {
  try {
    await addDoc(collection(db, "characters"), character);
    console.log("Character saved!");
  } catch (e) {
    console.error("Error adding character: ", e);
  }
}

window.saveCharacter = saveCharacter;
