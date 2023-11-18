import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';

export const authRoutes = [
  {
    path: '',
    component: AuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
