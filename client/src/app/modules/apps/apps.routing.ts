import { Routes, RouterModule } from '@angular/router';

import { AppGuard } from 'core/guards/app.guard';

import { AppsComponent } from './apps.component';
import { AboutComponent } from 'app/modules/apps/components/about/about.component';
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
  {
    path: 'budgets/about', component: AboutComponent, children: [
      { path: '', component: BudgetsComponent }
    ]
  },
  {
    path: 'gradebooks/about', component: AboutComponent, children: [
      { path: '', component: GradebooksComponent }
    ]
  }
];

export const AppsRouting = RouterModule.forRoot(homeRoutes);
