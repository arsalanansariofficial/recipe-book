import { Store } from '@ngrx/store';
import { Observable, exhaustMap, map, take } from 'rxjs';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest
} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { AppState } from '../store/app.reducer';
import { selectAuth } from './store/auth.selectors';

@Injectable()
export class AuthInceptorService implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.select(selectAuth).pipe(
      take(1),
      map(authState => authState.user),
      exhaustMap(user => {
        if (!user) return next.handle(req);
        const modifiedRequest = req.clone({
          params: new HttpParams().set('auth', user.token)
        });
        return next.handle(modifiedRequest);
      })
    );
  }
}
