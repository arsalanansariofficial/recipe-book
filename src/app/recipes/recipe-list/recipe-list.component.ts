import { Store } from '@ngrx/store';
import { Subscription, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Recipe } from '../recipe.model';
import { AppState } from 'src/app/store/app.reducer';
import { selectRecipes } from '../store/recipe.selectors';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html'
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.store
      .select(selectRecipes)
      .pipe(map(recipes => recipes.recipes))
      .subscribe(recipes => (this.recipes = recipes));
  }

  addNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.activateRoute });
  }
}
