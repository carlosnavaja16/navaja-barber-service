import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Auth, signOut } from "@angular/fire/auth";
import { SnackbarService } from "../shared/services/snackbar/snackbar.service";
import { catchError, from, take, tap } from "rxjs";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.scss"],
})
export class LogoutComponent implements OnInit {
  constructor(
    public auth: Auth,
    public router: Router,
    public snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    const signOut$ = from(signOut(this.auth));
    signOut$
      .pipe(
        take(1),
        tap(() => {
          this.snackbarService.success("Logged out successfully.");
          this.router.navigate(["/"]);
        }),
        catchError((error) => {
          this.snackbarService.warning(`Could not logout: ${error}`);
          return error;
        }),
      )
      .subscribe();
  }
}
