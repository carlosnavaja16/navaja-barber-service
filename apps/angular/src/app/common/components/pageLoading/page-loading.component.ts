import { Component } from '@angular/core';

@Component({
  selector: 'page-loading',
  template: `
    <div class="w-full h-full grid place-items-center">
      <mat-progress-spinner color="primary" mode="indeterminate" />
    </div>
  `
})
export class PageLoadingComponent {}
