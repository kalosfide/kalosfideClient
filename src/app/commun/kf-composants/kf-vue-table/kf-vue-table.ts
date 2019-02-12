import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfComposant, IKfComposant } from '../kf-composant/kf-composant';
import { KfComposantGereValeur } from '../kf-composant/kf-composant-gere-valeur';
import { KfSuperGroupe } from '../kf-groupe/kf-super-groupe';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { Tri, Trieur, Filtre, ITri } from '../../outils/trieur';
import { KfVueTableFiltres, KfVueTableFiltre, TFiltre } from './kf-vue-table-filtre';
import { KfTexte } from '../kf-elements/kf-texte/kf-texte';
import { KfIcone } from '../kf-elements/kf-icone/kf-icone';
import { KfContenuPhrase } from '../kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../kf-partages/kf-evenements';
import { KfEtiquette } from '../kf-elements/kf-etiquette/kf-etiquette';

export interface KfVueTableEnTete<T> {
    texte: string;
    tri?: Tri<T>;
}

export interface IKfVueTableCellule {
    texte?: string;
    composant?: KfComposant;
    classe?: string;
}

export interface IKfVueTableLigne {
    cellules: IKfVueTableCellule[];
    commandes: KfComposant[];
    composantsAValider: KfComposant[];
    visible: boolean;
    formGroup: FormGroup;
}

export class KfVueTableLigne<T> implements IKfVueTableLigne {
    item: T;
    cellules: IKfVueTableCellule[];
    superGroupe: KfSuperGroupe;
    commandes: KfComposant[];
    composantsAValider: KfComposant[];
    visible: boolean;
    get formGroup(): FormGroup { return this.superGroupe.formGroup; }
}

export type KfVueCelluleDef = string | KfComposant;

export interface KfVueTableDef<T> {
    enTetesDef: KfVueTableEnTete<T>[];
    cellules: (item: T) => KfVueCelluleDef[];
    classesCellules?: (item: T) => string[];
    superGroupe?: (item: T) => KfSuperGroupe;
    commandes?: (item: T) => KfComposant[];
    composantsAValider?: (item: T) => KfComposant[];
    filtres?: KfVueTableFiltre<T>[];
}

export interface IKfVueTable extends IKfComposant {
    enTetes: KfComposant[];
    lignes: IKfVueTableLigne[];
    avecValeur: boolean;
    avecCommandes: boolean;
    valeurs: any[];
    formGroups: FormGroup[];
    classeEntete?: string;
}

export class KfVueTable<T> extends KfComposant implements IKfVueTable {

    private _filtres: KfVueTableFiltres<T>;
    private _lignes: KfVueTableLigne<T>[];
    private _classeEntete: string;
    private _enTetesDef: KfVueTableEnTete<T>[];
    private _enTetes: KfComposant[];
    private _cellules: (item: T) => KfVueCelluleDef[];
    private _classesCellules: (item: T) => string[];
    private _superGroupe: (item: T) => KfSuperGroupe;
    private _commandes: (item: T) => KfComposant[];
    private _composantsAValider?: (item: T) => KfComposant[];

    get classeEntete(): string { return this._classeEntete; }
    get enTetes(): KfComposant[] { return this._enTetes; }
    get cellules(): (item: T) => KfVueCelluleDef[] { return this._cellules; }
    get classesCellules(): (item: T) => string[] { return this._classesCellules; }
    get superGroupe(): (item: T) => KfSuperGroupe { return this._superGroupe; }
    get commandes(): (item: T) => KfComposant[] { return this._commandes; }
    get composantsAValider(): (item: T) => KfComposant[] { return this._composantsAValider; }

    constructor(nom: string, vueTableDef: KfVueTableDef<T>) {
        super(nom, KfTypeDeComposant.vuetable);
        this._lignes = [];
        this._enTetesDef = vueTableDef.enTetesDef;
        this._cellules = vueTableDef.cellules;
        this._classesCellules = vueTableDef.classesCellules;
        if (vueTableDef.superGroupe) {
            this._superGroupe = vueTableDef.superGroupe;
            this.gereValeur = new KfComposantGereValeur(this, KfTypeDeValeur.avecListe);
        }
        if (vueTableDef.commandes) {
            this._commandes = vueTableDef.commandes;
        }
        if (vueTableDef.filtres) {
            this._filtres = new KfVueTableFiltres(this);
            vueTableDef.filtres.forEach(f => this._filtres.ajouteFiltre(f));
        }
        this._composantsAValider = vueTableDef.composantsAValider;
        this.ajouteClasseDef('table');
    }

    ajouteClasseEntete(classeEntete: string) {
        this._classeEntete = classeEntete;
    }

    get avecFiltres(): boolean {
        return !!this._filtres;
    }
    créeSuperGroupeDesFiltres(): KfSuperGroupe {
        return this._filtres.créeSuperGroupe();
    }

    chargeFiltre(nom: string, options: { texte: string, valeur: TFiltre }[], parDéfaut?: TFiltre) {
        this._filtres.charge(nom, options, parDéfaut);
    }

    get avecValeur(): boolean {
        return !!this._superGroupe;
    }

    get avecCommandes(): boolean {
        return !!this._commandes;
    }

    get avecComposantsAValider(): boolean {
        return !!this._composantsAValider;
    }

    get lignes(): KfVueTableLigne<T>[] {
        return this._lignes;
    }

    get valeurs(): any[] {
        return this._lignes.map(l => l.superGroupe.valeur);
    }

    get formGroups(): FormGroup[] {
        return this._lignes.map(l => l.superGroupe.formGroup);
    }

    iconeDef(tri: Tri<T>): IconDefinition {
        if (tri) {
            if (tri.desc === true) {
                return faSortUp;
            }
            return faSortDown;
        }
    }

    créeLigne(item: T): KfVueTableLigne<T> {
        const ligne = new KfVueTableLigne<T>();
        ligne.item = item;
        const c = this._cellules(item);
        let classe: (index: number) => string;
        if (this._classesCellules)  {
            const classes = this._classesCellules(item);
            classe = (index: number) => {
                return index < classes.length ? classes[index] : classes[classes.length - 1];
            };
        }
        ligne.cellules = [];
        for (let index = 0; index < c.length; index++) {
            const celluleDef = c[index];
            const icellule: IKfVueTableCellule = {};
            if (typeof (celluleDef) === 'string') {
                icellule.texte = celluleDef;
            } else {
                icellule.composant = celluleDef as KfComposant;
            }
            if (classe) {
                icellule.classe = classe(index);
            }
            ligne.cellules.push(icellule);
        }
        if (this._superGroupe) {
            ligne.superGroupe = this._superGroupe(item);
            ligne.superGroupe.listeParent = this;
        }
        if (this._commandes) {
            ligne.commandes = this._commandes(item);
        }
        if (this._composantsAValider) {
            ligne.composantsAValider = this._composantsAValider(item);
        }
        ligne.visible = true;
        return ligne;
    }

    get formArray(): FormArray {
        if (this.avecValeur) {
            return this.gereValeur.abstractControl as FormArray;
        }
    }

    ajouteItem(index: number, item: T) {
        const ligne = this.créeLigne(item);
        this._lignes.splice(index, 0, ligne);
        if (this.avecValeur) {
            if (this.formArray) {
                this.formArray.insert(index, ligne.formGroup);
            }
        }
    }

    supprimeItem(index: number) {
        this._lignes.splice(index, 1);
        if (this.formArray) {
            this.formArray.removeAt(index);
        }
    }

    videLignes() {
        this._lignes = [];
        if (this.formArray) {
            while (this.formArray.controls.length > 0) {
                this.formArray.removeAt(0);
            }
        }
    }

    remplitLignes(items: T[]) {
        this.videLignes();
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            this.ajouteItem(index, item);
        }
    }

    initialise(items: T[]) {
        if (this._enTetesDef) {
            let index = 0;
            this._enTetes = this._enTetesDef.map(edef => {
                index++;
                const e = new KfEtiquette('e' + index, edef.texte);
                if (edef.tri) {
                    const i = new KfIcone('i' + index, this.iconeDef(edef.tri), true);
                    e.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic,
                        (evenement: KfEvenement) => {
                            if (evenement.emetteur === i) {
                                this._lignes = edef.tri.trieDérivés<KfVueTableLigne<T>>(this._lignes, (l: KfVueTableLigne<T>) => l.item);
                                i.iconeDef = this.iconeDef(edef.tri);
                                evenement.statut = KfStatutDEvenement.fini;
                            }
                        });
                    e.contenuPhrase.ajoute(i);
                    items = edef.tri.trie(items);
                }
                return e;
            });
        }
        this.remplitLignes(items);
    }
}
