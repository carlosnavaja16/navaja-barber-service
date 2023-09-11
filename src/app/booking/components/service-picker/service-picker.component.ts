import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';

@Component({
  selector: 'service-picker',
  templateUrl: './service-picker.component.html',
  styleUrls: ['./service-picker.component.scss'],
})
export class ServicePickerComponent {
  @Input() services: DocumentData[] | null;
  @Output() serviceSelected = new EventEmitter<DocumentData>();

  onServiceSelected(service: DocumentData) {
    this.serviceSelected.emit(service);
  }
}
