import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { GradebookService } from 'gradebook/services/gradebook.service';
import { DalItemService } from 'gradebook/services/dal/dal.item.service';

import { Item } from 'gradebook/interfaces/item.interface';
import { ItemAdd } from 'gradebook/interfaces/item-add.interface';
import { ItemEdit } from 'gradebook/interfaces/item-edit.interface';

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.scss']
})
export class ItemTableComponent implements OnInit {
  constructor(
    public gradebookService: GradebookService,
    private dalItemService: DalItemService
  ) {}

  ngOnInit() {
    this.dalItemService
      .getAll(this.gradebookService.selectedClass.id)
      .subscribe();
  }

  public delete(id: any) {
    if (id !== undefined) {
      this.dalItemService.delete(id).subscribe(result => {
        // handle if failed
      });
    }
  }

  public save(item: Item, updateClassStats: boolean) {
    if (updateClassStats) {
      this.gradebookService.updateClassStats();
    }
    if (item.id === null || item.id === undefined) {
      return this.dalItemService.add(item).subscribe(result => {
        // handle if failed
      });
    } else {
      return this.dalItemService.update(item).subscribe(result => {
        // handle if failed
      });
    }
  }
}
