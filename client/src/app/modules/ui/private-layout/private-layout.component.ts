import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';

import { ThemeService } from 'material/services/theme.service';
import { GradebookService } from 'gradebook/services/gradebook.service';
import { AccountService } from 'account/services/account.service';

@Component({
    selector: 'app-private-layout',
    templateUrl: 'private-layout.component.html',
    styleUrls: ['private-layout.component.scss']
})

export class PrivateLayoutComponent implements OnInit {

    mobileQuery: MediaQueryList;

    private _mobileQueryListener: () => void;

    constructor(
        media: MediaMatcher,
        changeDetectorRef: ChangeDetectorRef,
        overlayContainer: OverlayContainer,
        public themeService: ThemeService,
        private gradebookService: GradebookService,
        private userService: AccountService
    ) {
        if (this.themeService.selectedTheme !== undefined && this.themeService.selectedTheme.class !== '') {
            overlayContainer.getContainerElement().classList.add(this.themeService.selectedTheme.class);
        }
        this.mobileQuery = media.matchMedia('(max-width: 900px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit() {
    }
}
