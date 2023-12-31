// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const ADMIN = {
  userId: '001',
  password: 'administrator',
  token: 'admin-pass',
  email: 'admin@test.com',
  expiresIn: null
};

export const environment = {
  production: false,
  dataURL: 'https://recipe-book-6bb2b-default-rtdb.firebaseio.com/recipes.json',
  signupURL:
    'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=',
  loginURL:
    'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=',
  firebaseAPIKey: 'AIzaSyDMOs3u01ncoJi3mBXJRhJyz0kkxMCGZHE'
};
