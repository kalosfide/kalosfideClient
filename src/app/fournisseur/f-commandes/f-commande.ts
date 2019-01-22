import { KeyUidRnoNo } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfVueCelluleDef, KfVueTableEnTete } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { copieKeyUidRnoNo } from 'src/app/commun/data-par-key/data-key';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfNombre } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-nombre';
import { CommandeLigneType, CommandeLigneDemande } from 'src/app/client/commandes/commande-ligne';
import { Tri } from 'src/app/commun/outils/trieur';

export class FCommande extends KeyUidRno {
    // key: fournisseur
    details: FCommandeDetail[];
}

export class FCommandeDetail extends KeyUidRnoNo {
    // key: commande
    // définis à l'entrée
    date?: Date;
    nomClient?: string;
    nouveauClient?: boolean;
    nbDetails?: number;
    // définis à la sortie
    accepte?: boolean;
}

export class FCommandeLigne extends KeyUidRnoNo {
    // key: commande
    date: Date;
    nomClient: string;
    nouveauClient: boolean;
    nbLignes: number;
    private _accepte: boolean;

    caseSelection: KfCaseACocher;
    etiquetteAccepte: KfEtiquette;
    etiquetteNomClient: KfEtiquette;

    private _superGroupe: KfSuperGroupe;

    constructor(fCommande: FCommandeDetail) {
        super();
        copieKeyUidRnoNo(fCommande, this);
        this.date = new Date(fCommande.date);
        this.nomClient = fCommande.nomClient;
        this.nouveauClient = fCommande.nouveauClient;
        this.nbLignes = fCommande.nbDetails;
    }

    créeFCommandeDetail(): FCommandeDetail {
        const detail = new FCommandeDetail();
        copieKeyUidRnoNo(this, detail);
        detail.accepte = this.accepte;
        return detail;
    }

    get texteNoBon(): string {
        return this.uid + '-' + this.rno + '-' + this.no;
    }

    get texteClient(): string {
        return this.nomClient + (this.nouveauClient ? ' (nouveau)' : '');
    }

    get texteDate(): string {
        return this.date.toLocaleDateString('fr-FR') + ' ' + this.date.toLocaleTimeString('fr-FR');
    }

    get texteDétails(): string {
        return `${ this.nbLignes } produit${ this.nbLignes > 1 ? 's' : ''}`;
    }

    private _créeSuperGroupe() {
        this._superGroupe = new KfSuperGroupe('' + this.uid);
        this._superGroupe.créeGereValeur();
        this._superGroupe.estRacineV = true;
        const uid = new KfNombre('uid');
        uid._valeur = this.no;
        uid.visibilite = false;
        this._superGroupe.ajoute(uid);
        const rno = new KfNombre('rno');
        rno._valeur = this.rno;
        rno.visibilite = false;
        this._superGroupe.ajoute(rno);
        const no = new KfNombre('no');
        no._valeur = this.no;
        no.visibilite = false;
        this._superGroupe.ajoute(no);
        this.caseSelection = new KfCaseACocher('selection');
        this.caseSelection.valeur = this.nouveauClient ? null : true;
        this._superGroupe.ajoute(this.caseSelection);
        this._superGroupe.quandTousAjoutés();
    }

    créeSuperGroupe() {
        if (!this._superGroupe) {
            this._créeSuperGroupe();
        }
    }

    get superGroupe(): KfSuperGroupe {
        if (!this._superGroupe) {
            this._créeSuperGroupe();
        }
        return this._superGroupe;
    }

    get cellulesEditables(): KfVueCelluleDef[] {
        if (!this._superGroupe) {
            this._créeSuperGroupe();
        }
        return [
            this.texteClient,
            this.texteNoBon,
            this.texteDate,
            this.texteDétails,
            this.caseSelection
        ];
    }

    get accepte(): boolean {
        return this._accepte;
    }
    set accepte(valeur: boolean) {
        if (this.estChoisie) {
            this._accepte = valeur;
        }
    }

    get estChoisie(): boolean {
        return this.caseSelection.aPourValeur(true);
    }

}

function compareClient(cl1: FCommandeLigne, cl2: FCommandeLigne): number {
    return cl1.nomClient > cl1.nomClient ? 1 : cl1.nomClient === cl2.nomClient ? 0 : -1;
}

export const FCommandeEnTetes: KfVueTableEnTete<FCommandeLigne>[] = [
    {
        texte: 'Client',
        tri: new Tri('client', compareClient)
    },
    {
        texte: 'No du bon',
    },
    {
        texte: 'Date',
    },
    {
        texte: 'Produits',
    },
    {
        texte: 'Accepter',
    },
];
