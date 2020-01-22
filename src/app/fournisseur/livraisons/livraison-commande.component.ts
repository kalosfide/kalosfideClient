import { OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';
import { LivraisonService } from './livraison.service';
import { CommandeComponent } from 'src/app/commandes/commande.component';
import { LivraisonUtile } from './livraison-utile';
import { ILivraisonComponent } from './i-livraison-component';
import { ApiCommande } from 'src/app/commandes/api-commande';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { Client } from 'src/app/modeles/client/client';
import { DetailCommande } from 'src/app/commandes/detail-commande';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';

export abstract class LivraisonCommandeComponent extends CommandeComponent implements OnInit, OnDestroy, ILivraisonComponent {

    get titre(): string {
        return `${this.client.nom} - ${this.pageDef.titre}${this._commande ? ' n° ' + this._commande.no : ''}`;
    }

    get utile(): LivraisonUtile {
        return this._utile as LivraisonUtile;
    }

    constructor(
        protected route: ActivatedRoute,
        protected _service: LivraisonService,
    ) {
        super(route, _service);
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
            boutonsPourBtnGroup: [[this.utile.lien.retourDUnClient(this._commande)]]
        });

        return barre;
    }

    private contenuAidePage(): KfComposant[] {
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

    get service(): LivraisonService { return this._service; }

    créeUnDétail(apiCommande: ApiCommande, produit: Produit, client: Client): DetailCommande {
        return new DetailCommande(apiCommande, produit, {
            client: client,
            estDansListeParProduit: false,
        });
    }

    _initialiseModes() {
    }

    protected créeColonneDefs(): IKfVueTableColonneDef<DetailCommande>[] {
        const colonneDefs = this.utile.colonne.détail.defsFournisseur(this._commande);
        return colonneDefs;
    }
}
