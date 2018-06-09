import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { ScrollTopService } from 'core/services/scroll-top.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  isSidenavOpen = false;

  private _mobileQueryListener: () => void;

  constructor(
    private scrollTopService: ScrollTopService,
    changeDetectorRef: ChangeDetectorRef,
    mediaMatcher: MediaMatcher) {
    this.mobileQuery = mediaMatcher.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.scrollTopService.setScrollTop();
  }

  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  toggleMenu() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
