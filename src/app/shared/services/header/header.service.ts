import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
    private title = new BehaviorSubject<string>("Carlos Navaja Barber Service");

    constructor() {

   }

   setTitle(title: string): void{
    this.title.next(title);
   }

   getTitle(): Observable<string>{
    return this.title.asObservable();
   }
}
