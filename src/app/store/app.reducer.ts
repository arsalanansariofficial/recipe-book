import { ActionReducerMap } from '@ngrx/store';

import * as fromAuth from '../auth/store/auth.reducer';
import * as fromRecipes from '../recipes/store/recipe.reucer';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

export type AppState = {
  auth: fromAuth.State;
  shoppingList: fromShoppingList.State;
  recipes: fromRecipes.State;
};

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  shoppingList: fromShoppingList.shoppingListReducer,
  recipes: fromRecipes.recipeReducer
};
