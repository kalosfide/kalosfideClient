import { KeyUidRnoNo } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { KfComposant } from '../../commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfVueCelluleDef, KfVueTableEnTete } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { copieKeyUidRnoNo } from 'src/app/commun/data-par-key/data-key';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfInputNombre } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-nombre';
import { Tri } from 'src/app/commun/outils/trieur';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import {
    KfTypeDEvenement, KfEvenement, KfStatutDEvenement, KfTypeDHTMLEvents } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { KfIcone } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone';
import { faCheck, faBan } from '@fortawesome/free-solid-svg-icons';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfRadios } from 'src/app/commun/kf-composants/kf-elements/kf-radios/kf-radios';
import { KfRadio } from 'src/app/commun/kf-composants/kf-elements/kf-radios/kf-radio';

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
    etat?: string;
}

export const CODE_ACCEPTE = 'A';
export const CODE_REFUSE = 'R';
const TEXTE_ACCEPTE = 'accepté';
const TEXTE_REFUSE = 'refusé';
const TEXTE_A_FIXER = '(à fixer)';
export const ICONE_ACCEPTER = faCheck;
export const ICONE_REFUSER = faBan;

export class FCommandeLigne extends KeyUidRnoNo {
    // key: commande
    date: Date;
    nomClient: string;
    nouveauClient: boolean;
    nbLignes: number;
    private _etat: string;

    etiquetteClient: KfEtiquette;
    radiosEtat: KfRadios;

    private _superGroupe: KfSuperGroupe;

    constructor(fCommande: FCommandeDetail) {
        super();
        copieKeyUidRnoNo(fCommande, this);
        this.date = new Date(fCommande.date);
        this.nomClient = fCommande.nomClient;
        this.nouveauClient = fCommande.nouveauClient;
        if (!this.nouveauClient) {
            this._etat = CODE_ACCEPTE;
        }
        this.nbLignes = fCommande.nbDetails;
    }

    get etat(): string {
        return this.radiosEtat.valeur;
    }

    créeFCommandeDetail(): FCommandeDetail {
        const detail = new FCommandeDetail();
        copieKeyUidRnoNo(this, detail);
        detail.etat = this.etat;
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
        return `${this.nbLignes} produit${this.nbLignes > 1 ? 's' : ''}`;
    }

    private  _créeSuperGroupe() {
        const superGroupe = new KfSuperGroupe('' + this.uid);
        superGroupe.créeGereValeur();
        superGroupe.estRacineV = true;
        const uid = new KfInputNombre('uid');
        uid._valeur = this.no;
        uid.visibilite = false;
        superGroupe.ajoute(uid);
        const rno = new KfInputNombre('rno');
        rno._valeur = this.rno;
        rno.visibilite = false;
        superGroupe.ajoute(rno);
        const no = new KfInputNombre('no');
        no._valeur = this.no;
        no.visibilite = false;
        superGroupe.ajoute(no);

        const etiquetteClient = new KfEtiquette('client', this.nomClient);
        if (this.nouveauClient) {
            const nouveau = new KfTexte('nouveau', '(nouveau)');
            nouveau.balisesAAjouter = [KfTypeDeBaliseHTML.strong];
            etiquetteClient.contenuPhrase.ajoute(nouveau);
        }
        superGroupe.ajoute(etiquetteClient);

        const radios = new KfRadios('etat');
        radios.avecNgBootstrap = true;
        radios.ajouteValidateur(KfValidateurs.required);
        const classeRadio = 'btn-secondary btn-sm';
        const classeTexteChoisi = 'text-warning';
        let radio = new KfRadio(radios.nom + 1, CODE_ACCEPTE);
        radio.ajouteClasseDef(classeRadio);
        let texte = new KfTexte('', 'Accepté');
        texte.ajouteClasseDef(() => radios.valeur === CODE_ACCEPTE ? classeTexteChoisi : '');
        radio.contenuPhrase.ajoute(texte);
        radios.ajoute(radio);
        radio = new KfRadio(radios.nom + 2, CODE_REFUSE);
        radio.ajouteClasseDef(classeRadio);
        texte = new KfTexte('', 'Refusé');
        texte.ajouteClasseDef(() => radios.valeur === CODE_REFUSE ? classeTexteChoisi : '');
        radio.contenuPhrase.ajoute(texte);
        radios.ajoute(radio);
        radios.valeur = this._etat;
        superGroupe.ajoute(radios);

        superGroupe.quandTousAjoutés();
        this._superGroupe = superGroupe;
        this.etiquetteClient = etiquetteClient;
        this.radiosEtat = radios;
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

    get cellules(): KfVueCelluleDef[] {
        if (!this._superGroupe) {
            this._créeSuperGroupe();
        }
        return [
            this.etiquetteClient,
            this.texteNoBon,
            this.texteDate,
            this.texteDétails,
            this.radiosEtat
        ];
    }

    get composantsAValider(): KfComposant[] {
        return [this.radiosEtat];
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
        texte: 'Réception',
    },
];
