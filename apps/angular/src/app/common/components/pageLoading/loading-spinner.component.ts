import { Component } from '@angular/core';

@Component({
  selector: 'loading-spinner',
  template: `
    <div class="w-full grid place-items-center">
      <mat-progress-spinner color="primary" mode="indeterminate" />
    </div>
  `
})
export class LoadingSpinnerComponent {}
