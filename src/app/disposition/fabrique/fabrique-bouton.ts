import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfEvenement, KfTypeDEvenement, KfStatutDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { ILienDef } from './fabrique-lien';
import { RouteurService } from 'src/app/services/routeur.service';
import { ValeurTexteDef, KfTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfTypeDeBouton, KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { IKfNgbPopoverDef } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-ngb-popover';
import { IContenuPhraseDef } from './fabrique-contenu-phrase';
import { FabriqueClasse } from './fabrique';
import { BootstrapType, BootstrapNom, FabriqueBootstrap } from './fabrique-bootstrap';
import { FabriqueMembre } from './fabrique-membre';
import { DataService } from 'src/app/services/data.service';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { ResultatAction } from '../affiche-resultat/resultat-affichable';
import { IUrlDef } from './fabrique-url';
import { FANomIcone } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';

export interface IPopoverDef { titreDef: string | KfEtiquette; contenusDef: (string | KfComposant)[]; }

export interface IBoutonDef {
    nom: string;
    contenu?: IContenuPhraseDef;
    bootstrapType?: BootstrapType;
    action?: (evenement?: KfEvenement) => void;
    popoverDef?: IPopoverDef;
}

export class BoutonPopOver {
    bouton: KfBouton;
}

export class FabriqueBouton extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) { super(fabrique); }

    fixeActionBouton(bouton: KfBouton, action: (evenement: KfEvenement) => void) {
        this.supprimePopover(bouton);
        bouton.gereHtml.fixeTraiteur(KfTypeDEvenement.clic,
            (evenement: KfEvenement) => {
                action(evenement);
                evenement.statut = KfStatutDEvenement.fini;
            });
    }

    private supprimeActionBouton(bouton: KfBouton) {
        bouton.gereHtml.supprimeTraiteurs(KfTypeDEvenement.clic);
    }

    private fixeActionLien(bouton: KfBouton, urlDef: IUrlDef, routeur: RouteurService) {
        this.fixeActionBouton(bouton, () => {
            const route: any[] = [ValeurTexteDef(this.fabrique.url.url(urlDef))];
            if (urlDef.params) {
                route.push(urlDef.params);
            }
            routeur.navigueUrlDef(urlDef);
        });
    }

    private fixeActionApi(bouton: KfBouton, apiRequêteAction: ApiRequêteAction, dataService: DataService) {
        this.fixeActionBouton(bouton, () => {
            dataService.action(apiRequêteAction);
        });
    }

    fixeDef(bouton: KfBouton, def: IBoutonDef) {
        if (def.contenu) {
            this.fabrique.contenu.fixeDef(bouton, def.contenu);
        }
        if (def.bootstrapType) {
            FabriqueBootstrap.ajouteClasse(bouton, 'btn', def.bootstrapType);
        }
        if (def.action) {
            this.fixeActionBouton(bouton, def.action);
        }
        return bouton;
    }

    bouton(def: IBoutonDef): KfBouton {
        const bouton = new KfBouton(def.nom);
        this.fixeDef(bouton, def);
        return bouton;
    }
    boutonLien(nom: string, lienDef: ILienDef, routeur: RouteurService): KfBouton {
        const bouton = new KfBouton(nom);
        this.fabrique.contenu.fixeDef(bouton, lienDef.contenu);
        this.fixeActionLien(bouton, lienDef.url, routeur);
        return bouton;
    }
    nomBoutonSoumettre(formulaire: KfSuperGroupe): string {
        return formulaire.nom + '_soumettre';
    }
    boutonSoumettre(formulaire: KfSuperGroupe, texte?: KfTexteDef): KfBouton {
        const bouton = this.bouton({
            nom: this.nomBoutonSoumettre(formulaire),
            contenu: { texte: texte },
            bootstrapType: BootstrapNom.primary
        });
        bouton.typeDeBouton = KfTypeDeBouton.soumettre;
        return bouton;
    }

    boutonAction(nom: string, texte: string, apiRequêteDef: ApiRequêteAction, dataService: DataService): KfBouton {
        const bouton = this.bouton({
            nom: nom,
            contenu: { texte: texte },
            bootstrapType: 'primary'
        });
        this.fixeActionApi(bouton, apiRequêteDef, dataService);
        return bouton;
    }

    // info popOver
    fixePopover(bouton: KfBouton,
        titreDef: string | KfEtiquette, contenusDef: (string | KfComposant)[],
        nomIcone?: FANomIcone
    ): KfBouton {
        let titre: KfEtiquette;
        if (typeof (titreDef) === 'string') {
            titre = new KfEtiquette('', titreDef);
        } else {
            titre = titreDef;
        }
        const contenus: KfComposant[] = contenusDef.map(
            contenu => {
                if (typeof (contenu) === 'string') {
                    const etiquette = new KfEtiquette('', contenu);
                    etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
                    return etiquette;
                } else {
                    return contenu;
                }
            }
        );
        const popOverDef: IKfNgbPopoverDef = {
            titre: titre,
            contenus: contenus,
            container: 'body',
            placement: 'bottom',
        };
        if (nomIcone) {
            popOverDef.nomIcone = nomIcone;
        }
        bouton.ngbPopover = popOverDef;
//        bouton.ajouteClasseDef('dropdown-toggle');
        this.supprimeActionBouton(bouton);
        return bouton;
    }
    supprimePopover(bouton: KfBouton) {
        bouton.ngbPopover = undefined;
//        bouton.supprimeClasseDef('dropdown-toggle');
    }

    aide(nom: string, titre?: string): KfBouton {
        const boutonDef: IBoutonDef = {
            nom: nom,
            bootstrapType: 'link',
            contenu: this.fabrique.contenu.aide(titre)
        };
        const bouton = this.bouton(boutonDef);
        return bouton;
    }

    info(nom: string, titre?: string): KfBouton {
        const boutonDef: IBoutonDef = {
            nom: nom,
            bootstrapType: 'link',
            contenu: this.fabrique.contenu.info(titre)
        };
        const bouton = this.bouton(boutonDef);
        return bouton;
    }

    boutonAttente(nom: string, contenu: IContenuPhraseDef, apiRequêteDef: ApiRequêteAction, dataService: DataService): KfBouton {
        const bouton = new KfBouton(nom);
        bouton.fixeStyleDef('position', 'relative');
        this.fabrique.contenu.fixeDef(bouton, contenu);
        const kfIcone = bouton.contenuPhrase.kfIcone;
        if (kfIcone) {
            kfIcone.fondVisible = true;
        }
        const icone = this.fabrique.icone.iconeAttente();
        icone.créeGèreCssFond();
        icone.gèreCssFond.ajouteClasseDef('survol-centre');
        icone.gèreCssFond.fixeStyleDef('font-size', '1.25em');
        icone.fondVisible = false;
        bouton.contenuPhrase.ajoute(icone);

        const commence: () => void = () => {
            icone.fondVisible = true;
            bouton.contenuPhrase.kfIcone.gèreCssFond.fixeStyleDef('opacity', '.33');
        };
        const finit: () => void = () => {
            icone.fondVisible = false;
            bouton.contenuPhrase.kfIcone.gèreCssFond.supprimeStyleDef('opacity');
        };

        const actionDef: ApiRequêteAction = {
            demandeApi: apiRequêteDef.demandeApi,
            actionSiOk: () => {
                finit();
                apiRequêteDef.actionSiOk();
            },
            actionSiErreur: (resultat: ResultatAction) => {
                finit();
                if (apiRequêteDef.actionSiErreur) {
                    apiRequêteDef.actionSiErreur(resultat);
                }
            }
        };
        bouton.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic,
            (evenement: KfEvenement) => {
                commence();
                dataService.action(actionDef);
                evenement.statut = KfStatutDEvenement.fini;
            });
        return bouton;
    }

    boutonAttenteDeColonne(nom: string, contenu: IContenuPhraseDef, apiRequêteDef: ApiRequêteAction, dataService: DataService): KfBouton {
        const bouton = this.boutonAttente(nom, contenu, apiRequêteDef, dataService);
        bouton.ajouteClasseDef('btn btn-light');
        return bouton;
    }

    fauxTexteSousIcone(): KfEtiquette {
        const etiquette = new KfEtiquette('');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.span;
        etiquette.ajouteClasseDef('texte-sous-icone');
        return etiquette;
    }
}
