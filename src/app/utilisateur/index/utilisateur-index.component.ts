import { Component, OnInit } from '@angular/core';
import { IdentificationService } from '../../securite/identification.service';
import { Identifiant } from '../../securite/identifiant';

@Component({
  selector: 'app-utilisateur-index',
  templateUrl: './utilisateur-index.component.html',
  styles: []
})
export class UtilisateurIndexComponent implements OnInit {

    identifiant: Identifiant;

  constructor(
      private identification: IdentificationService
  ) { }

  ngOnInit() {
      this.identifiant = this.identification.litIdentifiant();
  }

}
