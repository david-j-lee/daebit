import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from 'material/material.module';
import { CoreModule } from 'core/core.module';
import { NavbarService } from 'ui/navbar/navbar.service';
import { ThemeService } from 'material/services/theme.service';

import { SpinnerComponent } from 'ui/spinner/spinner.component';
import { NavbarComponent } from 'ui/navbar/navbar.component';
import { PrivateLayoutComponent } from 'ui/private-layout/private-layout.component';
import { PublicLayoutComponent } from 'ui/public-layout/public-layout.component';
import { AppMenuComponent } from 'ui/app-menu/app-menu.component';
import { LogoComponent } from 'ui/logo/logo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    CoreModule
  ],
  declarations: [
    SpinnerComponent,
    PublicLayoutComponent,
    PrivateLayoutComponent,
    AppMenuComponent,
    NavbarComponent,
    LogoComponent
  ],
  exports: [AppMenuComponent, SpinnerComponent, LogoComponent],
  providers: [NavbarService, ThemeService]
})
export class UiModule {}
