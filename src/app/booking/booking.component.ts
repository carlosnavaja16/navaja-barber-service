import { Component } from '@angular/core';
import { HeaderService } from '../shared/services/header/header.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { timingSafeEqual } from 'crypto';

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

  constructor(
    public headerService: HeaderService,
  ) {
    headerService.setHeader('Booking');
    this.currDate = new Date();
    this.currNgbDate = new NgbDate(
      this.currDate.getFullYear(),
      this.currDate.getMonth() + 1,
      this.currDate.getDate()
    );
    console.log(this.currDate);
    console.log(this.currNgbDate);
    this.limitDate = new Date();
    this.limitDate.setDate(this.limitDate.getDate() + 14);
    this.limitNgbDate = new NgbDate(
      this.limitDate.getFullYear(),
      this.limitDate.getMonth() + 1,
      this.limitDate.getDate()
    );
    console.log(this.limitDate);
    console.log(this.limitNgbDate);
  }

  sundaysDisabled(date: NgbDate, current?: { year: number; month: number; }): boolean {
    const currDate = new Date(date.year, date.month - 1, date.day);
    return currDate.getDay() === 0;
  }

  getTimeSlots(){
    console.log("time slots returned!")
  }
}
