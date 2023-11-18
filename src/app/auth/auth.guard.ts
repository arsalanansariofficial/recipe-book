import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';

import { AppState } from '../store/app.reducer';
import { selectAuth } from './store/auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store<AppState>) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.store.select(selectAuth).pipe(
      take(1),
      map(authState => authState.user),
      map(user => {
        if (user) return true;
        return this.router.createUrlTree(['/auth']);
      })
    );
  }
}
