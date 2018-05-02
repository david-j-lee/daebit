import { Component, OnInit } from '@angular/core';

import { GradebookService } from 'gradebook/services/gradebook.service';

@Component({
    selector: 'app-class-stats',
    templateUrl: './class-stats.component.html',
    styleUrls: ['./class-stats.component.scss']
})
export class ClassStatsComponent implements OnInit {

    constructor(
        public gradebookService: GradebookService
    ) {
    }

    ngOnInit() {

    }
}
