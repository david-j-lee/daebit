import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { AccountService } from 'account/services/account.service';
import { GradebookService } from 'gradebook/services/gradebook.service';
import { ItemService } from 'gradebook/services/api/item.service';

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
    private userService: AccountService,
    public gradebookService: GradebookService,
    private itemService: ItemService
  ) {}

  ngOnInit() {}

  private delete(id: any) {
    if (id !== undefined) {
      this.itemService.delete(id).subscribe(result => {
        if (result) {
          // delete from items
          const selectedClassItem = this.gradebookService.selectedClass.items.find(
            x => x.id == id
          );
          this.gradebookService.selectedClass.items = this.gradebookService.selectedClass.items.filter(
            x => x !== selectedClassItem
          );

          this.gradebookService.setDataSource(false);
          this.gradebookService.updateClassStats();
        }
      });
    }
  }

  private save(item: Item, updateClassStats: boolean) {
    if (updateClassStats) {
      this.gradebookService.updateClassStats();
    }

    if (item.id === null || item.id === undefined) {
      // add
      const itemAdd: ItemAdd = {
        classId: this.gradebookService.selectedClass.id,
        isCompleted: item.isCompleted,
        description: item.description,
        dateDue: item.dateDue,
        earned: item.earned,
        possible: item.possible,
        weight: item.weight
      };
      return this.itemService.add(itemAdd).subscribe(result => {
        if (result) {
          item.id = result;
          item.grade = this.gradebookService.calculateGrade(
            item.earned,
            item.possible
          );
          this.gradebookService.setDataSource(true);
          return true;
        }
      });
    } else {
      // update
      const itemEdit: ItemEdit = {
        id: item.id,
        isCompleted: item.isCompleted,
        description: item.description,
        dateDue: item.dateDue,
        earned: item.earned,
        possible: item.possible,
        weight: item.weight
      };
      return this.itemService.update(itemEdit).subscribe(result => {
        if (result) {
          item.grade = this.gradebookService.calculateGrade(
            item.earned,
            item.possible
          );
          return true;
        }
      });
    }
  }
}
