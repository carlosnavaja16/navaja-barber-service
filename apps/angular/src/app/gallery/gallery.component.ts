import { Component } from '@angular/core';
import { HeaderService } from '@src/app/common/services/header/header.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  constructor(private readonly headerService: HeaderService) {
    this.headerService.setHeader('Gallery');
  }
}
