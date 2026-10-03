import { categoryStyle, RecipeVisual } from "../icons.jsx";
import { useAppData } from "../AppData.jsx";
import { getPerServingTotal } from "../utils.js";

export default function RecipeCard({ recipe, onOpen }){
  const { getRating } = useAppData();
  const style = categoryStyle[recipe.category] || categoryStyle["Užina"];
  const total = getPerServingTotal(recipe);
  const rating = getRating(recipe.id);

  return (
    <button className="row-card" onClick={() => onOpen(recipe.id)}>
      <span className="thumb" style={{ background: style.tint, color: style.color }}>
        <RecipeVisual recipe={recipe} sizePercent="62%" />
      </span>
      <span className="row-content">
        <span className="row-title">{recipe.title}</span>
        <span className="row-meta">
          <span className="cat">{recipe.category}</span>
          <span className="dot">·</span>
          <span className="stats">{total.kcal} kcal{recipe.nutrition.hasProtein ? ` · ${total.protein}` : ''}</span>
          {rating > 0 && <><span className="dot">·</span><span className="stars">★ {rating}</span></>}
        </span>
      </span>
    </button>
  );
}
