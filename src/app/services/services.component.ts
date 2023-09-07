import { Component, OnInit } from "@angular/core";
import { DocumentData } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { HeaderService } from "../shared/services/header/header.service";
import { ServiceService } from "../shared/services/service/service.service";

@Component({
  selector: "app-services",
  templateUrl: "./services.component.html",
  styleUrls: ["./services.component.scss"],
})
export class ServicesComponent {
  services$: Observable<DocumentData[]>;

  constructor(serviceService: ServiceService, headerService: HeaderService) {
    headerService.setHeader("Services");
    this.services$ = serviceService.getServices();
  }
}
