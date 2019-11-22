import { IResultatAffichable } from './resultat-affichable';
import { KfTypeDeBaliseHTML } from '../../commun/kf-composants/kf-composants-types';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { BootstrapType, FabriqueBootstrap } from '../fabrique/fabrique-bootstrap';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { Subscription } from 'rxjs';

export class AfficheResultat {
    private _formulaire: KfGroupe;
    private _groupe: KfGroupe;

    private _titre: KfEtiquette;
    private _details: KfEtiquette;

    private _type: BootstrapType;

    resultat: IResultatAffichable;

    constructor(formulaire: KfGroupe) {
        this._formulaire = formulaire;
        this._groupe = new KfGroupe(formulaire.nom + '-res');
        this._groupe.visibilitéFnc = () => {
            if (this._type === undefined) {
                this.fixeContenus();
            }
            return !!this.resultat || !(formulaire.formGroup && formulaire.formGroup.valid);
        };

        this._titre = new KfEtiquette('titre');
        this._titre.ajouteClasseDef('font-weight-bold');
        this._titre.baliseHtml = KfTypeDeBaliseHTML.p;
        this._groupe.ajoute(this._titre);
        this._details = new KfEtiquette('détails', '');
        this._groupe.ajoute(this._details);
    }

    get groupe() {
        return this._groupe;
    }

    souscritStatut(): Subscription {
        const quandStatutChange = () => {
                this.resultat = undefined;
                if (this._formulaire.formGroup.invalid) {
                    this.fixeContenus();
                } else {
                    this._details.contenuPhrase.contenus = [];
                }
        };
        return this._formulaire.abstractControl.statusChanges.subscribe(() => quandStatutChange());
    }

    commence() {
        this.resultat = undefined;
    }
    affiche(resultat?: IResultatAffichable) {
        if (!resultat) { return; }
        this.resultat = resultat;
        this.fixeContenus();
    }
    fixeContenus() {
        const détails: string[] = [];
        let type: BootstrapType;
        let titre: string;
        const formGroup = this._formulaire.formGroup;
        if (formGroup.errors) {
            Object.keys(formGroup.errors).forEach(key => {
                const v = formGroup.errors[key];
                détails.push(v.value);
            });
            type = 'danger';
        }
        if (this.resultat) {
            type = this.resultat.typeAlert;
            titre = this.resultat.titre;
            if (this.resultat.détails) {
                this.resultat.détails.forEach(d => détails.push(d));
            }
        }
        if (type) {
            FabriqueBootstrap.ajouteClasse(this._groupe, 'alert', type);
            this._type = type;
        } else {
            this._type = 'success';
        }
        if (titre) {
            this._titre.fixeTexte(this.resultat.titre);
        }
        this._titre.nePasAfficher = !titre;
        this._details.contenuPhrase.contenus = détails.map(d => {
            const t = new KfTexte('', d);
            t.balisesAAjouter = [KfTypeDeBaliseHTML.p];
            return t;
        });
    }
}
