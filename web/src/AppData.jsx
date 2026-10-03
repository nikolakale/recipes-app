import { createContext, useContext, useState } from "react";
import { rateRecipe } from "./firebase.js";
import { loadShoppingList, persistShoppingList } from "./shoppingList.js";

const AppDataContext = createContext(null);

export function AppDataProvider({ recipes, initialRatings, children }){
  const [ratings, setRatings] = useState(initialRatings);
  const [shoppingList, setShoppingList] = useState(loadShoppingList);

  function setRating(recipeId, value){
    setRatings(prev => {
      const next = { ...prev };
      if (value) next[recipeId] = value; else delete next[recipeId];
      return next;
    });
    rateRecipe(recipeId, value).catch(e => console.error('Čuvanje ocene nije uspelo:', e));
  }

  function getRating(recipeId){
    return ratings[recipeId] || 0;
  }

  function isInShoppingList(name){
    return shoppingList.some(i => i.name.toLowerCase() === name.toLowerCase());
  }

  function addToShoppingList(name, amount, recipeTitle){
    setShoppingList(prev => {
      if (prev.some(i => i.name.toLowerCase() === name.toLowerCase())) return prev;
      const next = [...prev, { id: Date.now() + '-' + Math.random().toString(36).slice(2, 7), name, amount, recipe: recipeTitle }];
      persistShoppingList(next);
      return next;
    });
  }

  function removeFromShoppingList(id){
    setShoppingList(prev => {
      const next = prev.filter(i => i.id !== id);
      persistShoppingList(next);
      return next;
    });
  }

  function clearShoppingList(){
    setShoppingList([]);
    persistShoppingList([]);
  }

  const value = {
    recipes, getRating, setRating,
    shoppingList, isInShoppingList, addToShoppingList, removeFromShoppingList, clearShoppingList,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(){
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData mora biti pozvan unutar AppDataProvider-a.");
  return ctx;
}
