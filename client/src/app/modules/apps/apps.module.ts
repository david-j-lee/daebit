import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from 'material/material.module';
import { CoreModule } from 'core/core.module';
import { UiModule } from 'ui/ui.module';
import { AccountModule } from 'account/account.module';

import { AppsRouting } from './apps.routing';
import { AppsComponent } from './apps.component';
import { AboutComponent } from 'apps/components/about/about.component';
import { ListingComponent } from 'apps/components/listing/listing.component';
import { GradebooksComponent } from 'apps/components/gradebooks/gradebooks.component';
import { BudgetsComponent } from 'apps/components/budgets/budgets.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    CoreModule,
    UiModule,
    AccountModule,
    AppsRouting
  ],
  declarations: [
    AppsComponent,
    AboutComponent,
    ListingComponent,
    BudgetsComponent,
    GradebooksComponent
  ]
})
export class AppsModule {}
