import { Component, OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { PageDef } from 'src/app/commun/page-def';
import { Site } from 'src/app/modeles/site/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { ActivatedRoute, Data } from '@angular/router';
import { FacturePages } from './facture-pages';
import { FactureService } from './facture.service';
import { Client } from 'src/app/modeles/client/client';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { FactureUtile } from './facture-utile';
import { RouteurService } from 'src/app/services/routeur.service';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { IBoutonDef } from 'src/app/disposition/fabrique/fabrique-bouton';
import { ModeAction } from 'src/app/commandes/condition-action';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { Couleur } from 'src/app/disposition/fabrique/fabrique-couleurs';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';

@Component({
    templateUrl: '../../disposition/page-titre/page-titre.html',
    styleUrls: ['../../commun/commun.scss']
})
export class FactureClientComponent extends PageBaseComponent implements OnInit, OnDestroy {

    static _pageDef: PageDef = FacturePages.client;
    pageDef: PageDef = FacturePages.client;

    site: Site;
    identifiant: Identifiant;

    client: Client;

    barre: BarreTitre;
    boutonDefs: {
        vérifier: IBoutonDef,
        annulerVérifier: IBoutonDef,
    };

    date: Date;

    constructor(
        protected route: ActivatedRoute,
        protected _service: FactureService,
    ) {
        super();
    }

    get service(): FactureService { return this._service; }
    get routeur(): RouteurService { return this._service.routeur; }
    get utile(): FactureUtile { return this.service.utile; }

    get titre(): string {
        return `Facturer ${this.client.nom}`;
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        });

        this.créeBoutonDefs();

        const info = Fabrique.barreTitre.boutonInfo('');
        const vérifier = Fabrique.barreTitre.boutonAction('arret');
        vérifier.fixeStyleDef('width', '85px');
        const groupe = Fabrique.barreTitre.groupe('action');
        groupe.ajoute(info);
        groupe.ajoute(vérifier);
        barre.ajoute({ groupe: groupe, rafraichit: this.rafraichitVérifier(info, vérifier) });

        const modeTable = Fabrique.bouton.bouton({
            nom: 'table',
            contenu: { texte: '' }
        });
        modeTable.ajouteClasseDef('btn btn-light');
        const modeAction = new KfEtiquette('action');
        modeAction.ajouteClasseDef('btn btn-light');
        const modes = Fabrique.barreTitre.groupe('modes');
        modes.ajoute(modeTable);
        modes.ajoute(modeAction);

        const rafraichitModes = () => {
            modeTable.fixeTexte('Table: ' + this.service.modeTable);
            Fabrique.bouton.fixeActionBouton(modeTable, () => {
                this.service.changeModeTable(ModeTable.aperçu);
                modeTable.fixeTexte('Table: ' + this.service.modeTable);
            });
            modeAction.fixeTexte('Action: ' + this.service.modeAction);
        };

        barre.ajoute({ groupe: modes, rafraichit: rafraichitModes });

        const retour = Fabrique.barreTitre.groupe('retour');
        retour.ajoute(this.utile.lien.retourDUneFacture(this.client));
        barre.ajoute({ groupe: retour });

        this.barre = barre;

        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Ceci est `,
            { t: 'à faire', b: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    private créeBoutonDefVérifier(): IBoutonDef {
        const def: IBoutonDef = {
            nom: 'vérifier',
            contenu: {
                texte: this.utile.texte.titre_Vérifier,
            },
            bootstrapType: 'secondary',
            action: () => {
                this.service.routeur.navigueUrlDef(this.service.utile.url.envoiFacture(this.client));
            },
        };
        return def;
    }

    private créeBoutonDefAnnulerVérifier(): IBoutonDef {
        const def: IBoutonDef = {
            nom: 'vérifier',
            contenu: {
                texte: this.utile.texte.titre_AnnulerVérifier,
            },
            bootstrapType: 'dark',
            action: () => {
                this.service.routeur.navigueUrlDef(this.service.utile.url.facture(this.client));
            },
        };
        return def;
    }

    private créeBoutonDefs() {
        this.boutonDefs = {
            vérifier: this.créeBoutonDefVérifier(),
            annulerVérifier: this.créeBoutonDefAnnulerVérifier()
        };
    }

    rafraichitVérifier(info: KfBouton, vérifier: KfBouton): () => void {
        return () => {
            const infos: KfComposant[] = [];

            let couleur: Couleur;
            let etiquette: KfEtiquette;

            const àPréparer = this.service.nbDétailsNonFacturésIO.valeur;
            etiquette = Fabrique.ajouteEtiquetteP(infos);
            let description: string;
            if (àPréparer === 0) {
                description = `Toutes les livraisons de produits ont été facturées.`;
                etiquette.ajouteClasseDef('alert-success');
                couleur = Couleur.green;
            } else {
                description =
                    `Il y a ${àPréparer === 1 ? 'une livraison' : '' + àPréparer + ' livraisons'} de produits à préparer.`;
                etiquette.ajouteClasseDef('alert-warning');
                couleur = Couleur.warning;
            }
            Fabrique.ajouteTexte(etiquette, description);
            if (this.utile.conditionAction.envoi.valeur) {
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                Fabrique.ajouteTexte(etiquette,
                    `Le bouton `,
                    { t: this.utile.texte.titre_Terminer, b: KfTypeDeBaliseHTML.b },
                    ` est en bas de la page.`
                );
                Fabrique.bouton.fixeDef(vérifier, this.boutonDefs.annulerVérifier);
                vérifier.inactivité = false;
            } else {
                Fabrique.bouton.fixeDef(vérifier, this.boutonDefs.vérifier);
                vérifier.inactivité = !(this.utile.conditionAction.edite && àPréparer === 0);
            }
            Fabrique.contenu.fixeDef(info, {
                nomIcone: Fabrique.icone.nomIcone.info,
                couleurIcone: couleur,
            });
            Fabrique.barreTitre.fixePopover(info, '', infos);

        };
    }

    private rafraichit() {
        this.barre.site = this._service.navigation.litSiteEnCours();
        this.barre.rafraichit();
    }

    ngOnInit() {
        this.site = this._service.navigation.litSiteEnCours();
        this.subscriptions.push(this.route.data.subscribe(
            (data: Data) => {
                this.client = data.client;
                this.niveauTitre = 1;
                this.créeTitrePage();
                this.rafraichit();

                this.subscriptions.push(
                    this.service.modeActionIO.observable.subscribe(
                        () => {
                            this.rafraichit();
                        }),
                    this.service.modeTableIO.observable.subscribe(
                        () => {
                            this.rafraichit();
                        }),
                    this.service.nbDétailsNonFacturésIO.observable.subscribe(
                        () => {
                            this.rafraichit();
                        })
                );
                this.service.changeMode(ModeAction.edite);
                this.service.changeClient(this.client);
            }
        ));
    }
}
