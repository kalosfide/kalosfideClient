import { ActivatedRoute, Data } from '@angular/router';

import { ProduitRoutes, ProduitPages } from './produit-pages';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { OnInit } from '@angular/core';
import { Site } from 'src/app/modeles/site/site';
import { ProduitService } from 'src/app/modeles/catalogue/produit.service';
import { ProduitEditeur } from '../../modeles/catalogue/produit-editeur';
import { IdEtatProduit } from 'src/app/modeles/catalogue/etat-produit';
import { KeyUidRnoNoALESComponent } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-ales.component';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';

export abstract class ProduitALESComponent extends KeyUidRnoNoALESComponent<Produit> implements OnInit {

    site: Site;

    /**
     * pour permettre de lancer un avertissement quand le nombre de produits disponibles est nul
     */
    produitChargéDisponible: boolean;

    dataPages = ProduitPages;
    dataRoutes = ProduitRoutes;

    constructor(
        protected route: ActivatedRoute,
        protected _service: ProduitService,
    ) {
        super(route, _service);
        this.chargeData = (data: Data) => this.editeur.chargeData(data);
    }

    protected contenuAidePage = (): KfComposant[] => {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Ceci est `,
            { t: 'à faire', b: KfTypeDeBaliseHTML.b},
            '.'
        );

        return infos;
    }

    get service(): ProduitService {
        return this._service;
    }

    get produit(): Produit {
        return this.valeur;
    }

    créeDataEditeur() {
        this.dataEditeur = new ProduitEditeur(this);
    }

    get editeur(): ProduitEditeur {
        return this.dataEditeur as ProduitEditeur;
    }

    fixeValeur(valeur: Produit) {
        this.dataEditeur.fixeValeur(valeur);
        this.produitChargéDisponible = valeur && valeur.etat === IdEtatProduit.disponible;
    }

    protected metAJourNbProduits(delta: number) {
            this.site.nbProduits = this.site.nbProduits + delta;
            this._service.navigation.actionsAprèsNavigation(
                () => {
                    this._service.navigation.fixeSiteEnCours(this.site);
                    this._service.identification.fixeSiteIdentifiant(this.site);
                });
    }

}
