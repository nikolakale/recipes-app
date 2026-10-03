import CategoryFilters from "./CategoryFilters.jsx";
import RecipeCard from "./RecipeCard.jsx";

export default function RecipeList({ recipes, activeCategory, onCategoryChange, onOpen }){
  return (
    <div id="listView">
      <CategoryFilters active={activeCategory} onChange={onCategoryChange} />
      <div className="list">
        {recipes.length === 0 && <div className="empty-list">Nema recepata u ovoj kategoriji.</div>}
        {recipes.map(r => <RecipeCard key={r.id} recipe={r} onOpen={onOpen} />)}
      </div>
    </div>
  );
}
