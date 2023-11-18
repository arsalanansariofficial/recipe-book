import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgForm } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { AppState } from 'src/app/store/app.reducer';
import { Ingredient } from 'src/app/shared/ingredient.model';
import {
  AddIngredient,
  DeleteIngredient,
  StopEdit,
  UpdateIngredient
} from '../store/shopping-list.actions';
import { selectShoppingList } from '../store/shopping-list.selectors';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html'
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  editMode: boolean;
  editedItem: Ingredient;
  subscription: Subscription;
  @ViewChild('form') form: NgForm;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.subscription = this.store
      .select(selectShoppingList)
      .subscribe(state => {
        if (state.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editedItem = state.editedIngredient;
          this.form.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          });
        } else this.editMode = false;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new StopEdit());
  }

  onSubmit(form: NgForm) {
    const ingredient = new Ingredient(form.value.name, form.value.amount);
    if (this.editMode) this.store.dispatch(new UpdateIngredient(ingredient));
    else this.store.dispatch(new AddIngredient(ingredient));
    this.editMode = false;
    form.reset();
  }

  onDeleteIngredient() {
    this.store.dispatch(new DeleteIngredient());
    this.onClearForm();
  }

  onClearForm() {
    this.form.reset();
    this.editMode = false;
    this.store.dispatch(new StopEdit());
  }
}
