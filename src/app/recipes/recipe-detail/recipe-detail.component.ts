import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

import { Recipe } from '../recipe.model';
import { AppState } from 'src/app/store/app.reducer';
import { DeleteRecipe } from '../store/recipe.actions';
import { selectRecipes } from '../store/recipe.selectors';
import { AddIngredients } from 'src/app/shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html'
})
export class RecipeDetailComponent implements OnInit {
  @Input() recipe: Recipe;
  id: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map(params => Number(params['id'])),
        switchMap(id => {
          this.id = id;
          return this.store.select(selectRecipes);
        }),
        map(recipes =>
          recipes.recipes.find((_recipe, index) => index === this.id)
        )
      )
      .subscribe(recipe => {
        this.recipe = recipe;
      });
  }

  addToShoppingList() {
    this.store.dispatch(new AddIngredients(this.recipe.ingredients));
  }

  onDeleteRecipe() {
    this.store.dispatch(new DeleteRecipe(this.id));
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
