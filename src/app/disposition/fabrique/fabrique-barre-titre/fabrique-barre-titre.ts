import { FabriqueMembre } from '../fabrique-membre';
import { FabriqueClasse } from '../fabrique';
import { PageDef } from 'src/app/commun/page-def';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfBBtnGroup, KfBBtnGroupElement } from 'src/app/commun/kf-composants/kf-b-btn-group/kf-b-btn-group';
import { IBoutonDef } from '../fabrique-bouton';
import { IContenuPhraseDef } from '../fabrique-contenu-phrase';
import { Couleur } from '../fabrique-couleurs';
import { KfBBtnToolbar } from 'src/app/commun/kf-composants/kf-b-btn-toolbar/kf-b-btn-toolbar';
import { Site } from 'src/app/modeles/site/site';
import { FabriqueBootstrap } from '../fabrique-bootstrap';
import { GroupeAccès } from './groupe-acces';

export interface IBtnGroupeDef {
    groupe: KfBBtnGroup;
    rafraichit?: (barre: BarreTitre) => void;
}

export class BarreTitre {
    pageDef: PageDef;
    site: Site;
    private _toolbar: KfBBtnToolbar;
    private _rafraichissements: ((barre: BarreTitre) => void)[];

    constructor(pageDef: PageDef) {
        this.pageDef = pageDef;
        this._toolbar = new KfBBtnToolbar(pageDef.urlSegment);
        this._toolbar.ajouteClasseDef('justify-content-between');
        this._rafraichissements = [];
    }

    get barre(): KfBBtnToolbar {
        return this._toolbar;
    }

    ajoute(groupeDef: IBtnGroupeDef) {
        this._toolbar.ajoute(groupeDef.groupe);
        if (groupeDef.rafraichit) {
            this._rafraichissements.push(groupeDef.rafraichit);
        }
    }

    rafraichit() {
        this._rafraichissements.forEach(rafraichit => rafraichit(this));
    }
}

export interface IBarreDef {
    pageDef: PageDef;
    contenuAidePage?: KfComposant[];
    boutonsPourBtnGroup?: (KfBBtnGroupElement[])[];
}

export class FabriqueBarreTitre extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) { super(fabrique); }

    barreTitre(barreDef: IBarreDef): BarreTitre {
        const barre = new BarreTitre(barreDef.pageDef);
        if (barreDef.contenuAidePage) {
            barre.ajoute(this.groupeDefAidePage(barre, barreDef.contenuAidePage));
        }
        if (barreDef.boutonsPourBtnGroup) {
            barreDef.boutonsPourBtnGroup.forEach(boutons => {
                const groupe = this.groupe('');
                boutons.forEach(bouton => {
                    groupe.ajoute(bouton);
                });
                barre.ajoute({ groupe: groupe });
            });
        }
        return barre;
    }

    groupe(nom: string): KfBBtnGroup {
        const groupe = new KfBBtnGroup(nom);
        groupe.taille('sm');
        return groupe;
    }

    bouton(nom: string, contenu?: IContenuPhraseDef): KfBouton {
        if (contenu) {
            contenu.positionTexte = 'droite';
        }
        const boutonDef: IBoutonDef = {
            nom: nom,
            contenu: contenu
        };
        return this.fabrique.bouton.bouton(boutonDef);
    }

    contenuBoutonInfo(titre?: string): IContenuPhraseDef {
        const contenu: IContenuPhraseDef = {
            nomIcone: this.fabrique.icone.nomIcone.info,
            couleurIcone: Couleur.blue,
            texte: titre,
            positionTexte: 'droite',
        };
        return contenu;
    }

    boutonInfo(nom: string, titre?: string): KfBouton {
        const bouton = this.bouton(nom, this.contenuBoutonInfo(titre));
        FabriqueBootstrap.ajouteClasse(bouton, 'btn', 'light');
        return bouton;
    }

    contenuBoutonAide(titre?: string): IContenuPhraseDef {
        const contenu: IContenuPhraseDef = {
            nomIcone: this.fabrique.icone.nomIcone.question,
            couleurIcone: Couleur.blue,
            texte: titre,
            positionTexte: 'droite',
        };
        return contenu;
    }

    boutonAide(nom: string, titre?: string): KfBouton {
        const bouton = this.bouton(nom, this.contenuBoutonAide(titre));
        FabriqueBootstrap.ajouteClasse(bouton, 'btn', 'light');
        return bouton;
    }

    contenuBoutonRafraichit(titre?: string): IContenuPhraseDef {
        const contenu: IContenuPhraseDef = {
            nomIcone: this.fabrique.icone.nomIcone.rafraichit,
            couleurIcone: Couleur.blue,
            texte: titre,
            positionTexte: 'droite',
        };
        return contenu;
    }

    boutonRafraichit(nom: string, titre?: string): KfBouton {
        const bouton = this.bouton(nom, this.contenuBoutonRafraichit(titre));
        FabriqueBootstrap.ajouteClasse(bouton, 'btn', 'light');
        return bouton;
    }

    boutonAction(nom: string, titre?: string): KfBouton {
        let contenu: IContenuPhraseDef;
        if (titre) {
            contenu = {
                texte: titre,
            };
        }
        const bouton = this.bouton(nom, contenu);
        FabriqueBootstrap.ajouteClasse(bouton, 'btn', 'secondary');
        return bouton;
    }

    fixePopover(bouton: KfBouton, titre: string | KfEtiquette, contenus: KfComposant[]) {
        this.fabrique.bouton.fixePopover(bouton, titre, contenus, this.fabrique.icone.nomIcone.ouvert);
    }

    groupeDefAidePage(barre: BarreTitre, contenus: KfComposant[]): IBtnGroupeDef {
        const bouton = this.boutonAide('aide_page', barre.pageDef.titre);
        this.fixePopover(bouton, barre.pageDef.titre + ': Aide', contenus);
        const groupe = this.groupe('aide_page');
        groupe.ajoute(bouton);
        return { groupe: groupe };
    }

    groupeAccès(estClient?: 'client'): IBtnGroupeDef {
        return new GroupeAccès(this, !!estClient);
    }

}
