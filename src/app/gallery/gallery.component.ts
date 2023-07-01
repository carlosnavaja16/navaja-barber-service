import { Component, OnInit } from "@angular/core";
import { HeaderService } from "../shared/services/header/header.service";

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.scss"],
})
export class GalleryComponent implements OnInit {
  constructor(public headerService: HeaderService) {
    headerService.setHeader("Gallery");
  }

  ngOnInit(): void {}
}
