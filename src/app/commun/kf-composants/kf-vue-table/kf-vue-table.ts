import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfComposant, IKfComposant } from '../kf-composant/kf-composant';
import { KfComposantGereValeur } from '../kf-composant/kf-composant-gere-valeur';
import { KfSuperGroupe } from '../kf-groupe/kf-super-groupe';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { Tri, Trieur, Filtre, ITri } from '../../outils/trieur';
import { KfVueTableFiltres, KfVueTableFiltre, TFiltre } from './kf-vue-table-filtre';

export interface IKfVueTableEnTete {
    texte: string;
    tri: ITri;
}

export interface KfVueTableEnTete<T> {
    texte: string;
    tri?: Tri<T>;
}

export interface KfVueTableCellule {
    texte?: string;
    composant?: KfComposant;
}

export interface IKfVueTableLigne {
    cellules: KfVueTableCellule[];
    commandes: KfComposant[];
    visible: boolean;
    formGroup: FormGroup;
}

export class KfVueTableLigne<T> implements IKfVueTableLigne {
    item: T;
    cellules: KfVueTableCellule[];
    superGroupe: KfSuperGroupe;
    commandes: KfComposant[];
    visible: boolean;
    get formGroup(): FormGroup { return this.superGroupe.formGroup; }
}

export type KfVueCelluleDef = string | KfComposant;

export interface KfVueTableDef<T> {
    enTetes: KfVueTableEnTete<T>[];
    cellules: (ligne: any) => KfVueCelluleDef[];
    superGroupe?: (ligne: any) => KfSuperGroupe;
    commandes?: (ligne: any) => KfComposant[];
    filtres?: KfVueTableFiltre<T>[];
}

export interface IKfVueTable extends IKfComposant {
    enTetes: IKfVueTableEnTete[];
    lignes: IKfVueTableLigne[];
    avecValeur: boolean;
    avecCommandes: boolean;
    valeurs: any[];
    formGroups: FormGroup[];
    trie: (enTete: IKfVueTableEnTete) => void;
}

export class KfVueTable<T> extends KfComposant implements IKfVueTable {

    private _filtres: KfVueTableFiltres<T>;
    private _lignes: KfVueTableLigne<T>[];
    private _enTetes: KfVueTableEnTete<T>[];
    private _cellules: (ligne: T) => KfVueCelluleDef[];
    private _superGroupe: (ligne: T) => KfSuperGroupe;
    private _commandes: (ligne: T) => KfComposant[];

    get enTetes(): IKfVueTableEnTete[] { return this._enTetes.map(e => e as IKfVueTableEnTete); }
    get cellules(): (ligne: T) => KfVueCelluleDef[] { return this._cellules; }
    get superGroupe(): (ligne: T) => KfSuperGroupe { return this._superGroupe; }
    get commandes(): (ligne: T) => KfComposant[] { return this._commandes; }

    constructor(nom: string, vueTableDef: KfVueTableDef<T>) {
        super(nom, KfTypeDeComposant.vuetable);
        this._lignes = [];
        this._enTetes = vueTableDef.enTetes;
        this._cellules = vueTableDef.cellules;
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
        return !!this.commandes;
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

    créeCellule(contenu: KfVueCelluleDef): KfVueTableCellule {
        if (typeof (contenu) === 'string') {
            return { texte: contenu };
        } else {
            return { composant: contenu as KfComposant };
        }
    }

    créeLigne(item: T): KfVueTableLigne<T> {
        const ligne = new KfVueTableLigne<T>();
        ligne.item = item;
        const c = this._cellules(item);
        ligne.cellules = c.map(cel => this.créeCellule(cel));
        if (this._superGroupe) {
            ligne.superGroupe = this._superGroupe(item);
        }
        if (this._commandes) {
            ligne.commandes = this._commandes(item);
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
        if (this._enTetes) {
            this._enTetes.forEach(e => {
                if (e.tri) {
                    items = e.tri.trie(items);
                }
            });
            }
        this.remplitLignes(items);
    }

    trie(iEnTete: IKfVueTableEnTete) {
        if (!iEnTete.tri) { return; }
        const enTete = this._enTetes.find(e => e.tri && e.tri.nom === iEnTete.tri.nom);
        if (enTete) {
            this._lignes = enTete.tri.trieDérivés<KfVueTableLigne<T>>(this._lignes, (l: KfVueTableLigne<T>) => l.item);
        }
    }
}
