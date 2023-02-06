import { Component } from '@angular/core';
import { HeaderService } from '../shared/services/header/header.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Functions, httpsCallable, httpsCallableData } from '@angular/fire/functions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {

  currDate: Date;
  currNgbDate: NgbDate;
  limitDate: Date;
  limitNgbDate: NgbDate;
  getTimeSlotsFunction: (data: any) => Observable<any>;

  constructor(
    public headerService: HeaderService,
    public functions: Functions
  ) {
    headerService.setHeader('Booking');
    this.currDate = new Date();
    this.currNgbDate = new NgbDate(
      this.currDate.getFullYear(),
      this.currDate.getMonth() + 1,
      this.currDate.getDate()
    );

    this.limitDate = new Date();
    this.limitDate.setDate(this.limitDate.getDate() + 14);
    this.limitNgbDate = new NgbDate(
      this.limitDate.getFullYear(),
      this.limitDate.getMonth() + 1,
      this.limitDate.getDate()
    );
    this.getTimeSlotsFunction = httpsCallableData(this.functions, 'getTimeSlots', {timeout: 5000});
  }

  sundaysDisabled(date: NgbDate, current?: { year: number; month: number; }): boolean {
    const currDate = new Date(date.year, date.month - 1, date.day);
    return currDate.getDay() === 0;
  }

  getTimeSlots(){
    const date = new Date();
    const timeSlotObservable = this.getTimeSlotsFunction({date: date})
    timeSlotObservable.subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err)
      }
    });

  }
}
