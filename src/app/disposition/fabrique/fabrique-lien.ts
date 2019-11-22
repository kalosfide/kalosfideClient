import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfUlComposant } from 'src/app/commun/kf-composants/kf-ul/kf-ul-composant';
import { IContenuPhraseDef } from './fabrique-contenu-phrase';
import { IUrlDef } from './fabrique-url';
import { FabriqueMembre } from './fabrique-membre';
import { FabriqueClasse } from './fabrique';
import { BootstrapType, FabriqueBootstrap } from './fabrique-bootstrap';

export interface ILienDef {
    nom?: string;
    url?: IUrlDef;
    contenu?: IContenuPhraseDef;
}

export class FabriqueLien extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) { super(fabrique); }

    fixeDef(lien: KfLien, def: ILienDef) {
        let params: { [key: string]: string };
        if (def.url.params) {
            params = {};
            def.url.params.forEach(p => params[p.nom] = p.valeur);
        }
        if (!def.url.local) {
            lien.fixeRoute(this.fabrique.url.url(def.url), params);
        }
        if (def.url.fragment) {
            lien.fragment = def.url.fragment;
        }
        if (!def.contenu) {
            def.contenu = {};
        }
        if (!def.contenu.nomIcone && !def.contenu.icone && def.contenu.texte === undefined) {
            def.contenu.texte = def.url.pageDef.lien ? def.url.pageDef.lien : def.url.pageDef.urlSegment;
        }
        this.fabrique.contenu.fixeDef(lien, def.contenu);
    }

    private _lien(nomOuDef: string | ILienDef): KfLien {
        if (typeof (nomOuDef) === 'string') {
            return new KfLien(nomOuDef);
        } else {
            const lien = new KfLien('');
            this.fixeDef(lien, nomOuDef);
            return lien;
        }
    }
    lien(nomOuDef: string | ILienDef): KfLien {
        const lien = this._lien(nomOuDef);
        lien.ajouteClasseDef('btn btn-link');
        return lien;
    }
    lienEnLigne(nomOuDef: string | ILienDef): KfLien {
        const lien = this._lien(nomOuDef);
        return lien;
    }
    lienBouton(nomOuDef: string | ILienDef, bootstrap: BootstrapType): KfLien {
        const lien = this._lien(nomOuDef);
        FabriqueBootstrap.ajouteClasse(lien, 'btn', bootstrap);
        return lien;
    }

    retour(urlDef: IUrlDef, texte?: string): KfLien {
        if (texte === null || texte === undefined) {
            texte = urlDef.pageDef.lien ? urlDef.pageDef.lien : urlDef.pageDef.urlSegment;
        }
        const def: ILienDef = {
            url: urlDef,
            contenu: this.fabrique.contenu.retour(texte)
        };
        const lien = this._lien(def);
        lien.ajouteClasseDef('btn btn-link btn-sm');
        return lien;
    }

    ajoute(urlDef: IUrlDef, texte?: string): KfLien {
        if (texte === null || texte === undefined) {
            texte = urlDef.pageDef.lien ? urlDef.pageDef.lien : 'Ajoute';
        }
        const def: ILienDef = {
            url: urlDef,
            contenu: this.fabrique.contenu.ajoute(texte)
        };
        const lien = this._lien(def);
        lien.ajouteClasseDef('btn btn-link btn-sm');
        return lien;
    }

    boutonAnnuler(urlDef: IUrlDef): KfLien {
        const def: ILienDef = {
            url: urlDef,
            contenu: {
                texte: 'Annuler'
            }
        };
        const lien = this._lien(def);
        FabriqueBootstrap.ajouteClasse(lien, 'btn', 'dark');
        return lien;
    }

    lienVide(): KfLien {
        return this._lien('vide');
    }
    groupeDeLiens(...nomOuLienDefOuLiens: (string | ILienDef | KfLien)[]) {
        const groupe = new KfGroupe('');
        groupe.ajouteClasseDef('mb-2');
        const ul = new KfUlComposant('');
        ul.ajouteClasseDef('nav row');
        ul.gereCssLi.ajouteClasseDef('nav-item col');
        groupe.ajoute(ul);

        let lien: KfLien;
        nomOuLienDefOuLiens.forEach(nomOuLienDefOuLien => {
            if (typeof (nomOuLienDefOuLien) === 'string') {
                lien = this._lien(nomOuLienDefOuLien);
            } else {
                lien = nomOuLienDefOuLien as KfLien;
                if (lien.type === undefined) {
                    lien = this._lien(nomOuLienDefOuLien as ILienDef);
                    lien.ajouteClasseDef('nav-link');
                }
            }
            ul.ajoute(lien);
        });
        if (lien && nomOuLienDefOuLiens.length > 1) {
            lien.ajouteClasseDef('text-sm-right');
        }
        return groupe;
    }
}
