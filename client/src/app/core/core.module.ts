import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SearchPipe } from 'core/pipes/search.pipe';
import { SortByPipe } from 'core/pipes/sort.pipe';
import { FilterPipe } from 'core/pipes/filter.pipe';

import { EqualValidator } from 'core/directives/equal-validator.directive';

import { AppGuard } from 'core/guards/app.guard';

import { ConfigService } from 'core/services/config.service';
import { ParallaxDirective } from 'app/core/directives/parallax.directive';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [EqualValidator, ParallaxDirective, SearchPipe, SortByPipe, FilterPipe],
  exports: [EqualValidator, ParallaxDirective, SearchPipe, SortByPipe, FilterPipe],
  providers: [AppGuard, ConfigService]
})
export class CoreModule {}
