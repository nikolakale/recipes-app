import { useState } from "react";
import { useAppData } from "../AppData.jsx";

export default function IngredientRow({ item, recipeTitle }){
  const { isInShoppingList, addToShoppingList } = useAppData();
  const [done, setDone] = useState(false);
  const added = isInShoppingList(item.name);

  return (
    <li className={done ? "done" : ""}>
      <span className="box" onClick={() => setDone(d => !d)} />
      <span className="ing-name" onClick={() => setDone(d => !d)}>{item.name}</span>
      <span className="ing-amt">{item.amount}</span>
      <button
        className={"ing-add" + (added ? " added" : "")}
        aria-label="Dodaj na listu za kupovinu"
        type="button"
        onClick={() => { if (!added) addToShoppingList(item.name, item.amount, recipeTitle); }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          {added ? <path d="M5 12l5 5L19 7" /> : <path d="M12 5v14M5 12h14" />}
        </svg>
      </button>
    </li>
  );
}
