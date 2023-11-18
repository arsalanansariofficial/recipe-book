import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { User } from '../user.model';
import { AppState } from 'src/app/store/app.reducer';
import { ADMIN, environment } from 'src/environments/environment';
import { AuthResponseData } from '../auth-response-data.interface';
import {
  AUTHENTICATE_SUCCESS,
  AUTO_LOGIN,
  AuthenticateFail,
  AuthenticateSuccess,
  LOGIN_START,
  LOGOUT,
  LoginStart,
  Logout,
  SIGNUP_START,
  SignupStart
} from './auth.actions';

const getRequestConfig = (
  authData: SignupStart | LoginStart,
  type = 'login'
) => {
  let requestURL = environment.loginURL.concat(environment.firebaseAPIKey);
  if (type.match('signup'))
    requestURL = environment.signupURL.concat(environment.firebaseAPIKey);
  const requestBody = {
    email: authData.payload.email,
    password: authData.payload.password,
    returnSecureToken: true
  };
  return { requestURL, requestBody };
};

const handleAuthentication = (
  response: AuthResponseData,
  autoLogout: (expirationDuration: number) => void
) => {
  let expiresIn = ADMIN.expiresIn
    ? ADMIN.expiresIn
    : Number(response.expiresIn);
  if (isNaN(expiresIn)) expiresIn = 3600;
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(
    response.email,
    response.localId,
    response.idToken,
    expirationDate
  );
  autoLogout(expiresIn * 1000);
  sessionStorage.setItem('userData', JSON.stringify(user));
  return new AuthenticateSuccess({
    email: response.email,
    userId: response.localId,
    token: response.idToken,
    expirationDate: expirationDate,
    redirect: true
  });
};

const handleError = (errorResponse: { error: { error: { message: any } } }) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthenticateFail(errorMessage));
  }
  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct.';
      break;
    case 'INVALID_LOGIN_CREDENTIALS':
      errorMessage = 'Incorrect email or password.';
      break;
  }
  return of(new AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  tokenExpirationTimer: any;

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(
      () => this.store.dispatch(new Logout()),
      expirationDuration
    );
  }

  autoLogin = createEffect(() =>
    this.actions.pipe(
      ofType(AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(sessionStorage.getItem('userData'));
        if (!userData) return { type: 'DEFAULT' };
        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );
        if (loadedUser.token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.autoLogout(expirationDuration);
          return new AuthenticateSuccess({
            email: loadedUser.email,
            token: loadedUser.token,
            userId: loadedUser.id,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false
          });
        }
        return { type: 'DEFAULT' };
      })
    )
  );

  authSignup = createEffect(() =>
    this.actions.pipe(
      ofType(SIGNUP_START),
      switchMap((authData: SignupStart) => {
        return this.http
          .post<AuthResponseData>(
            getRequestConfig(authData, 'signup').requestURL,
            getRequestConfig(authData).requestBody
          )
          .pipe(
            map(response =>
              handleAuthentication(response, this.autoLogout.bind(this))
            ),
            catchError(errorResponse => handleError(errorResponse))
          );
      })
    )
  );

  authLogin = createEffect(() =>
    this.actions.pipe(
      ofType(LOGIN_START),
      switchMap((authData: LoginStart) => {
        if (authData.payload.email.match(ADMIN.email)) {
          const response: AuthResponseData = {
            kind: 'kind',
            email: ADMIN.email,
            idToken: ADMIN.token,
            localId: ADMIN.userId,
            expiresIn: String(ADMIN.expiresIn),
            refreshToken: 'true'
          };
          return of(handleAuthentication(response, this.autoLogout.bind(this)));
        }
        return this.http
          .post<AuthResponseData>(
            getRequestConfig(authData).requestURL,
            getRequestConfig(authData).requestBody
          )
          .pipe(
            map(response =>
              handleAuthentication(response, this.autoLogout.bind(this))
            ),
            catchError(errorResponse => handleError(errorResponse))
          );
      })
    )
  );

  authSuccess = createEffect(
    () =>
      this.actions.pipe(
        ofType(AUTHENTICATE_SUCCESS),
        tap((authenticateSuccess: AuthenticateSuccess) => {
          if (authenticateSuccess.payload.redirect) this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  logout = createEffect(
    () =>
      this.actions.pipe(
        ofType(LOGOUT),
        tap(() => {
          if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
          }
          sessionStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions: Actions,
    private http: HttpClient,
    private router: Router,
    private store: Store<AppState>
  ) {}
}
