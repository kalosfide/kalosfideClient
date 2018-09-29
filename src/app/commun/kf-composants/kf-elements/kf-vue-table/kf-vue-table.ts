import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfElement } from '../../kf-composant/kf-element';

export interface KfVueTableCellule {
    texte?: string;
    composants?: KfComposant[];
}

export class KfVueTable extends KfElement {

    private _lignes: any[];

    lignesDeCellules: (KfVueTableCellule[])[];

    colonnes: string[];
    contenus: (ligne: any) => (string | KfComposant[])[];
    choisie: (ligne: any) => boolean;

    constructor(nom: string,
        colonnes: string[],
        cellules: (ligne: any) => (string | KfComposant[])[],
        choisie: (ligne: any) => boolean
        ) {
        super(nom, KfTypeDeComposant.vuetable);
        this.lignesDeCellules = [];
        this.colonnes = colonnes;
        this.contenus = cellules;
        this.choisie = choisie;
    }

    get lignes(): (KfVueTableCellule[])[] {
        return this.lignesDeCellules;
    }

    fixeLignes(lignes: any[]) {
        this._lignes = lignes;
        this.lignesDeCellules = [];
        if (lignes) {
            lignes.forEach(
                ligne => {
                    const cellules = this.contenus(ligne).map(
                        contenu => {
                            console.log(contenu);
                            if (typeof(contenu) === 'string') {
                                return { texte: contenu };
                            } else {
                                return { composants: contenu };
                            }
                        }
                    );
                    this.lignesDeCellules.push(cellules);
                }
            );
        }
    }

}
