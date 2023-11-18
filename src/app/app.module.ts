import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BrowserModule } from '@angular/platform-browser';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { AppComponent } from './app.component';
import { appReducer } from './store/app.reducer';
import { SharedModule } from './shared/shared.module';
import { AuthEffects } from './auth/store/auth.effects';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from './header/header.component';
import { RecipeEffects } from './recipes/store/recipe.effects';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    StoreModule.forRoot(appReducer),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot(),
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    EffectsModule.forRoot([AuthEffects, RecipeEffects])
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
