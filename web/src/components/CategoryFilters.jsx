import { CATEGORIES } from "../data.js";

export default function CategoryFilters({ active, onChange }){
  const cats = ["Sve", ...CATEGORIES];
  return (
    <div className="filters">
      {cats.map(cat => (
        <button
          key={cat}
          className={"chip" + (cat === active ? " active" : "")}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
