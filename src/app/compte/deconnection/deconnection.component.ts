import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentificationService } from '../../sécurité/identification.service';

@Component({
  selector: 'app-deconnection',
  templateUrl: './deconnection.component.html',
  styles: []
})
export class DeconnectionComponent implements OnInit {

  constructor(
      private router: Router,
      private authentication: IdentificationService
  ) { }

  ngOnInit() {
      this.authentication.déconnecte();
      this.router.navigate(['/']);
  }

}
