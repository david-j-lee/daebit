import { Routes, RouterModule } from '@angular/router';

import { AppGuard } from 'core/guards/app.guard';

import { PrivateLayoutComponent } from 'ui/private-layout/private-layout.component';

import { GradebookComponent } from './gradebook.component';
import { GradebookDashboardComponent } from 'gradebook/components/gradebook-dashboard/gradebook-dashboard.component';
import { GradebookListingComponent } from 'gradebook/components/gradebook-listing/gradebook-listing.component';
import { ClassAddComponent } from 'gradebook/components/class-add/class-add.component';
import { ClassDeleteComponent } from 'gradebook/components/class-delete/class-delete.component';
import { ClassEditComponent } from 'gradebook/components/class-edit/class-edit.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AppGuard],
    component: PrivateLayoutComponent,
    children: [
      {
        path: 'gradebooks',
        component: GradebookComponent,
        children: [
          {
            path: '',
            component: GradebookListingComponent,
            children: [{ path: 'add', component: ClassAddComponent }]
          }
        ]
      },
      {
        path: 'gradebook/:id',
        component: GradebookComponent,
        children: [
          {
            path: '',
            component: GradebookDashboardComponent,
            children: [
              { path: 'add', component: ClassAddComponent },
              { path: 'delete', component: ClassDeleteComponent },
              { path: 'edit', component: ClassEditComponent }
            ]
          }
        ]
      }
    ]
  }
];

export const GradebookRouting = RouterModule.forChild(routes);
