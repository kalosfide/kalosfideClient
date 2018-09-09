import { Component, OnInit } from '@angular/core';
import { SiteInfoService } from '../../site-info/site-info.service';
import { SiteInfo } from '../../site-info/site-info';

@Component({
  selector: 'app-pied',
  templateUrl: './pied.component.html',
  styleUrls: []
})
export class PiedComponent implements OnInit {
    siteInfo: SiteInfo;

    constructor(
        private service: SiteInfoService
    ) {
    }

  ngOnInit() {
      this.siteInfo = this.service.siteInfo;
  }

}
