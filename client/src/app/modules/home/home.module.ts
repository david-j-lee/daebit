import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from 'material/material.module';
import { CoreModule } from 'core/core.module';
import { UiModule } from 'ui/ui.module';
import { AccountModule } from 'account/account.module';

import { HomeRouting } from 'home/home.routing';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    CoreModule,
    UiModule,
    AccountModule,
    HomeRouting
  ]
})
export class HomeModule {}
