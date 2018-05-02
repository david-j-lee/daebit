import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ParallaxDirective } from 'core/directives/parallax.directive';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(
        private title: Title
    ) {
        this.title.setTitle('Daebit - Welcome');
    }

    ngOnInit() {
    }
}
