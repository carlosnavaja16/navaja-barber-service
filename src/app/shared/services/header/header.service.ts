import { Injectable, inject } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HeaderService {
  private titleService: Title = inject(Title);
  private header = new BehaviorSubject<string>("Vonnegut Barber Service");

  public setHeader(header: string): void {
    this.titleService.setTitle(header);
    this.header.next(header);
  }

  public getHeader$(): Observable<string> {
    return this.header.asObservable();
  }
}
