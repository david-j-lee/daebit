import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from 'material/material.module';
import { UiModule } from 'ui/ui.module';
import { CoreModule } from 'core/core.module';

import { AccountRouting } from 'account/account.routing';
import { AccountService } from 'account/services/account.service';

import { AccountComponent } from './account.component';
import { UserEditComponent } from 'account/components/user-edit/user-edit.component';
import { ChangePasswordComponent } from 'account/components/change-password/change-password.component';

import { RegisterComponent } from 'account/components/register/register.component';
import { LoginComponent } from 'account/components/login/login.component';
import { ForgotPasswordComponent } from 'account/components/forgot-password/forgot-password.component';
import { ConfirmationComponent } from 'account/components/confirmation/confirmation.component';
import { ResetPasswordComponent } from 'account/components/reset-password/reset-password.component';
import { UserMenuComponent } from 'account/components/user-menu/user-menu.component';
import { ToolbarComponent } from 'account/components/toolbar/toolbar.component';
import { ConfirmEmailComponent } from 'account/components/confirm-email/confirm-email.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    UiModule,
    AccountRouting
  ],
  declarations: [
    AccountComponent,
    ToolbarComponent,
    UserEditComponent,
    ChangePasswordComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    ConfirmationComponent,
    UserMenuComponent,
    ConfirmEmailComponent
  ],
  exports: [UserMenuComponent],
  providers: [AccountService]
})
export class AccountModule {}
