import { useState } from "react";
import { useAppData } from "../AppData.jsx";

const STAR_PATH = "M12 2.5l2.9 6.4 6.9.7-5.2 4.7 1.5 6.9L12 17.8l-6.1 3.4 1.5-6.9-5.2-4.7 6.9-.7z";

export default function RatingWidget({ recipeId }){
  const { getRating, setRating } = useAppData();
  const [hover, setHover] = useState(0);
  const current = getRating(recipeId);
  const shown = hover || current;

  return (
    <div className="rating" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          className={"star" + (i <= shown ? " filled" : "")}
          aria-label={`Oceni sa ${i} od 5 zvezdica`}
          onMouseOver={() => setHover(i)}
          onClick={() => setRating(recipeId, i === current ? 0 : i)}
        >
          <svg viewBox="0 0 24 24"><path d={STAR_PATH} /></svg>
        </button>
      ))}
    </div>
  );
}
