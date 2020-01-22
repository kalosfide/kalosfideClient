import { Catalogue } from '../catalogue/catalogue';
import { IKeyUidRnoNo2 } from 'src/app/commun/data-par-key/key-uid-rno-no-2/i-key-uid-rno-no-2';
import { Produit } from '../catalogue/produit';
import { DocCLF } from './document';
import { ApiLigneData, ApiLigne } from './api-ligne-data';
import { LigneEditeur } from './ligne-editeur';
import { IDataKeyComponent } from 'src/app/commun/data-par-key/i-data-key-component';
import { KeyUidRnoNo2 } from 'src/app/commun/data-par-key/key-uid-rno-no-2/key-uid-rno-no-2';
import { TypeMesure } from '../type-mesure';
import { DATE_NULLE } from '../date-nulle';
import { Client } from '../client/client';
import { EtatClient } from '../client/etat-client';
import { TypeCommande } from '../type-commande';

export class LignePropriétés {
    àFixer: () => number;
    source: () => number;
}

export class LigneDocument implements IKeyUidRnoNo2 {
    private _parent: DocCLF;
    apiData: ApiLigneData;

    /**
     * Produit demandé
     */
    private _produit: Produit;

    /**
     * Prix du produit à la date de la commande.
     */
    private _prix: number;

    ajout: boolean;

    àFixer: () => number;
    source: () => number;
    copiable: () => boolean;
    copieSource: () => void;

    private _éditeur: LigneEditeur;

    constructor(parent: DocCLF, produit: Produit) {
        this._parent = parent;
        this._produit = produit;
        if (parent.synthèse) {
            switch (parent.type) {
                case 'commande':
                    this.source = () => this.demande;
                    this.àFixer = () => this.aLivrer;
                    this.copiable = () =>
                        !(this.produit.typeCommande === TypeCommande.id.ALUnitéOuEnVrac && this.typeCommande === TypeCommande.id.ALUnité);
                    this.copieSource = () => this.aLivrer = this.demande;
                    break;
                case 'livraison':
                    this.source = () => this.aLivrer;
                    this.àFixer = () => this.aFacturer;
                    this.copiable = () => true;
                    this.copieSource = () => this.aFacturer = this.aLivrer;
                    break;
            }
        }
    }

    get parent(): DocCLF {
        return this._parent;
    }

    get uid(): string { return this._parent.uid; }
    get rno(): number { return this._parent.rno; }
    get no(): number { return this._parent.no; }
    get uid2(): string { return this._produit.uid; }
    get rno2(): number { return this._produit.rno; }
    get no2(): number { return this._produit.no; }

    get produit(): Produit { return this._produit; }
    /** présent si dans préparation de livraison */
    get client(): Client { return this._parent.client; }

    get date(): Date {
        switch (this._parent.type) {
            case 'commande':
                return this._parent.date;
            case 'livraison':
            case 'facture':
                return this.apiData.date;
        }
    }

    créeEditeur(component: IDataKeyComponent) {
        this._éditeur = new LigneEditeur(this, component);
    }
    get éditeur(): LigneEditeur { return this._éditeur; }


    get nomProduit(): string { return this._produit.nom; }
    get noCategorie(): number { return this._produit.categorieNo; }
    get nomCategorie(): string { return this._produit.nomCategorie; }
    get typeMesure(): string { return this._produit.typeMesure; }
    get prix(): number {
        if (!this._prix) {
            this._prix = Catalogue.prixDaté(this._parent.catalogue, this._produit.no, this.date);
        }
        return this._prix;
    }

    get nomClient(): string { return this.client ? this.client.nom : undefined; }
    get nouveauClient(): boolean { return this.client ? this.client.etat === EtatClient.nouveau : false; }
    get texteClient(): string { return this.client ? this.nomClient + (this.nouveauClient ? ' (nouveau)' : '') : undefined; }
    get labelClient(): string { return 'Client' + (this.nouveauClient ? ' (nouveau)' : ''); }


    private _texteTypeDemande(typeCommande: string): string {
        return TypeMesure.texteSeCommande(this.typeMesure, typeCommande);
    }

    get typeCommande(): string {
        return (this._éditeur && this._éditeur.kfTypeCommande && this._éditeur.kfTypeCommande.aUneValeur)
            ? this._éditeur.kfTypeCommande.valeur
            : this.apiData.typeCommande
                ? this.apiData.typeCommande
                : TypeMesure.typeCommandeParDéfaut(this._produit.typeMesure);
    }
    get demande(): number {
        return (this._éditeur && this._éditeur.kfDemande && this._éditeur.kfDemande.aUneValeur)
            ? this._éditeur.kfDemande.valeur
            : this.apiData.demande;
    }

    get aLivrer(): number {
        return (this._éditeur && this._éditeur.kfALivrer && this._éditeur.kfALivrer.aUneValeur)
            ? this._éditeur.kfALivrer.valeur
            : this.apiData.aLivrer;
    }
    set aLivrer(valeur: number) {
        this.apiData.aLivrer = valeur;
        if (this._éditeur && this._éditeur.kfALivrer) {
            this._éditeur.kfALivrer.valeur = valeur;
        }
    }

    get aFacturer(): number {
        return (this._éditeur && this._éditeur.kfAFacturer && this._éditeur.kfAFacturer.aUneValeur)
            ? this._éditeur.kfAFacturer.valeur
            : this.apiData.aFacturer;
    }
    set aFacturer(valeur: number) {
        this.apiData.aFacturer = valeur;
        if (this._éditeur && this._éditeur.kfAFacturer) {
            this._éditeur.kfAFacturer.valeur = valeur;
        }
    }

    /**
     * sauve les valeurs éditées et retourne l'ApiDétailCommande à poster
     */
    apiLigneAEnvoyer(): ApiLigne {
        const apiL = new ApiLigne();
        // sauve les valeurs éditées pour qu'elles survivent aux controls
        if (this._éditeur.kfTypeCommande) {
            const typeCommande = this._éditeur.kfTypeCommande.valeur;
            if (typeCommande !== TypeMesure.typeCommandeParDéfaut(this.produit.typeMesure)) {
                this.apiData.typeCommande = typeCommande;
            }
        }
        if (this._éditeur.kfALivrer) {
            this.apiData.aLivrer = this._éditeur.kfALivrer.valeur;
            if (this._éditeur.kfDemande && !this._éditeur.kfDemande.valeur) {
                this._éditeur.kfDemande.valeur = this.apiData.aLivrer;
            }
        }
        if (this._éditeur.kfDemande) {
            this.apiData.demande = this._éditeur.kfDemande.valeur;
        }
        if (this._éditeur.kfAFacturer) {
            this.apiData.aFacturer = this._éditeur.kfAFacturer.valeur;
        }
        if (this._parent.synthèse) { }
        KeyUidRnoNo2.copieKey(this, apiL);
        ApiLigne.copieData(this.apiData, apiL);
        return apiL;
    }

    apiLigneDataAStocker(): ApiLigneData {
        return this.apiData;
    }

    get préparé(): boolean {
        const àVérifier = this.àFixer ? this.àFixer() : undefined;
        return àVérifier !== undefined && àVérifier !== null;
    }

    get annulé(): boolean {
        const àVérifier = this.àFixer ? this.àFixer() : undefined;
        return àVérifier === 0;
    }

}
