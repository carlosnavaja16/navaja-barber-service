import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'navaja-button',
  template: `
    <div class="grid grid-cols-1 grid-rows-1">
      <button
        color="primary"
        class="col-span-full row-span-full rounded-md w-full h-8 -mt-1 -ml-1 hover:-mt-0.5 hover:-ml-0.5 active:m-0 transition-all duration-25"
        [ngClass]="{
          'sm:w-32' : fullWidth === false,
          'bg-blue-600 text-white disabled:bg-blue-300 hover:bg-blue-700 active:bg-blue-800' : theme === 'mt-blue-sky',
          'bg-slate-200 text-black disabled:text-slate-500 hover:bg-slate-400 active:bg-slate-600' : theme === 'el-cap-slate',
        }"
        [disabled]="disabled"
        (click)="onClick()"
      >
        <div class="flex justify-between items-center">
          <div>
          </div>
          <div>
            <ng-content />
          </div>
          <div class="flex h-4">
            <mat-progress-spinner class="white-spinner" mode="indeterminate" />
          </div>
        </div>
      </button>
      <div
        class="rounded-md col-span-full row-span-full bg-black w-full h-8 -z-10"
        [ngClass]="fullWidth ? '' : 'sm:w-32'"></div>
    </div>
  `,
})
export class NavajaButtonComponent {
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() theme: 'mt-blue-sky' | 'el-cap-slate' = 'mt-blue-sky';
  @Output() click = new EventEmitter<void>();

  onClick() {
    this.click.emit();
  }
}
