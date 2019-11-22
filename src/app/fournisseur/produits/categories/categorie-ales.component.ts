import { ActivatedRoute } from '@angular/router';
import { Categorie } from 'src/app/modeles/catalogue/categorie';
import { OnInit } from '@angular/core';
import { Site } from 'src/app/modeles/site';
import { CategorieService } from 'src/app/modeles/catalogue/categorie.service';
import { CategorieEditeur } from './categorie-editeur';
import { ITitrePage } from 'src/app/disposition/titre-page/titre-page';
import { KeyUidRnoNoALESComponent } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-ales.component';

export abstract class CategorieALESComponent extends KeyUidRnoNoALESComponent<Categorie> implements OnInit {

    get titre(): string {
        return this.pageDef.titre;
    }
    get titrePage(): ITitrePage {
        return {
            titre: this.pageDef.titre,
            niveau: 1,
        };
    }

    site: Site;

    constructor(
        protected route: ActivatedRoute,
        protected _service: CategorieService,
    ) {
        super(route, _service);
    }

    get service(): CategorieService {
        return this._service;
    }

    get categorie(): Categorie {
        return this.valeur;
    }

    créeDataEditeur()  {
        this.dataEditeur = new CategorieEditeur();
    }

}
