import { useEffect, useState } from "react";
import { loadRecipesAndRatings, watchAuthState, signOutUser, requestAccess, isAdminUser } from "./firebase.js";
import Admin from "./components/Admin.jsx";
import { AppDataProvider, useAppData } from "./AppData.jsx";
import Login from "./components/Login.jsx";
import InstallPrompt from "./components/InstallPrompt.jsx";
import TopBar from "./components/TopBar.jsx";
import RecipeList from "./components/RecipeList.jsx";
import RecipeDetail from "./components/RecipeDetail.jsx";
import ShoppingList from "./components/ShoppingList.jsx";

function routeHash(id){
  return "#/recept/" + encodeURIComponent(id);
}
function parseRoute(){
  const match = location.hash.match(/^#\/recept\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function isAdminRoute(){
  return location.hash === "#/admin";
}

function AccessDenied({ user }){
  const [status, setStatus] = useState("sending"); // sending | sent | error

  useEffect(() => {
    requestAccess(user).then(() => setStatus("sent")).catch(err => {
      console.error("Slanje zahteva za pristup nije uspelo:", err);
      setStatus("error");
    });
  }, [user]);

  return (
    <div className="login-screen">
      <div className="login-card access-denied">
        <h1>Nemaš pristup</h1>
        <p>Nalog <strong>{user.email}</strong> nije na listi dozvoljenih.</p>
        <p>
          {status === "sending" && "Šaljem zahtev za pristup…"}
          {status === "sent" && "Zahtev za pristup je poslat. Kad ga odobre, osveži stranicu."}
          {status === "error" && "Slanje zahteva nije uspelo. Pokušaj ponovo kasnije."}
        </p>
        <button className="login-button" onClick={signOutUser}>Odjavi se</button>
      </div>
    </div>
  );
}

function Recepti({ isAdmin }){
  const { recipes } = useAppData();
  const [detailId, setDetailId] = useState(parseRoute);
  const [adminView, setAdminView] = useState(() => isAdmin && isAdminRoute());
  const [activeCategory, setActiveCategory] = useState("Sve");

  useEffect(() => {
    // ako je stranica otvorena direktno na linku recepta, ubaci "listu" ispod
    // u istoriju da back dugme (u appu ili na telefonu) uvek prvo vodi na listu
    if (/^#\/recept\//.test(location.hash)){
      const detailHash = location.hash;
      history.replaceState(null, "", location.pathname + location.search);
      history.pushState(null, "", detailHash);
    }
    function onPopState(){ setDetailId(parseRoute()); setAdminView(isAdmin && isAdminRoute()); }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isAdmin]);

  useEffect(() => { window.scrollTo(0, 0); }, [detailId, adminView]);

  function openAdmin(){
    history.pushState(null, "", "#/admin");
    setAdminView(true);
  }

  function openDetail(id){
    history.pushState(null, "", routeHash(id));
    setDetailId(id);
  }
  function backToList(){
    if (adminView){
      history.pushState(null, "", location.pathname + location.search);
      setAdminView(false);
    } else if (location.hash) history.back();
    else { history.pushState(null, "", location.pathname + location.search); setDetailId(null); }
  }

  const recipe = detailId ? recipes.find(r => r.id === detailId) : null;
  const filtered = activeCategory === "Sve" ? recipes : recipes.filter(r => r.category === activeCategory);

  return (
    <div className="page">
      <TopBar
        view={adminView ? "admin" : recipe ? "detail" : "list"}
        count={filtered.length}
        onBack={backToList}
        onSignOut={signOutUser}
        isAdmin={isAdmin}
        onAdmin={openAdmin}
      />
      {adminView
        ? <Admin />
        : recipe
          ? <RecipeDetail recipe={recipe} />
          : <RecipeList recipes={filtered} activeCategory={activeCategory} onCategoryChange={setActiveCategory} onOpen={openDetail} />}
      <ShoppingList />
    </div>
  );
}

export default function App(){
  const [user, setUser] = useState(undefined); // undefined = auth stanje se još učitava
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => watchAuthState(setUser), []);

  useEffect(() => {
    if (!user) return;
    loadRecipesAndRatings()
      .then(setData)
      .catch(err => {
        console.error("Učitavanje recepata nije uspelo:", err);
        if (err.code === "permission-denied") setAccessDenied(true);
        else setError(err);
      });
  }, [user]);

  if (user === undefined) return <InstallPrompt />;
  if (user === null) return <><InstallPrompt /><Login /></>;

  if (accessDenied) {
    return <><InstallPrompt /><AccessDenied user={user} /></>;
  }

  return (
    <>
      <InstallPrompt />
      {error && <div className="state-box">Učitavanje recepata nije uspelo. Proveri konekciju i osveži stranicu.</div>}
      {!error && !data && <div className="state-box">Učitavanje recepata…</div>}
      {!error && data && (
        <AppDataProvider recipes={data.recipes} initialRatings={data.ratings}>
          <Recepti isAdmin={isAdminUser(user)} />
        </AppDataProvider>
      )}
    </>
  );
}
