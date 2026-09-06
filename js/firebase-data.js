/* ====================================================================
   Učitava recepte iz Firestore-a (kolekcija "recipes") i pokreće app.
   Ovo je jedini deo koda koji "zna" za Firebase — ostatak app-a i dalje
   radi sa običnim globalnim `recipes` nizom, kao i pre.
==================================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy }
  from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDy06z-_4ew3YfuJ4qROpeRm349mgnhuo",
  authDomain: "homeapps-c4df4.firebaseapp.com",
  projectId: "homeapps-c4df4",
  storageBucket: "homeapps-c4df4.firebasestorage.app",
  messagingSenderId: "67513182405",
  appId: "1:67513182405:web:fcfe9ea4511e788c75e8ac"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadRecipesAndStart(){
  try {
    const q = query(collection(db, "recipes"), orderBy("order"));
    const snap = await getDocs(q);
    window.recipes = snap.docs.map(d => d.data());
  } catch (e){
    console.error("Učitavanje recepata iz Firestore-a nije uspelo:", e);
    window.recipes = [];
    window.recipesLoadError = true;
  }
  window.initApp();
}

loadRecipesAndStart();
