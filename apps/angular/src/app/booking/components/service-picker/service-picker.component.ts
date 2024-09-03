import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Service } from '@navaja/shared';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'service-picker',
  templateUrl: './service-picker.component.html',
  styleUrls: ['./service-picker.component.scss']
})
export class ServicePickerComponent {
  @Input() services: Service[] | null;
  @Output() serviceSelected = new EventEmitter<Service>();

  /**
   * We add this here to only emit the service selected by the user.
   * The (onSelectionChange) event fires twice: when an option is selected
   * and when the last option is unselected
   */
  onServiceSelected(service: Service, $event: MatOptionSelectionChange) {
    if ($event.isUserInput) {
      this.serviceSelected.emit(service);
    }
  }
}
