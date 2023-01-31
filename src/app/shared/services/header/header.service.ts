import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
    private header = new BehaviorSubject<string>("Vonnegut Barber Service");

    constructor() {

   }

   setHeader(header: string): void{
    this.header.next(header);
   }

   getHeader(): Observable<string>{
    return this.header.asObservable();
   }
}
