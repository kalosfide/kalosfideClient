import { KfListeDeroulante } from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../kf-partages/kf-evenements';
import { Trieur, Filtre } from '../../outils/trieur';
import { KfVueTable, KfVueTableLigne } from './kf-vue-table';
import { KfSuperGroupe } from '../kf-groupe/kf-super-groupe';

export type TFiltre = string | number;

export class KfVueTableFiltre<T> {
    nom: string;

    private _valide: (t: T, option: TFiltre) => boolean;

    private _groupe: KfGroupe;
    private _liste: KfListeDeroulante;

    constructor(nom: string, texte: string, valide: (t: T, option: TFiltre) => boolean, nullImpossible?: boolean) {
        this.nom = nom;
        this._valide = valide;

        this._groupe = new KfGroupe(this.nom);
        this._groupe.créeGereValeur();
        this._groupe.estRacineV = true;

        this._liste = new KfListeDeroulante(nom + '_L', texte);
        this._liste.nullImpossible = nullImpossible;
        this._liste.ajouteClasseDef('mb-2 mr-sm-2');
        this._liste.gereHtml.suitLaValeur = true;
        this._groupe.ajoute(this._liste);

        this._groupe.ajouteClasseDef('form-inline');
    }

    get groupe(): KfGroupe {
        return this._groupe;
    }

    charge(options: { texte: string, valeur: TFiltre }[], parDéfaut?: TFiltre) {
        options.forEach(o => {
            this._liste.ajouteOption(o.texte, o.valeur);
        });
        this._liste.valeur = parDéfaut;
    }

    valide(t: T): boolean {
        const valeur = this._liste.abstractControl.value;
        return valeur ? this._valide(t, valeur) : true;
    }

}

export class KfVueTableFiltres<T> {
    private _superGroupe: KfSuperGroupe;
    vueTable: KfVueTable<T>;
    filtres: KfVueTableFiltre<T>[];

    constructor(vueTable: KfVueTable<T>) {
        this.vueTable = vueTable;
        this.filtres = [];
    }

    ajouteFiltre(filtre: KfVueTableFiltre<T>) {
        this.filtres.push(filtre);
    }

    charge(nom: string, options: { texte: string, valeur: TFiltre }[], parDéfaut?: TFiltre) {
        const filtre = this.filtres.find(f => f.nom === nom);
        if (filtre) {
            filtre.charge(options, parDéfaut);
        }
    }

    créeSuperGroupe(): KfSuperGroupe {
        this._superGroupe = new KfSuperGroupe(this.vueTable.nom + '_filtres');
        this._superGroupe.créeGereValeur();
        this._superGroupe.estRacineV = true;

        this.filtres.forEach(f => {
            this._superGroupe.ajoute(f.groupe);
        });

        this._superGroupe.ajouteClasseDef('form-inline');
        this._superGroupe.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
            (evenement: KfEvenement) =>  {
                const lignes: KfVueTableLigne<T>[] = this.vueTable.lignes;
                lignes.forEach(l => {
                    let visible = true;
                    for (let index = 0; index < this.filtres.length && visible; index++) {
                        const filtre = this.filtres[index];
                        visible = filtre.valide(l.item);
                    }
                    l.visible = visible;
                });
                evenement.statut = KfStatutDEvenement.fini;
            });
        return this._superGroupe;
    }
}
