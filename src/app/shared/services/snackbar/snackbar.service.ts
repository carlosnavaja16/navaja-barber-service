import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

const SNACKBAR_DURATION = 5000;

export const successConfig = new MatSnackBarConfig();
successConfig.duration = SNACKBAR_DURATION;
successConfig.horizontalPosition = "start";
successConfig.panelClass = ["snackbar-success"];

export const dangerConfig = {
  ...successConfig,
  panelClass: ["snackbar-warn"],
};

export interface Snackbar {
  message: string;
  action?: string;
  config: MatSnackBarConfig;
}

@Injectable({
  providedIn: "root",
})
export class SnackbarService {
  private snackbar$ = new Subject<Snackbar>();

  constructor(public matSnackbar: MatSnackBar) {
    this.snackbar$.asObservable().subscribe((snackbar) => {
      matSnackbar.open(snackbar.message, snackbar.action, snackbar.config);
    });
  }

  public success(message: string): void {
    this.pushSnackbar({
      message,
      config: successConfig,
    });
  }

  public warning(message: string): void {
    this.pushSnackbar({
      message,
      config: dangerConfig,
    });
  }

  public pushSnackbar(Snackbar: Snackbar): void {
    this.snackbar$.next(Snackbar);
  }
}
