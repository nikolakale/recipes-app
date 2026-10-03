import { useState } from "react";
import { categoryStyle, RecipeVisual } from "../icons.jsx";
import { getPerServingTotal } from "../utils.js";
import RatingWidget from "./RatingWidget.jsx";
import IngredientRow from "./IngredientRow.jsx";
import NutritionTable from "./NutritionTable.jsx";

function Stat({ value, label }){
  return (
    <div className="stat">
      <span className="v">{value}</span>
      <span className="l">{label}</span>
    </div>
  );
}

function MetaStats({ recipe, total }){
  return (
    <>
      <Stat value={recipe.servings} label="Porcije" />
      <Stat value={total.kcal} label="Kcal" />
      {recipe.nutrition.hasProtein && <Stat value={total.protein} label="Proteini" />}
    </>
  );
}

export default function RecipeDetail({ recipe }){
  const [saved, setSaved] = useState(false);
  const style = categoryStyle[recipe.category] || categoryStyle["Užina"];
  const total = getPerServingTotal(recipe);

  return (
    <div id="detailView">
      <article className="card">
        <div className="card-media">
          <div className="hero" style={{ background: style.tint, color: style.color }}>
            <RecipeVisual recipe={recipe} sizePercent="56%" />
            <span className="hero-tag">{recipe.category}</span>
            <button className={"hero-save" + (saved ? " saved" : "")} aria-label="Sačuvaj recept" onClick={() => setSaved(s => !s)}>
              <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.2C.4 8.4 2 4.5 6 4c2-.2 3.6.8 6 3 2.4-2.2 4-3.2 6-3 4 .5 5.6 4.4 4 7.8C19.5 16.4 12 21 12 21z" /></svg>
            </button>
          </div>
          {/* dupliran sadržaj — vidljiv samo na desktopu (leva kolona), vidi styles.css */}
          <div className="meta meta-side">
            <MetaStats recipe={recipe} total={total} />
          </div>
          <RatingWidget recipeId={recipe.id} />
          {recipe.nutrition.rows.length > 0 && (
            <section className="nutrition-section">
              <h3 className="sec">Kalorije i proteini</h3>
              <NutritionTable nutrition={recipe.nutrition} />
            </section>
          )}
        </div>

        <div className="card-body">
          <h2 className="title">{recipe.title}</h2>
          <p className="desc">{recipe.description}</p>
          <RatingWidget recipeId={recipe.id} />
          <div className="meta">
            <MetaStats recipe={recipe} total={total} />
          </div>

          <section>
            <h3 className="sec">Sastojci <span className="hint">dodirni + za listu</span></h3>
            {recipe.ingredientGroups.map((group, gi) => (
              <div key={gi}>
                {group.name && <h4 className="group">{group.name}</h4>}
                <ul className="ingredients">
                  {group.items.map((item, ii) => (
                    <IngredientRow key={ii} item={item} recipeTitle={recipe.title} />
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h3 className="sec">Priprema</h3>
            <ol className="steps">
              {recipe.steps.map((step, i) => (
                <li key={i}>
                  <span className="num">{i + 1}</span>
                  <div className="step-body">
                    <span className="step-title">{step.title}</span>
                    <div className="step-text">{step.text}</div>
                    {step.timer && <span className="timer">{step.timer}</span>}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {recipe.notes && recipe.notes.length > 0 && (
            <section>
              <h3 className="sec">Napomene</h3>
              <div className="notes">
                {recipe.notes.map((n, i) => <p key={i}>{n}</p>)}
              </div>
            </section>
          )}

          {recipe.nutrition.rows.length > 0 && (
            <section className="nutrition-section">
              <h3 className="sec">Kalorije i proteini</h3>
              <NutritionTable nutrition={recipe.nutrition} />
            </section>
          )}

          {recipe.source && (
            <div className="src">
              Izvor: <a href={recipe.source.url} target="_blank" rel="noopener">{recipe.source.label}</a>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
