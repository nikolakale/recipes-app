/* ====================================================================
   Firebase klijent (isti projekat kao gym-app: homeapps-c4df4).

   recipes: web app SAMO čita — pisanje ide isključivo preko Cloudflare
   Worker-a (MCP alati), na zahtev korisnika u chatu.

   ratings: web app piše DIREKTNO odavde (zvezdice 1-5 se klikću uživo).
   Stranica je javno dostupna (Cloudflare Worker URL), pa firestore.rules
   ograničava i čitanje i pisanje na prijavljene korisnike sa dozvoljenim
   Google nalogom (isti allowlist mehanizam kao gym-app).
==================================================================== */
import { initializeApp } from "firebase/app";
import {
  initializeFirestore, collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDy06z-_4ew3YfuJ4qROpeRm349mgnhuo",
  authDomain: "homeapps-c4df4.firebaseapp.com",
  projectId: "homeapps-c4df4",
  storageBucket: "homeapps-c4df4.firebasestorage.app",
  messagingSenderId: "67513182405",
  appId: "1:67513182405:web:fcfe9ea4511e788c75e8ac",
};

const app = initializeApp(firebaseConfig);
// Long polling umesto WebChannel streaming-a: streaming veza ka Firestore-u se na nekim
// mrežama/ekstenzijama/antivirusima blokira (CORS greška), pa SDK ostane u offline modu.
const db = initializeFirestore(app, { experimentalForceLongPolling: true });
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export function watchAuthState(callback){
  return onAuthStateChanged(auth, callback);
}

export function signInWithGoogle(){
  return signInWithPopup(auth, googleProvider);
}

export function signOutUser(){
  return signOut(auth);
}

export async function loadRecipesAndRatings(){
  const [recipesSnap, ratingsSnap] = await Promise.all([
    getDocs(query(collection(db, "recipes"), orderBy("order"))),
    getDocs(collection(db, "ratings")),
  ]);
  const recipes = recipesSnap.docs.map(d => d.data());
  const ratings = {};
  ratingsSnap.docs.forEach(d => { ratings[d.id] = d.data().rating; });
  return { recipes, ratings };
}

/* ---------- pristup / admin ----------
   ADMIN_EMAIL je samo za prikaz taba; stvarnu zaštitu daje firestore.rules. */
export const ADMIN_EMAIL = "nikolakale@gmail.com";

export function isAdminUser(user){
  return !!user && user.emailVerified && user.email?.toLowerCase() === ADMIN_EMAIL;
}

// Korisnik bez pristupa ostavlja zahtev (ID dokumenta = uid).
export async function requestAccess(user){
  await setDoc(doc(db, "accessRequests", user.uid), {
    email: user.email.toLowerCase(),
    displayName: user.displayName || "",
    requestedAt: serverTimestamp(),
  });
}

export async function loadAdminData(){
  const [reqSnap, allowedSnap] = await Promise.all([
    getDocs(collection(db, "accessRequests")),
    getDocs(collection(db, "allowedUsers")),
  ]);
  const requests = reqSnap.docs
    .map(d => ({ uid: d.id, ...d.data() }))
    .sort((a, b) => (b.requestedAt?.toMillis?.() || 0) - (a.requestedAt?.toMillis?.() || 0));
  const allowed = allowedSnap.docs
    .map(d => ({ email: d.id, ...d.data() }))
    .sort((a, b) => a.email.localeCompare(b.email));
  return { requests, allowed };
}

export async function approveRequest(request){
  await setDoc(doc(db, "allowedUsers", request.email.toLowerCase()), {
    displayName: request.displayName || "",
    approvedAt: serverTimestamp(),
  });
  await deleteDoc(doc(db, "accessRequests", request.uid));
}

export async function rejectRequest(request){
  await deleteDoc(doc(db, "accessRequests", request.uid));
}

export async function revokeAccess(email){
  await deleteDoc(doc(db, "allowedUsers", email.toLowerCase()));
}

export async function rateRecipe(recipeId, value){
  const ref = doc(db, "ratings", recipeId);
  if (value > 0) await setDoc(ref, { rating: value, updatedAt: serverTimestamp() });
  else await deleteDoc(ref);
}
