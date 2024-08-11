import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private titleService: Title = inject(Title);
  private header = signal<string>('Navaja Barber Service');

  public setHeader(header: string): void {
    this.header.set(header);
    this.titleService.setTitle(header);
  }

  public getHeader(): WritableSignal<string> {
    return this.header;
  }
}
