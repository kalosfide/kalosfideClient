import { Component, OnInit } from '@angular/core';
import { SiteInfo } from '../../site-info/site-info';
import { SiteInfoStaticService } from '../../site-info/site-info-static.service';

@Component({
  selector: 'app-pied',
  templateUrl: './pied.component.html',
  styleUrls: []
})
export class PiedComponent implements OnInit {
    siteInfo: SiteInfo;

    constructor(
        private service: SiteInfoStaticService
    ) {
    }

  ngOnInit() {
      this.siteInfo = this.service.siteInfo;
  }

}
