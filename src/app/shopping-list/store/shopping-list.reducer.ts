import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export type State = {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
};

const initialState: State = {
  editedIngredient: null,
  editedIngredientIndex: -1,
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)]
};

export function shoppingListReducer(
  state: State = initialState,
  action: ShoppingListActions.Actions
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return { ...state, ingredients: [...state.ingredients, action.payload] };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = { ...state.ingredients[state.editedIngredientIndex] };
      const updatedIngredient = { ...ingredient, ...action.payload };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1,
        ingredients: updatedIngredients
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1,
        ingredients: state.ingredients.filter(
          (_ingredient, index) => index !== state.editedIngredientIndex
        )
      };
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] }
      };
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      };
    default:
      return state;
  }
}
