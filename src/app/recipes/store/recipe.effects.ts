import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Recipe } from '../recipe.model';
import { selectRecipes } from './recipe.selectors';
import { AppState } from 'src/app/store/app.reducer';
import { environment } from 'src/environments/environment';
import { FETCH_RECIPES, STORE_RECIPES, SetRecipes } from './recipe.actions';

@Injectable()
export class RecipeEffects {
  fetchRecipes = createEffect(() =>
    this.actions.pipe(
      ofType(FETCH_RECIPES),
      switchMap(() => this.http.get<Recipe[]>(environment.dataURL)),
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      map(recipes => new SetRecipes(recipes))
    )
  );

  storeRecipes = createEffect(
    () =>
      this.actions.pipe(
        ofType(STORE_RECIPES),
        withLatestFrom(this.sotre.select(selectRecipes)),
        switchMap(([_actionData, recipes]: [any, { recipes: Recipe[] }]) =>
          this.http.put(environment.dataURL, recipes.recipes)
        )
      ),
    { dispatch: false }
  );
  
  constructor(
    private actions: Actions,
    private http: HttpClient,
    private sotre: Store<AppState>
  ) {}
}
