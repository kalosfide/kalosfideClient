import { KfComposant } from './kf-composant';

export class KfComposantGereVisible {

    composant: KfComposant;

    private _visibilité: boolean;
    private _visibilitéFnc: () => boolean;

    private _contenus: () => KfComposant[];
    aucunContenuVisible: () => boolean;
    private _indexSeulVisible: number | (() => number);

    constructor(composant: KfComposant) {
        this.composant = composant;
        this._visibilité = true;
    }

    /**
     *  méthodes pour fixer la façon de déterminer la visibilité
     */
    set visibilite(visibilite: boolean) {
        this._visibilité = visibilite;
    }
    set visibiliteFnc(visibiliteFnc: () => boolean) {
        this._visibilitéFnc = visibiliteFnc;
    }

    /**
     * permet de rendre invisible (class: kf-invisible = {display: none}) tous les contenus sauf un
     * les contenus doivent avoir pour parent this.composant
     * @param contenus fonction retournant l'array des composants gérés
     * @param fncIndexSeulVisible fonction retournant l'index du seul visible s'il y en a un
     */
    avecUnSeulContenuVisible(
        contenus: () => KfComposant[],
        fncIndexSeulVisible: () => number,
        aucunContenuVisible?: () => boolean
    ) {
        this._contenus = contenus;
        this._indexSeulVisible = fncIndexSeulVisible;
        this.aucunContenuVisible = aucunContenuVisible;
    }

    get contenus(): KfComposant[] {
        return this._contenus();
    }

    FixeIndexSeulVisible(noSeulContenuVisible: number) {
        this._indexSeulVisible = noSeulContenuVisible;
    }

    /**
     * retourne true si avec un seul contenu visible qui n'est pas celui passé en paramètre
     * @param contenu est dans contenus
     */
    cacheContenu(contenu: KfComposant): boolean {
        if (this.aucunContenuVisible && this.aucunContenuVisible()) {
            return true;
        }
        let seulContenuVisible: KfComposant = null;
        if (this._indexSeulVisible) {
            if (typeof (this._indexSeulVisible) === 'number') {
                seulContenuVisible = this.contenus[this._indexSeulVisible];
            } else {
                seulContenuVisible = this.contenus[this._indexSeulVisible()];
            }
        }
        if (seulContenuVisible) {
            return contenu !== seulContenuVisible;
        } else {
            return false;
        }
    }

    /**
     * estCachéParParent(): boolean
     *  le conteneur parent peut avoir une propriété seulContenuVisible
     */
    get estCachéParParent(): boolean {
        let gereVisible: KfComposantGereVisible;
        if (this.composant.parent) {
            gereVisible = this.composant.parent.gereVisible;
        } else {
            if (this.composant.listeParent) {
                gereVisible = this.composant.listeParent.composant.gereVisible;
            }
        }
        return gereVisible && gereVisible.cacheContenu(this.composant);
    }

    /**
     * visible: boolean
     *  utilisé par l'Angular component parent pour affecter ou non la classe css kf-invisible au template du composant
     */
    get visible(): boolean {
        return ((this._visibilitéFnc) ? this._visibilitéFnc() : this._visibilité) && !this.estCachéParParent;
    }

}
