import { AppState } from 'src/app/store/app.reducer';

export function selectRecipes(state: AppState) {
  return state.recipes;
}
