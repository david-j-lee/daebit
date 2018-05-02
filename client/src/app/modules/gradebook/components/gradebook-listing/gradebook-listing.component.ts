import { Component, OnInit } from '@angular/core';

import { GradebookService } from 'gradebook/services/gradebook.service';

@Component({
  selector: 'app-gradebook-listing',
  templateUrl: './gradebook-listing.component.html',
  styleUrls: ['./gradebook-listing.component.scss']
})
export class GradebookListingComponent implements OnInit {
  constructor(
    public gradebookService: GradebookService
  ) { }

  ngOnInit() { }
}
