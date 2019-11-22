import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfVueTable } from './kf-vue-table';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfVueTableLigne } from './kf-vue-table-ligne';
import { KfGèreCss } from '../kf-partages/kf-gere-css';
import { IKfVueTableOutilVue, IKfVueTableOutil } from './kf-vue-table-outil';
import { KfBBtnToolbar } from '../kf-b-btn-toolbar/kf-b-btn-toolbar';

export interface IKfVueTableOutils {
    nePasAfficher: boolean;
    outils: IKfVueTableOutilVue[];
    classe: KfNgClasse;
}

export class KfVueTableOutils<T> extends KfGèreCss implements IKfVueTableOutils {
    private _vueTable: KfVueTable<T>;
    private _outils: IKfVueTableOutil<T>[];
    private _texteRienPasseFiltres: string;
    private _btnToolbar: KfBBtnToolbar;

    constructor() {
        super();
        this._outils = [];
        // créer btnToolbar ici pour pouvoir lui ajouter des classes css
        this._btnToolbar = new KfBBtnToolbar('outils');
        this._texteRienPasseFiltres = `Il n'y aucune ligne correspondant aux critères de filtrage.`;
    }

    /** remplace les lignes quand les filtres ne laissent rien passer */
    get texteRienPasseFiltres(): string {
        return this._texteRienPasseFiltres;
    }
    set texteRienPasseFiltres(texteRienPasseFiltres: string) {
        this._texteRienPasseFiltres = texteRienPasseFiltres;
    }

    initialise(vueTable: KfVueTable<T>) {
        this._vueTable = vueTable;
        this.suitLaVisiblité(vueTable);
        this._btnToolbar.créeGereValeur();
        this._btnToolbar.estRacineV = true;
        this._btnToolbar.sauveQuandChange = true;
        this._outils.forEach(outil => {
            this._btnToolbar.ajoute(outil.composant);
            if (outil.initialise) {
                outil.initialise(this);
            }
        });
    }

    get filtreActif(): boolean {
        let actif = false;
        this._outils.forEach(o => actif = actif || o.filtreActif);
        return actif;
    }

    /**
     * définit des classes css à appliquer suivant l'état des filtres
     * @param siFiltreActif classe css du groupe des outils quand un filtre est actif
     * @param siFiltreInactif classe css du groupe des outils quand aucun filtre n'est actif
     */
    fixeClassesFiltre(siFiltreActif?: string, siFiltreInactif?: string) {
        if (siFiltreActif) {
            this.ajouteClasseDef({
                nom: siFiltreActif,
                active: () => this.filtreActif
            });
        }
        if (siFiltreInactif) {
            this.ajouteClasseDef({
                nom: siFiltreInactif,
                active: () => !this.filtreActif
            });
        }
    }

    get btnToolbar(): KfBBtnToolbar {
        return this._btnToolbar;
    }

    ajoute(outil: IKfVueTableOutil<T>) {
        this._outils.push(outil);
    }

    outil(nom: string): IKfVueTableOutil<T> {
        const outil = this._outils.find(f => f.nom === nom);
        return outil;
    }

    appliqueFiltres() {
        const valides: ((t: T) => boolean)[] = this._outils
            .filter(outil => outil.valide !== undefined)
            .map(filtre => filtre.valide);
        const lignes: KfVueTableLigne<T>[] = this._vueTable.lignes;
        lignes.forEach(l => {
            let passeFiltre = true;
            for (let index = 0; index < valides.length && passeFiltre; index++) {
                const valide = valides[index];
                passeFiltre = valide(l.item);
            }
            l.passeFiltres = passeFiltre;
        });
    }

    supprimeFiltres() {
        this._vueTable.lignes.forEach(l => l.passeFiltres = true);
    }

    get outils(): IKfVueTableOutil<T>[] {
        return this._outils;
    }
}
