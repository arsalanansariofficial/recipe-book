import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ShoppingListComponent } from './shopping-list.component';

const shoppingListRoutes = [
  {
    path: '',
    component: ShoppingListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(shoppingListRoutes)],
  exports: [RouterModule]
})
export class ShoppingListRoutingModule {}
