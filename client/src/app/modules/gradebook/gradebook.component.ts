import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { MatTableDataSource, MatDialog } from '@angular/material';

import { NavbarService, Modules } from 'ui/navbar/navbar.service';
import { AccountService } from 'account/services/account.service';
import { GradebookService } from 'gradebook/services/gradebook.service';
import { ClassService } from 'gradebook/services/api/class.service';

import { ToolbarComponent } from 'gradebook/components/toolbar/toolbar.component';
import { GradeBarsComponent } from 'gradebook/components/grade-bars/grade-bars.component';
import { ItemTableComponent } from 'gradebook/components/item-table/item-table.component';
import { ClassAddComponent } from 'gradebook/components/class-add/class-add.component';
import { ClassDeleteComponent } from 'gradebook/components/class-delete/class-delete.component';
import { ClassEditComponent } from 'gradebook/components/class-edit/class-edit.component';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-gradebook',
  templateUrl: './gradebook.component.html',
  styleUrls: ['./gradebook.component.scss']
})
export class GradebookComponent implements OnInit {
  // @ViewChild(ToolbarComponent) toolBar: ToolbarComponent;
  // @ViewChild(ItemTableComponent) itemTable: ItemTableComponent;
  // @ViewChild(GradeBarsComponent) gradeBars: GradeBarsComponent;

  // @Output() requestGoalSeek = new EventEmitter<number>();

  constructor(
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public matDialog: MatDialog,
    private userService: AccountService,
    public gradebookService: GradebookService,
    private classService: ClassService,
    private navBarService: NavbarService
  ) {}

  ngOnInit() {
    this.title.setTitle('Daebit - Grades');
    this.navBarService.setToActive(Modules.gradebook);

    if (this.gradebookService.classes === undefined) {
      this.getClasses();
    }
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id === undefined) {
        this.gradebookService.selectedClass = undefined;
      }
    });
  }

  private getClasses() {
    this.classService.getAll().subscribe(result => {
      if (result) {
        this.gradebookService.classes = result;
        this.gradebookService.isLoaded = true;
        return this.gradebookService.classes;
      }
    });
  }
}
