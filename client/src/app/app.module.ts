import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AppComponent } from 'app/app.component';
import { MaterialModule } from 'material/material.module';
import { CoreModule } from 'core/core.module';
import { UiModule } from 'ui/ui.module';
import { AccountModule } from 'account/account.module';
import { HomeModule } from 'home/home.module';
import { AppsModule } from 'apps/apps.module';
import { FinanceModule } from 'finance/finance.module';
import { GradebookModule } from 'gradebook/gradebook.module';

import { TokenInterceptor } from 'app/core/interceptors/token.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,

    MaterialModule,
    CoreModule,
    ChartsModule,
    UiModule,
    AccountModule,

    HomeModule,
    AppsModule,
    FinanceModule,
    GradebookModule,

    RouterModule.forRoot([{ path: '**', redirectTo: '' }])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
