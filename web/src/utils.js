export function getPerServingTotal(recipe){
  return recipe.nutrition.totals.find(t => t.perServing) || recipe.nutrition.totals[recipe.nutrition.totals.length - 1];
}
