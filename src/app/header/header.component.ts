import { map } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { User } from '../auth/user.model';
import { AppState } from '../store/app.reducer';
import { Logout } from '../auth/store/auth.actions';
import { ADMIN } from 'src/environments/environment';
import { Subscription } from 'rxjs/internal/Subscription';
import { selectAuth } from '../auth/store/auth.selectors';
import { FetchRecipes, StoreRecipes } from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  ADMIN = ADMIN;
  user: User;
  collapsed = true;
  private userSubscription: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.userSubscription = this.store
      .select(selectAuth)
      .pipe(map(authState => authState.user))
      .subscribe(user => (this.user = user));
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  saveRecipes() {
    this.store.dispatch(new StoreRecipes());
  }

  fetchRecipes() {
    this.store.dispatch(new FetchRecipes());
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}
