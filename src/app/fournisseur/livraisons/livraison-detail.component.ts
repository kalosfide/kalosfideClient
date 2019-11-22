import { OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Observable } from 'rxjs';
import { PeutQuitterService } from 'src/app/commun/peut-quitter/peut-quitter.service';
import { ValeurTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { ComponentAAutoriserAQuitter } from 'src/app/commun/peut-quitter/peut-quitter-garde.service';
import { LivraisonPages, LivraisonRoutes } from './livraison-pages';
import { ActivatedRoute, RouterStateSnapshot, Data } from '@angular/router';
import { LivraisonService } from './livraison.service';
import { compareKeyUidRno } from 'src/app/commun/data-par-key/data-key';
import { Client } from 'src/app/modeles/clientele/client';
import { DetailCommande } from 'src/app/commandes/detail-commande';
import { DetailCommandeComponent } from 'src/app/commandes/detail-commande.component';
import { LivraisonStock } from './livraison-stock';
import { ITitrePage } from 'src/app/disposition/titre-page/titre-page';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { ILivraisonComponent } from './i-livraison-component';
import { BarreTitre, IBarreDef } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';

export abstract class LivraisonDetailComponent extends DetailCommandeComponent
    implements OnInit, OnDestroy, ComponentAAutoriserAQuitter, ILivraisonComponent {

    get titre(): string {
        return (this.ajout ? 'Commander pour ' : 'Commande de ') + this.client.nom + ' - ' + this.pageDef.titre;
    }

    constructor(
        protected route: ActivatedRoute,
        protected _service: LivraisonService,
        protected peutQuitterService: PeutQuitterService,
    ) {
        super(route, _service, peutQuitterService);
    }

    get détail(): DetailCommande { return this._détail as DetailCommande; }
    get service(): LivraisonService { return this._service as LivraisonService; }

    protected get _barreTitreDef(): IBarreDef {
        return {
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        };
    }
    protected get barreTitreDef(): IBarreDef {
        return this._barreTitreDef;
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre(this.barreTitreDef);
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

    créeDétail(data: Data): DetailCommande {
        const stock: LivraisonStock = data.stock;
        const client: Client = data.client;
        const produit = data.produit;
        const apiCommande = stock.apiCommandesATraiter.find(c => compareKeyUidRno(c, client));
        return new DetailCommande(apiCommande, produit, {
            client: client,
            étatSiteLivraison: this.site.etat === IdEtatSite.livraison,
            estDansListeParProduit: false,
        });
    }

    peutQuitter = (nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> => {
        if (nextState) {
            const urlDef: IUrlDef = {
                pageDef: LivraisonPages.commande,
                routes: LivraisonRoutes,
                nomSite: this.site.nomSite
            };
            let permise = ValeurTexteDef(Fabrique.url.url(urlDef));
            if (nextState.url === permise) {
                return true;
            }
            urlDef.pageDef = LivraisonPages.produit;
            permise = ValeurTexteDef(Fabrique.url.url(urlDef));
            if (nextState.url.substr(0, permise.length) === permise) {
                return true;
            }
        }
        return this.peutQuitterService.confirme(this.pageDef.titre);
    }
}
