import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropdownDirective } from './dropdown.directive';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    DropdownDirective,
    PlaceholderDirective,
    LoadingSpinnerComponent
  ],
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports: [
    FormsModule,
    RouterModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    DropdownDirective,
    PlaceholderDirective,
    LoadingSpinnerComponent
  ]
})
export class SharedModule {}
