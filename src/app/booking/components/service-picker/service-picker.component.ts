import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Service } from '../../types/service';

@Component({
  selector: 'service-picker',
  templateUrl: './service-picker.component.html',
  styleUrls: ['./service-picker.component.scss'],
})
export class ServicePickerComponent {
  @Input() services: Service[] | null;
  @Output() serviceSelected = new EventEmitter<Service>();

  onServiceSelected(service: Service) {
    this.serviceSelected.emit(service);
  }
}
