import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { KfComposant, IKfComposant } from '../kf-composant/kf-composant';
import { KfComposantGereValeur } from '../kf-composant/kf-composant-gere-valeur';
import { KfSuperGroupe } from '../kf-groupe/kf-super-groupe';
import { FormArray, FormGroup } from '@angular/forms';
import { Tri } from '../../outils/trieur';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { IKfVueTableColonneDef } from './i-kf-vue-table-colonne-def';
import { KfVueTableColonne } from './kf-vue-table-colonne';
import { IKfVueTableLigne, KfVueTableLigne, KfVueTableBilan } from './kf-vue-table-ligne';
import { KfNgClasse, KfNgClasseDef } from '../kf-partages/kf-gere-css-classe';
import { KfTexteDef } from '../kf-partages/kf-texte-def';
import { KfGèreCss } from '../kf-partages/kf-gere-css';
import { KfVueTableOutils, IKfVueTableOutils } from './kf-vue-table-outils';
import { KfInitialObservable } from '../kf-partages/kf-initial-observable';
import { IKfVueTableDef } from './i-kf-vue-table-def';
import { KfVueTableEnTete } from './kf-vue-table-en-tete';

/** pour que le component soit indépendant du générique T */
export interface IKfVueTable extends IKfComposant {
    outils: IKfVueTableOutils;
    ilignes: IKfVueTableLigne[];
    avecValeur: boolean;
    valeurs: any[];
    formGroups: FormGroup[];
    lignesEnTete: IKfVueTableLigne[];
    lignesBilan: IKfVueTableLigne[];
    groupeDesOutils: KfGroupe;
}

export class KfVueTable<T> extends KfComposant implements IKfVueTable {
    /**
     * pile des tris effectués
     */
    private _tris: Tri<T>[];

    private _def: IKfVueTableDef<T>;

    private _outils: KfVueTableOutils<T>;
    private _colonnes: KfVueTableColonne<T>[];
    private _lignes: KfVueTableLigne<T>[];
    private _enTete: KfVueTableEnTete<T>;
    private _gereCssEnTete: KfGèreCss;
    private _gereCssCorps: KfGèreCss;
    private _ligneBilan: KfVueTableBilan<T>;
    private _ligneBilanDesVisibles: KfVueTableBilan<T>;
    private _gereCssBilan: KfGèreCss;
    private _enveloppe: KfGèreCss;

    private _choisie: KfVueTableLigne<T>;
    private _fixeChoisie: (id: string) => KfVueTableLigne<T>;

    private _remplaceSiVide: KfGroupe;

    constructor(nom: string, vueTableDef: IKfVueTableDef<T>) {
        super(nom, KfTypeDeComposant.vuetable);
        this._def = vueTableDef;
        this._lignes = [];
        this.ajouteClasseDef('table');
        if (vueTableDef.superGroupe) {
            this.gereValeur = new KfComposantGereValeur(this, KfTypeDeValeur.avecListe);
        }

        this.créeColonnes(vueTableDef.colonnesDef);

        if (vueTableDef.outils) {
            this._outils = vueTableDef.outils;
            this._outils.initialise(this);
        }

        if (this._def.id) {
            this._fixeChoisie = (id: string) => {
                this._choisie = this._lignes.find(l => this._def.id(l.item) === id);
                return this._choisie;
            };
        }

        if (vueTableDef.colonnesDef.find(c => c.enTeteDef !== undefined) !== undefined) {
            this._enTete = new KfVueTableEnTete(this);
        }

        const colonnesAvecBilan = vueTableDef.colonnesDef.filter(c => c.bilanDef !== undefined && c.bilanDef !== null);
        if (colonnesAvecBilan.length > 0) {
            this._ligneBilan = new KfVueTableBilan(this);
            const colonnesAvecVisiblesSeulement = colonnesAvecBilan.filter(
                c => c.bilanDef.titreVisiblesSeulement !== undefined && c.bilanDef.titreVisiblesSeulement !== null
            );
            if (colonnesAvecVisiblesSeulement.length > 0) {
                this._ligneBilanDesVisibles = new KfVueTableBilan(this, true);
            }
        }
    }

    private créeColonnes(colonnesDef: IKfVueTableColonneDef<T>[]) {
        const colonnes: KfVueTableColonne<T>[] = [];
        const listeNePasAfficher: {
            io: KfInitialObservable<boolean>,
            colonnes: KfVueTableColonne<T>[]
        }[] = [];
        const listeAfficher: {
            io: KfInitialObservable<boolean>,
            colonnes: KfVueTableColonne<T>[]
        }[] = [];
        for (let index = 0; index < colonnesDef.length; index++) {
            const def = colonnesDef[index];
            const colonne = new KfVueTableColonne<T>(this, def, index);
            colonnes.push(colonne);
            let liste: {
                io: KfInitialObservable<boolean>,
                colonnes: KfVueTableColonne<T>[]
            }[];
            let io: KfInitialObservable<boolean>;
            if (def.nePasAfficherSi) {
                liste = listeNePasAfficher;
                io = def.nePasAfficherSi;
            } else {
                if (def.afficherSi) {
                    liste = listeAfficher;
                    io = def.afficherSi;
                }
            }
            if (liste) {
                let masqueur = liste.find(m => m.io === io);
                if (masqueur) {
                    masqueur.colonnes.push(colonne);
                } else {
                    masqueur = {
                        io: io,
                        colonnes: [colonne]
                    };
                    liste.push(masqueur);
                }
            }
        }
        this._colonnes = colonnes;
        listeNePasAfficher.forEach(m => {
            m.colonnes.forEach(colonne => {
                colonne.nePasAfficher = m.io.valeur;
            });
            if (m.io.observable) {
                m.io.observable.subscribe(nePasAfficher => {
                    m.colonnes.forEach(colonne => {
                        colonne.nePasAfficher = nePasAfficher;
                    });
                });
            }
        });
        listeAfficher.forEach(m => {
            m.colonnes.forEach(colonne => {
                colonne.nePasAfficher = !m.io.valeur;
            });
            if (m.io.observable) {
                m.io.observable.subscribe(afficher => {
                    m.colonnes.forEach(colonne => {
                        colonne.nePasAfficher = !afficher;
                    });
                });
            }
        });
    }

    get colonnes(): KfVueTableColonne<T>[] { return this._colonnes; }
    get avecEnTêtesDeLigne(): boolean { return this._def.avecEnTêtesDeLigne; }
    get superGroupe(): (item: T) => KfSuperGroupe { return this._def.superGroupe; }
    get gereCss(): (item: T) => KfGèreCss { return this._def.gereCss; }
    get composantsAValider(): (item: T) => KfComposant[] { return this._def.composantsAValider; }
    get id(): (item: T) => string { return this._def.id; }

    get index(): number { return this._choisie ? this._choisie.index : -1; }

    get fixeChoisie(): (id: string) => KfVueTableLigne<T> {
        return this._fixeChoisie;
    }

    /**
     * définit des classes css à appliquer suivant létat et l'effet des filtres
     * @param siFiltrée classe css du corps de la table quand des lignes sont arrêtées par les filtres
     * @param siNonFiltrée classe css du corps de la table quand aucune ligne n'est arrêtée par les filtres
     */
    fixeClassesFiltre(siFiltrée?: string, siNonFiltrée?: string) {
        if (siFiltrée) {
            this.ajouteClasseCorps({
                nom: siFiltrée,
                active: () => this.estFiltrée
            });
        }
        if (siNonFiltrée) {
            this.ajouteClasseCorps({
                nom: siNonFiltrée,
                active: () => !this.estFiltrée
            });
        }
    }

    get estFiltrée(): boolean {
        return this._lignes.find(l => !l.passeFiltres) !== undefined;
    }
    get rienPasseFiltres(): boolean {
        return this._lignes.find(l => l.passeFiltres) === undefined;
    }
    /** remplace les lignes quand les filtres ne laissent rien passer */
    get texteRienPasseFiltres(): string {
        return this._outils.texteRienPasseFiltres;
    }
    /** colspan du td du texte qui remplace les lignes quand les filtres ne laissent rien passer */
    get nbColonnesVisibles(): number {
        return this._colonnes.filter(c => !c.nePasAfficher).length;
    }

    get remplaceSiVide(): KfGroupe { return this._remplaceSiVide; }
    get estVide(): boolean { return this._lignes.length === 0; }

    ajouteClasseEnTete(...classeDefs: (KfTexteDef | KfNgClasseDef)[]) {
        if (!this._gereCssEnTete) {
            this._gereCssEnTete = new KfGèreCss();
        }
        this._gereCssEnTete.ajouteClasseDefArray(classeDefs);
    }

    get gereCssEnTete(): KfGèreCss { return this._gereCssEnTete; }

    get classeEnTete(): KfNgClasse {
        if (this._gereCssEnTete) {
            return this._gereCssEnTete.classe;
        }
    }

    get lignesEnTete(): IKfVueTableLigne[] {
        if (this._enTete) {
            return this._enTete.lignes;
        }
    }

    ajouteClasseCorps(...classeDefs: (KfTexteDef | KfNgClasseDef)[]) {
        if (!this._gereCssCorps) {
            this._gereCssCorps = new KfGèreCss();
        }
        this._gereCssCorps.ajouteClasseDefArray(classeDefs);
    }

    get gereCssCorps(): KfGèreCss { return this._gereCssCorps; }

    get classeCorps(): KfNgClasse {
        if (this._gereCssCorps) {
            return this._gereCssCorps.classe;
        }
    }

    get lignesBilan(): IKfVueTableLigne[] {
        if (this._ligneBilan) {
            return this.estFiltrée ? [this._ligneBilanDesVisibles, this._ligneBilan] : [this._ligneBilan];
        }
    }

    ajouteClasseBilan(...classeDefs: (KfTexteDef | KfNgClasseDef)[]) {
        if (!this._gereCssBilan) {
            this._gereCssBilan = new KfGèreCss();
        }
        this._gereCssBilan.ajouteClasseDefArray(classeDefs);
    }

    get gereCssBilan(): KfGèreCss { return this._gereCssBilan; }

    get classeBilan(): KfNgClasse {
        if (this._gereCssBilan) {
            return this._gereCssBilan.classe;
        }
    }

    get outils(): KfVueTableOutils<T> {
        if (this._outils) {
            return this._outils;
        }
    }

    /** sert à initialiser les controls */
    get groupeDesOutils(): KfGroupe {
        if (this._outils) {
            return this._outils.btnToolbar;
        }
    }

    get enveloppe(): KfGèreCss {
        return this._enveloppe;
    }

    /** pour mettre un élément div autour des outils */
    set enveloppe(enveloppe: KfGèreCss) {
        this._enveloppe = enveloppe;
    }

    get avecValeur(): boolean {
        return !!this.superGroupe;
    }

    get avecComposantsAValider(): boolean {
        return !!this.composantsAValider;
    }

    get lignes(): KfVueTableLigne<T>[] {
        return this._lignes;
    }

    get ilignes(): IKfVueTableLigne[] {
        return this._lignes.filter(l => l.passeFiltres);
    }

    get lignesDansLOrdreDesItems(): KfVueTableLigne<T>[] {
        return this._lignes.sort((l1, l2) => {
            return l1.index < l2.index ? -1 : l1.index === l2.index ? 0 : 1;
        });
    }

    get items(): T[] {
        return this.lignesDansLOrdreDesItems.map(l => l.item);
    }

    get valeurs(): any[] {
        return this.lignesDansLOrdreDesItems.map(l => l.superGroupe.valeur);
    }

    get formGroups(): FormGroup[] {
        return this.lignesDansLOrdreDesItems.map(l => l.superGroupe.formGroup);
    }

    get formArray(): FormArray {
        if (this.avecValeur) {
            return this.gereValeur.abstractControl as FormArray;
        }
    }

    ajouteItem(index: number, item: T) {
        const ligne = new KfVueTableLigne<T>(this, item, index);
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

    trie(tri: Tri<T>) {
        this._lignes = tri.trieDérivés<KfVueTableLigne<T>>(this._lignes, (l: KfVueTableLigne<T>) => l.item);
        this._tris.push(tri);
    }

    initialise(items: T[]) {
        this.remplitLignes(items);
        if (this._outils) {
            this._outils.appliqueFiltres();
        }
    }
}
