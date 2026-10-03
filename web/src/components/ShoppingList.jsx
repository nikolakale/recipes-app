import { useState } from "react";
import { useAppData } from "../AppData.jsx";

export default function ShoppingList(){
  const { shoppingList, removeFromShoppingList, clearShoppingList } = useAppData();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="fab" aria-label="Lista za kupovinu" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" />
          <circle cx="9.5" cy="20" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="17" cy="20" r="1.3" fill="currentColor" stroke="none" />
        </svg>
        <span className={"fab-badge" + (shoppingList.length === 0 ? " hidden" : "")}>{shoppingList.length}</span>
      </button>

      <div className={"overlay" + (open ? " open" : "")} onClick={() => setOpen(false)} />
      <div className={"sheet" + (open ? " open" : "")} role="dialog" aria-label="Lista za kupovinu">
        <div className="sheet-handle" />
        <div className="sheet-head">
          <h3>Lista za kupovinu</h3>
          <button className="sheet-close" aria-label="Zatvori" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="sheet-body">
          {shoppingList.length === 0 ? (
            <div className="empty">Lista je prazna.<br />Dodaj sastojke koji ti nedostaju.</div>
          ) : (
            <ul className="shop-list">
              {shoppingList.map(item => (
                <li key={item.id}>
                  <span className="shop-name">
                    {item.name}
                    {item.recipe && <span className="from">{item.recipe}</span>}
                  </span>
                  <span className="shop-amt">{item.amount || ''}</span>
                  <button className="shop-remove" aria-label="Ukloni" onClick={() => removeFromShoppingList(item.id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {shoppingList.length > 0 && (
          <div className="sheet-foot">
            <button className="clear-btn" onClick={clearShoppingList}>Obriši listu</button>
          </div>
        )}
      </div>
    </>
  );
}
