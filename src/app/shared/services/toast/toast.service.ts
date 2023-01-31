import { Injectable, ViewChild } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

import { Observable, Subject } from 'rxjs';

export interface toast {
  message: string,
  type: string
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: toast[] = []

  constructor() { }

	show(message: string, type = 'primary') {
		this.toasts.push({
      message: message,
      type: type
    });
	}

	remove(toast: toast) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts = [];
	}
}
