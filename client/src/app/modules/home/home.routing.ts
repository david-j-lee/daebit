import { Routes, RouterModule } from '@angular/router';

import { AppGuard } from 'core/guards/app.guard';

import { PublicLayoutComponent } from 'ui/public-layout/public-layout.component';
import { HomeComponent } from './home.component';

const homeRoutes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [{ path: '', component: HomeComponent, pathMatch: 'full' }]
  }
];

export const HomeRouting = RouterModule.forRoot(homeRoutes);
