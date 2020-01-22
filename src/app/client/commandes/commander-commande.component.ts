import { OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CommanderService } from './commander.service';
import { CommandeComponent } from 'src/app/commandes/commande.component';
import { ApiCommande } from 'src/app/commandes/api-commande';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { Client } from 'src/app/modeles/client/client';
import { DetailCommande } from 'src/app/commandes/detail-commande';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { ICommanderComponent } from './i-commander-component';
import { CommandeUtile } from 'src/app/commandes/commande-utile';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { IContenuPhraseDef } from 'src/app/disposition/fabrique/fabrique-contenu-phrase';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Couleur } from 'src/app/disposition/fabrique/fabrique-couleurs';
import { IBoutonDef } from 'src/app/disposition/fabrique/fabrique-bouton';
import { FabriqueBootstrap } from 'src/app/disposition/fabrique/fabrique-bootstrap';


export abstract class CommanderCommandeComponent extends CommandeComponent implements OnInit, OnDestroy, ICommanderComponent {

    get titre(): string {
        return `${this.pageDef.titre}${this._commande ? ' n° ' + this._commande.no : ''}`;
    }

    constructor(
        protected route: ActivatedRoute,
        protected _service: CommanderService,
    ) {
        super(route, _service);
    }

    get service(): CommanderService { return this._service; }
    get utile(): CommandeUtile { return this._utile as CommandeUtile; }

    créeUnDétail(apiCommande: ApiCommande, produit: Produit, client: Client): DetailCommande {
        return new DetailCommande(apiCommande, produit, { client: client });
    }

    protected créeColonneDefs(): IKfVueTableColonneDef<DetailCommande>[] {
        return this._utile.colonne.détail.defsClient();
    }

    protected ajouteBoutonRafraichit(groupe: KfGroupe) {
        const contenu: IContenuPhraseDef = {
            nomIcone: Fabrique.icone.nomIcone.rafraichit,
            couleurIcone: Couleur.blue,
            positionTexte: 'droite',
        };
        contenu.texte = Fabrique.texte.Initale(Fabrique.texte.àXHeure(new Date(Date.now())));
        const boutonDef: IBoutonDef = {
            nom: 'rafraichit',
            contenu: contenu,
        };
        const bouton = Fabrique.bouton.bouton(boutonDef);
        Fabrique.bouton.fixeActionBouton(bouton, () => {
                const subscription = this._service.chargeEtVérifie().subscribe(
                    stock_changé => {
                        subscription.unsubscribe();
                        if (stock_changé.changé) {
                            this.chargeStock(stock_changé.stock);
                            this._service.metAJourSitesStockés(stock_changé.siteChangé);
                        }
                        contenu.texte = Fabrique.texte.Initale(Fabrique.texte.àXHeure(new Date(Date.now())));
                        Fabrique.contenu.fixeDef(bouton, contenu);
                    }
                );
            });
        FabriqueBootstrap.ajouteClasse(bouton, 'btn', 'light');
        groupe.ajoute(bouton);
    }

    aprèsChargeData() {
        this.subscriptions.push(
            this.service.modeActionIO.observable.subscribe(() => this.rafraichit()),
            this.service.stockChargéObs().subscribe(stock => {
                this.chargeStock(stock);
            })
        );
    }
}
