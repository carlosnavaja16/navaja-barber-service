import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackbar$ = new Subject<string>();

  constructor(public matSnackbar: MatSnackBar) {
    this.snackbar$.subscribe((message) => {
      matSnackbar.open(message, '', {
        duration: 5000
      });
    });
  }

  public pushSnackbar(message: string): void {
    this.snackbar$.next(message);
  }
}
