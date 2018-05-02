import { Component, OnInit } from '@angular/core';

import { GradebookService } from 'gradebook/services/gradebook.service';

@Component({
    selector: 'app-grade-bars',
    templateUrl: './grade-bars.component.html',
    styleUrls: ['./grade-bars.component.scss']
})
export class GradeBarsComponent implements OnInit {

    constructor(
        public gradebookService: GradebookService
    ) {
    }

    ngOnInit() {

    }
}
