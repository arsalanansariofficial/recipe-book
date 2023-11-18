import { Store } from '@ngrx/store';
import { Component } from '@angular/core';

import { AppState } from './store/app.reducer';
import { AutoLogin } from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(new AutoLogin());
  }
}
