import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthInceptorService } from './auth/auth-interceptor.service';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/recipes',
    pathMatch: 'full'
  },
  {
    path: 'recipes',
    loadChildren: () =>
      import('./recipes/recipes.module').then(module => module.RecipesModule)
  },
  {
    path: 'shopping-list',
    loadChildren: () =>
      import('./shopping-list/shopping-list.module').then(
        module => module.ShoppingListModule
      )
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then(module => module.AuthModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInceptorService,
      multi: true
    }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
