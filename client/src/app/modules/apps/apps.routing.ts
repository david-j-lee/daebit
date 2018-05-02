import { Routes, RouterModule } from '@angular/router';

import { AppGuard } from 'core/guards/app.guard';

import { PrivateLayoutComponent } from 'ui/private-layout/private-layout.component';
import { AppsComponent } from './apps.component';
import { ListingComponent } from 'apps/components/listing/listing.component';
import { BudgetsComponent } from 'apps/components/budgets/budgets.component';
import { GradebooksComponent } from 'apps/components/gradebooks/gradebooks.component';

const homeRoutes: Routes = [
  {
    path: 'apps',
    canActivate: [AppGuard],
    component: AppsComponent,
    children: [{ path: '', component: ListingComponent }]
  },
  { path: 'budgets/about', component: BudgetsComponent },
  { path: 'gradebooks/about', component: GradebooksComponent }
];

export const AppsRouting = RouterModule.forRoot(homeRoutes);
