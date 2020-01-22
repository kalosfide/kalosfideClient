import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { FabriqueIcone } from './fabrique-icone';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { AfficheResultat } from 'src/app/disposition/affiche-resultat/affiche-resultat';
import { FabriqueLien } from './fabrique-lien';
import { FabriqueUrl } from './fabrique-url';
import { FabriqueContenuPhrase } from './fabrique-contenu-phrase';
import { FabriqueBouton } from './fabrique-bouton';
import { BootstrapType, FabriqueBootstrap } from './fabrique-bootstrap';
import { FabriqueVueTable } from './fabrique-vue-table';
import { Observable } from 'rxjs';
import { FabriqueCouleur } from './fabrique-couleurs';
import { FabriqueBarreTitre } from './fabrique-barre-titre/fabrique-barre-titre';
import { FabriqueTexte } from './fabrique-texte';
import { FabriqueEtatSite } from './fabrique-etat-site';
import { FabriqueFormulaire } from './fabrique-formulaire';
import { FabriqueInput, FabriqueListeDéroulante } from './fabrique-input';

export interface IFormulaireGroupeDesBoutons {
    avantBoutons?: KfComposant[];
    boutons: KfBouton[];
    aprèsBoutons?: KfComposant[];
    bootstrapType?: BootstrapType;
    /** défini après création */
    afficheResultat?: AfficheResultat;
}

export interface IMessageMasquable {
    groupe: KfGroupe;
    masquable: KfGroupe;
}

export class FabriqueClasse {
    private _couleur: FabriqueCouleur;
    private _icone: FabriqueIcone;
    private _contenu: FabriqueContenuPhrase;
    private _url: FabriqueUrl;
    private _lien: FabriqueLien;
    private _bouton: FabriqueBouton;
    private _input: FabriqueInput;
    private _listeDéroulante: FabriqueListeDéroulante;
    private _vueTable: FabriqueVueTable;
    private _formulaire: FabriqueFormulaire;
    private _barreTitre: FabriqueBarreTitre;
    private _texte: FabriqueTexte;
    private _etatSite: FabriqueEtatSite;

    constructor() {
        this._couleur = new FabriqueCouleur();
        this._icone = new FabriqueIcone(this);
        this._contenu = new FabriqueContenuPhrase(this);
        this._url = new FabriqueUrl();
        this._lien = new FabriqueLien(this);
        this._bouton = new FabriqueBouton(this);
        this._input = new FabriqueInput(this);
        this._listeDéroulante = new FabriqueListeDéroulante(this);
        this._vueTable = new FabriqueVueTable(this);
        this._formulaire = new FabriqueFormulaire(this);
        this._barreTitre = new FabriqueBarreTitre(this);
        this._texte = new FabriqueTexte();
        this._etatSite = new FabriqueEtatSite(this);
    }

    get couleur(): FabriqueCouleur { return this._couleur; }
    get icone(): FabriqueIcone { return this._icone; }
    get contenu(): FabriqueContenuPhrase { return this._contenu; }
    get url(): FabriqueUrl { return this._url; }
    get lien(): FabriqueLien { return this._lien; }
    get bouton(): FabriqueBouton { return this._bouton; }
    get input(): FabriqueInput { return this._input; }
    get listeDéroulante(): FabriqueListeDéroulante { return this._listeDéroulante; }
    get vueTable(): FabriqueVueTable { return this._vueTable; }
    get formulaire(): FabriqueFormulaire { return this._formulaire; }
    get barreTitre(): FabriqueBarreTitre { return this._barreTitre; }
    get texte(): FabriqueTexte { return this._texte; }
    get etatSite(): FabriqueEtatSite { return this._etatSite; }

    // alertes
    alerte(nom: string, bootstrapDef: BootstrapType): KfGroupe {
        const groupe = new KfGroupe(nom);
        FabriqueBootstrap.ajouteClasse(groupe, 'alert', bootstrapDef);
        return groupe;
    }

    // case à cocher
    caseACocher(nom: string, texte?: KfTexteDef): KfCaseACocher {
        const caseACocher = new KfCaseACocher(nom, texte);
        caseACocher.gèreClasseDiv.ajouteClasseDef('form-group row');
        caseACocher.gèreClasseDivVide.ajouteClasseDef('col-sm-2');
        caseACocher.gèreClasseEntree.ajouteClasseDef('col-sm-10');
        return caseACocher;
    }

    // texte aide des formulaires
    texteAide(nom: string, texte: string): KfEtiquette {
        const etiquette = new KfEtiquette(nom + '_aide', texte);
        etiquette.ajouteClasseDef('form-text text-muted');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.small;
        return etiquette;
    }

    animeAttenteGlobal(visibilitéObs: Observable<boolean>): KfGroupe {
        const groupe = new KfGroupe('animeAttente');
        groupe.visible = false;
        /*
        groupe.visibilitéObs = visibilitéObs.pipe(
            tap(visible => {
                console.log(1, visible);
            })
        );
        */
        groupe.ajouteClasseDef('plein-ecran');
        groupe.fixeStyleDef('opacity', '.33');
        groupe.fixeStyleDef('background-color', 'antiquewhite');
        const icone = this.icone.iconeAttente(4);
        groupe.ajoute(icone);
        return groupe;
    }

    // etiquettes et texte

    /**
     * retourne une KfEtiquette dans une balise p au texte justifié si classe est défini
     * et l'ajoute à l'array si composants est défini
     * @param composants
     */
    ajouteEtiquetteP(composants?: KfComposant[], classe?: string): KfEtiquette {
        const e = new KfEtiquette('');
        e.baliseHtml = KfTypeDeBaliseHTML.p;
        e.ajouteClasseDef(classe ? classe : 'text-justify');
        if (composants) {
            composants.push(e);
        }
        return e;
    }

    /**
     * ajoute à une étiquette des KfTexte avec balise Html, retourne l'array des KfTexte créés
     * @param etiquette où ajouter le texte
     * @param texte string à ajouter
     * @param baliseHtml balise Html pour entourer le texte
     */
    ajouteTexte(etiquette: KfEtiquette, ...textes: (string | { t: string, b: KfTypeDeBaliseHTML })[]): KfTexte[] {
        const kfTextes: KfTexte[] = textes.map(t => {
            let texte: string;
            let baliseHtml: KfTypeDeBaliseHTML;
            if (typeof (t) === 'string') {
                texte = t;
            } else {
                texte = t.t;
                baliseHtml = t.b;
            }
            const kfTexte = new KfTexte('', texte);
            if (baliseHtml) {
                kfTexte.balisesAAjouter = [baliseHtml];
            }
            etiquette.contenuPhrase.ajoute(kfTexte);
            return kfTexte;
        });
        return kfTextes;
    }
}

export const Fabrique = new FabriqueClasse();
