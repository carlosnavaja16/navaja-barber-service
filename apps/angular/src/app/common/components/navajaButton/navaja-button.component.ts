import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "navaja-button",
  template: `
    <div class="grid grid-cols-1 grid-rows-1">
      <button
        class="col-span-full row-span-full rounded border disabled:border-slate-400 border-black z-10 p-2 h-10 -mt-1 -ml-1 hover:-mt-0.5 hover:-ml-0.5 active:m-0 transition-all duration-25"
        [ngClass]="{
          'w-16' : width === 'sm',
          'w-32' : width === 'md',
          'w-full' : width === 'full',
          'bg-blue-600 text-white disabled:bg-blue-300 active:bg-blue-700' : theme === 'mt-blue-sky',
          'bg-slate-200 text-black disabled:text-slate-500 active:bg-slate-400' : theme === 'el-cap-slate'
        }"
        [disabled]="disabled"
        (click)="onClick()"
      >
        <div class="flex justify-between items-center h-6">
          <div class="w-4">
          </div>
          <div>
            <ng-content />
          </div>
          <div class="flex w-4">
            @if (loading) {
              <mat-progress-spinner class="white-spinner" mode="indeterminate" />
            }
          </div>
        </div>
      </button>
      <div
        class="rounded col-span-full row-span-full bg-black h-10"
        [ngClass]="{
          'w-16' : width === 'sm',
          'w-32' : width === 'md',
          'w-full' : width === 'full',
          'bg-slate-400': disabled
        }"
      
      ></div>
    </div>
  `
})
export class NavajaButtonComponent {
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() width: 'sm' | 'md' | 'full' = 'sm';
  @Input() theme: "mt-blue-sky" | "el-cap-slate" = "mt-blue-sky";
  @Output() click = new EventEmitter<void>();

  onClick() {
    this.click.emit();
  }
}
