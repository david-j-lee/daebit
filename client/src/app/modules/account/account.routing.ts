import { Routes, RouterModule } from '@angular/router';

import { AppGuard } from 'core/guards/app.guard';

import { PrivateLayoutComponent } from 'ui/private-layout/private-layout.component';
import { PublicLayoutComponent } from 'ui/public-layout/public-layout.component';

import { AccountComponent } from './account.component';
import { UserEditComponent } from 'account/components/user-edit/user-edit.component';
import { ChangePasswordComponent } from 'account/components/change-password/change-password.component';

import { ConfirmationComponent } from 'account/components/confirmation/confirmation.component';
import { ForgotPasswordComponent } from 'account/components/forgot-password/forgot-password.component';
import { LoginComponent } from 'account/components/login/login.component';
import { RegisterComponent } from 'account/components/register/register.component';
import { ResetPasswordComponent } from 'account/components/reset-password/reset-password.component';
import { ConfirmEmailComponent } from 'account/components/confirm-email/confirm-email.component';

const routes: Routes = [
  {
    path: 'account',
    component: PublicLayoutComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'register/:returnUrl', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'login/:returnUrl', component: LoginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'forgot-password/:returnUrl', component: ForgotPasswordComponent },
      { path: 'confirmation', component: ConfirmationComponent },
      { path: 'confirmation/:returnUrl', component: ConfirmationComponent },
      { path: 'confirm-email', component: ConfirmEmailComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'reset-password/:returnUrl', component: ResetPasswordComponent }
    ]
  },
  {
    path: 'account',
    canActivate: [AppGuard],
    component: PrivateLayoutComponent,
    children: [
      {
        path: '',
        component: AccountComponent,
        children: [
          { path: 'me', component: UserEditComponent },
          { path: 'me/change-password', component: ChangePasswordComponent }
        ]
      }
    ]
  }
];

export const AccountRouting = RouterModule.forChild(routes);
