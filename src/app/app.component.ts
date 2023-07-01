import { Component, ViewChild } from "@angular/core";
import { AuthService } from "./shared/services/auth/auth.service";
import { HeaderService } from "./shared/services/header/header.service";
import { Title } from "@angular/platform-browser";
import { SnackbarService } from "./shared/services/snackbar/snackbar.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  isNavCollapsed = true;
  header = "";

  constructor(
    public authService: AuthService,
    public headerService: HeaderService,
    public titleService: Title,
    public snackbarService: SnackbarService,
    public matSnackbar: MatSnackBar,
  ) {}
}
