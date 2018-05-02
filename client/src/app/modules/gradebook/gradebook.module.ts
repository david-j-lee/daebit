import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from 'material/material.module';
import { UiModule } from 'ui/ui.module';
import { CoreModule } from 'core/core.module';
import { AccountModule } from 'account/account.module';

import { GradebookRouting } from 'gradebook/gradebook.routing';
import { GradebookService } from 'gradebook/services/gradebook.service';
import { GradebookCalcService } from 'gradebook/services/gradebook-calc.service';
import { ItemService } from 'gradebook/services/api/item.service';
import { ClassService } from 'gradebook/services/api/class.service';

import { GradebookComponent } from './gradebook.component';
import { GradebookListingComponent } from 'gradebook/components/gradebook-listing/gradebook-listing.component';
import { GradebookDashboardComponent } from 'gradebook/components/gradebook-dashboard/gradebook-dashboard.component';
import { GettingStartedComponent } from 'gradebook/components/getting-started/getting-started.component';
import { ItemTableComponent } from 'gradebook/components/item-table/item-table.component';
import { GradeBarsComponent } from 'gradebook/components/grade-bars/grade-bars.component';
import { ClassStatsComponent } from 'gradebook/components/class-stats/class-stats.component';
import { ToolbarComponent } from 'gradebook/components/toolbar/toolbar.component';

import {
  ClassAddComponent,
  ClassAddDialogComponent
} from 'gradebook/components/class-add/class-add.component';
import {
  ClassDeleteComponent,
  ClassDeleteDialogComponent
} from 'gradebook/components/class-delete/class-delete.component';
import {
  ClassEditComponent,
  ClassEditDialogComponent
} from 'gradebook/components/class-edit/class-edit.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    UiModule,
    AccountModule,
    GradebookRouting
  ],
  declarations: [
    GradebookComponent,
    GradebookDashboardComponent,
    GradebookListingComponent,
    GettingStartedComponent,
    ItemTableComponent,
    GradeBarsComponent,
    ToolbarComponent,
    ClassStatsComponent,
    ClassAddComponent,
    ClassAddDialogComponent,
    ClassEditComponent,
    ClassEditDialogComponent,
    ClassDeleteComponent,
    ClassDeleteDialogComponent
  ],
  entryComponents: [
    ClassAddDialogComponent,
    ClassEditDialogComponent,
    ClassDeleteDialogComponent
  ],
  providers: [ClassService, ItemService, GradebookService, GradebookCalcService]
})
export class GradebookModule {}
