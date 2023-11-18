import { AppState } from "src/app/store/app.reducer";


export function selectIngredients(state: AppState) {
  return state.shoppingList.ingredients;
}

export function selectShoppingList(state: AppState) {
  return state.shoppingList;
}
