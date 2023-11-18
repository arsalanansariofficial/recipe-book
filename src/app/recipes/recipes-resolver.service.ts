import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { map, of, switchMap, take } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Recipe } from './recipe.model';
import { AppState } from '../store/app.reducer';
import { selectRecipes } from './store/recipe.selectors';
import { FetchRecipes, SET_RECIPES } from './store/recipe.actions';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private store: Store<AppState>, private actions: Actions) {}
  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    return this.store.select(selectRecipes).pipe(
      take(1),
      map(recipes => recipes.recipes),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(new FetchRecipes());
          return this.actions.pipe(ofType(SET_RECIPES), take(1));
        }
        return of(recipes);
      })
    );
  }
}
