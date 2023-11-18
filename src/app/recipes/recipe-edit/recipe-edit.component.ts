import { Store } from '@ngrx/store';
import { Subscription, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { AppState } from 'src/app/store/app.reducer';
import { selectRecipes } from '../store/recipe.selectors';
import { AddRecipe, UpdateRecipe } from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  recipeSubscription: Subscription;

  get ingredientControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = Number(params['id']);
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  ngOnDestroy(): void {
    if (this.recipeSubscription) this.recipeSubscription.unsubscribe();
  }

  private initForm() {
    let recipeName;
    let recipeImagePath;
    let recipeDescription;
    let recipeIngredients = new FormArray([]);
    if (this.editMode) {
      this.recipeSubscription = this.store
        .select(selectRecipes)
        .pipe(
          map(recipes =>
            recipes.recipes.find((_recipe, index) => index === this.id)
          )
        )
        .subscribe(recipe => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;
          if (recipe.ingredients) {
            recipe.ingredients.forEach(ingredient => {
              recipeIngredients.push(
                new FormGroup({
                  name: new FormControl(ingredient.name, Validators.required),
                  amount: new FormControl(ingredient.amount, [
                    Validators.required,
                    Validators.pattern('^[1-9]+[0-9]*$')
                  ])
                })
              );
            });
          }
        });
    }
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }

  onSubmit() {
    if (this.editMode)
      this.store.dispatch(
        new UpdateRecipe({ index: this.id, newRecipe: this.recipeForm.value })
      );
    else this.store.dispatch(new AddRecipe(this.recipeForm.value));
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  onAddIngredient() {
    const formIngredients = this.recipeForm.get('ingredients') as FormArray;
    formIngredients.push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern('^[1-9]+[0-9]*$')
        ])
      })
    );
  }

  onDeleteIngredient(index: number) {
    const formArray = this.recipeForm.get('ingredients') as FormArray;
    formArray.removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
