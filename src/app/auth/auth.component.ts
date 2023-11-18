import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  OnDestroy,
  OnInit
} from '@angular/core';

import { AppState } from '../store/app.reducer';
import { selectAuth } from './store/auth.selectors';
import { AlertComponent } from '../shared/alert/alert.component';
import { ClearError, LoginStart, SignupStart } from './store/auth.actions';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private closeSubscription: Subscription;
  private storeSubscription: Subscription;
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  private showErrorAlert(message: string) {
    // To get the space for rendering the 'Alert Component'
    const hostViewContainerReference = this.alertHost.viewContainerReference;

    // Provices the 'Alert Component' that is to be rendered in view container
    const alertComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    // Clear previously rendered content
    hostViewContainerReference.clear();

    // Render the 'Alert Component' in the view container
    const componentReference = hostViewContainerReference.createComponent(
      alertComponentFactory
    );

    // Provides the message to the alert component
    componentReference.instance.message = String(message);

    // Removes the alert component from the view container
    this.closeSubscription = componentReference.instance.close.subscribe(() => {
      this.closeSubscription.unsubscribe();
      hostViewContainerReference.clear();
    });
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.storeSubscription = this.store
      .select(selectAuth)
      .subscribe(authState => {
        this.isLoading = authState.loading;
        this.error = authState.authError;
        if (this.error) this.showErrorAlert(this.error);
      });
  }

  ngOnDestroy() {
    if (this.closeSubscription) this.closeSubscription.unsubscribe();
    if (this.storeSubscription) this.storeSubscription.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError() {
    this.store.dispatch(new ClearError());
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    const email = form.value.email;
    const password = form.value.password;
    if (this.isLoginMode)
      this.store.dispatch(new LoginStart({ email, password }));
    else this.store.dispatch(new SignupStart({ email, password }));
    form.reset();
  }
}
