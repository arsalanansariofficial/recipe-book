import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';

import { AppState } from '../store/app.reducer';
import { Ingredient } from '../shared/ingredient.model';
import { StartEdit } from './store/shopping-list.actions';
import { selectIngredients } from './store/shopping-list.selectors';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent {
  ingredients: Observable<Ingredient[]>;

  constructor(private store: Store<AppState>) {
    this.ingredients = this.store.select(selectIngredients);
  }

  onEditIngredient(index: number) {
    this.store.dispatch(new StartEdit(index));
  }
}
