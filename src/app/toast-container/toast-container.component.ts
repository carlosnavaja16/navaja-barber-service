import { Component, OnInit } from '@angular/core';
import { ToastService } from '../shared/services/toast/toast.service';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  host: { class: 'position-fixed top-0 start-50 translate-middle-x mt-6' }
})
export class ToastContainerComponent implements OnInit {

  constructor(
    public toastService: ToastService
  ) {

  }

  ngOnInit(): void {
  }

}
