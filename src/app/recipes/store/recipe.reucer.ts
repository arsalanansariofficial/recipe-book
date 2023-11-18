import { Recipe } from '../recipe.model';
import { Ingredient } from 'src/app/shared/ingredient.model';
import {
  ADD_RECIPE,
  DELETE_RECIPE,
  RecipeActions,
  SET_RECIPES,
  UPDATE_RECIPE
} from './recipe.actions';

export type State = {
  recipes: Recipe[];
};

const initialState: State = {
  recipes: [
    new Recipe(
      'Apple Juice',
      'Apple Juice',
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [new Ingredient('Apples', 3)]
    ),
    new Recipe(
      'Pomegranate Juice',
      'Pomegranate Juice',
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [new Ingredient('Pomegranate', 1)]
    )
  ]
};

export function recipeReducer(state = initialState, action: RecipeActions) {
  switch (action.type) {
    case SET_RECIPES:
      return {
        ...state,
        recipes: action.payload
      };
    case ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case UPDATE_RECIPE:
      const updatedRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.newRecipe
      };
      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.index] = updatedRecipe;
      return {
        ...state,
        recipes: updatedRecipes
      };
    case DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter(
          (_recipes, index) => index !== action.payload
        )
      };
    default:
      return state;
  }
}
