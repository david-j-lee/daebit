import { Injectable } from '@angular/core';

import { NavbarItem } from 'ui/navbar/navbar-item';

export enum Modules {
  dashboard,
  budgets,
  gradebook
}

@Injectable()
export class NavbarService {
  public items: NavbarItem[] = [
    {
      module: Modules.dashboard,
      icon: 'dashboard',
      text: 'Dashboard',
      link: 'dashboard',
      isActive: false
    },
    {
      module: Modules.budgets,
      icon: 'account_balance_wallet',
      text: 'Budgets',
      link: 'budgets',
      isActive: false
    },
    {
      module: Modules.gradebook,
      icon: 'book',
      text: 'Grades',
      link: 'gradebooks',
      isActive: false
    }
  ];

  constructor() {}

  setToActive(module: Modules | null) {
    this.items.forEach(item => {
      if (item.module === module) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
    });
  }
}
