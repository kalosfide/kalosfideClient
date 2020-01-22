import { Produit } from 'src/app/modeles/catalogue/produit';
import { TypeMesure } from 'src/app/modeles/type-mesure';
import { ApiCommande, ApiDétailCommande, ApiDétailCommandeData } from './api-commande';
import { Client } from '../modeles/client/client';
import { EtatClient } from '../modeles/client/etat-client';
import { IDemandeCopiable } from './i-demande-copiable';
import { IAvecDemandeProduit } from './i-avec-demande-produit';
import { DetailCommandeEditeur } from './detail-commande-editeur';
import { IDataKeyComponent } from '../commun/data-par-key/i-data-key-component';
import { TypeCommande } from '../modeles/type-commande';
import { IALivrerCopiable } from './i-a-livrer-copiable';
import { DATE_NULLE } from '../modeles/date-nulle';

export interface ContexteDetailCommande {
    /**
     * présent si l'utilisateur est le fournisseur
     */
    client?: Client;

    /**
     * présent et vrai si dans une page de préparation de livraison par produit
     */
    estDansListeParProduit?: boolean;

    /**
     * présent et vrai si dans une page de préparation de facture
     */
    estDansFacture?: boolean;
}

export const DetailCommandeTitre = {
    categorie: 'Catégorie',
    produit: 'Produit',
    prix: 'Prix',
    typeCommande: { choixProduit: 'Se commande', client: 'Unité', fournisseur: 'U. C.' },
    typeMesure: { commande: 'U. V.', livraison: 'Unité', facture: 'Unité' },
    demande: { client: 'Quantité', fournisseur: 'Demandé' },
    aLivrer: { commande: 'A livrer', livraison: 'Quantité', facture: 'Livrés' }
};

/**
 * permet de représenter une ligne de détail d'une commande
 */
export class DetailCommande implements IDemandeCopiable, IAvecDemandeProduit, IALivrerCopiable {

    private _apiCommande: ApiCommande;
    /** ApiCommande contenant le détail */
    get apiCommande(): ApiCommande {
        return this._apiCommande;
    }

    private _apiDétail: ApiDétailCommande;
    /** ApiDétail représenté */
    get apiDétail(): ApiDétailCommande { return this._apiDétail; }

    private _produit: Produit;
    /** produit demandé */
    get produit(): Produit { return this._produit; }

    private _contexte: ContexteDetailCommande;

    /** présent si dans préparation de livraison */
    get client(): Client { return this._contexte && this._contexte.client; }

    /** vrai si dans préparation de livraison par produit */
    get estDansListeParProduit(): boolean { return this._contexte && this._contexte.estDansListeParProduit; }

    get estDansFacture(): boolean { return this._contexte && this._contexte.estDansFacture; }

    private _ajout: boolean;
    /**
     * si vrai, l'action est ajouter, sinon modifier
     * fixé dans le constructeur
     */
    public get ajout(): boolean { return this._ajout; }

    editeur: DetailCommandeEditeur;

    /**
     * permet de représenter une ligne de détail d'une commande
     * @param apiCommande ApiCommande contenant le détail
     * @param produit produit demandé
     * @param contexte ContexteDetailCommande
     */
    constructor(
        apiCommande: ApiCommande,
        produit: Produit,
        contexte?: ContexteDetailCommande
    ) {
        this._apiCommande = apiCommande;
        this._produit = produit;
        this._contexte = contexte;

        const apiDétailData = apiCommande.details.find(d => d.no === produit.no);

        this._apiDétail = new ApiDétailCommande();
        this._apiDétail.uid = apiCommande.uid;
        this._apiDétail.rno = apiCommande.rno;
        this._apiDétail.no = apiCommande.no;
        this._apiDétail.uid2 = produit.uid;
        this._apiDétail.rno2 = produit.rno;
        this._apiDétail.no2 = produit.no;
        if (apiDétailData) {
            // édition
            this._ajout = false;
            this._apiDétail.typeCommande = apiDétailData.typeCommande;
            this._apiDétail.demande = apiDétailData.demande;
            this._apiDétail.aLivrer = apiDétailData.aLivrer;
            this._apiDétail.aFacturer = apiDétailData.aFacturer;
        } else {
            // ajout
            this._ajout = true;
        }

    }

    /// SECTION: API

    /**
     * retourne un ApiDétailCommande contenant uniquement la clé
     */
    créeApiDetailClé(): ApiDétailCommande {
        const d = new ApiDétailCommande();
        d.uid = this._apiDétail.uid;
        d.rno = this._apiDétail.rno;
        d.no = this._apiDétail.no;
        d.uid2 = this._apiDétail.uid2;
        d.rno2 = this._apiDétail.rno2;
        d.no2 = this._apiDétail.no2;
        return d;
    }

    /**
     * sauve les valeurs éditées et retourne l'ApiDétailCommande à poster
     */
    apiDetailAEnvoyer(): ApiDétailCommande {
        // sauve les valeurs éditées pour qu'elles survivent aux controls
        if (this.editeur.kfTypeCommande) {
            const typeCommande = this.editeur.kfTypeCommande.valeur;
            if (typeCommande !== TypeMesure.typeCommandeParDéfaut(this.produit.typeMesure)) {
                this._apiDétail.typeCommande = typeCommande;
            }
        }
        if (this.editeur.kfALivrer) {
            this._apiDétail.aLivrer = this.editeur.kfALivrer.valeur;
            if (this.editeur.kfDemande && !this.editeur.kfDemande.valeur) {
                this.editeur.kfDemande.valeur = this._apiDétail.aLivrer;
            }
        }
        if (this.editeur.kfDemande) {
            this._apiDétail.demande = this.editeur.kfDemande.valeur;
        }
        if (this.editeur.kfAFacturer) {
            this._apiDétail.aFacturer = this.editeur.kfAFacturer.valeur;
        }

        return this._apiDétail;
    }

    fixeData(apiDétailCommandeData: ApiDétailCommandeData) {
        apiDétailCommandeData.typeCommande = this._apiDétail.typeCommande;
        apiDétailCommandeData.demande = this._apiDétail.demande;
        apiDétailCommandeData.aLivrer = this._apiDétail.aLivrer;
    }

    apiDétailDataAStocker(): ApiDétailCommandeData {
        const apiDétailCommandeData = new ApiDétailCommandeData();
        apiDétailCommandeData.no = this._produit.no;
        this.fixeData(apiDétailCommandeData);
        return apiDétailCommandeData;
    }

    /// FIN SECTION: API

    /// SECTION: Propriétés

    get noCategorie(): number { return this._produit.categorieNo; }
    get nomCategorie(): string { return this._produit.nomCategorie; }
    get typeMesure(): string { return this._produit.typeMesure; }

    /**
     * vrai si le détail a été créé par le client
     */
    get commandeCrééParLeClient(): boolean {
        return this._apiCommande.date !== DATE_NULLE;
    }

    get nomClient(): string { return this.client ? this.client.nom : undefined; }
    get nouveauClient(): boolean { return this.client ? this.client.etat === EtatClient.nouveau : false; }
    get texteClient(): string { return this.client ? this.nomClient + (this.nouveauClient ? ' (nouveau)' : '') : undefined; }
    get labelClient(): string { return 'Client' + (this.nouveauClient ? ' (nouveau)' : ''); }

    get nomProduit(): string { return this._produit.nom; }

    private _texteTypeDemande(typeCommande: string): string {
        return TypeMesure.texteSeCommande(this.typeMesure, typeCommande);
    }

    get typeCommande(): string {
        return (this.editeur && this.editeur.kfTypeCommande && this.editeur.kfTypeCommande.aUneValeur)
            ? this.editeur.kfTypeCommande.valeur
            : this._apiDétail.typeCommande
                ? this._apiDétail.typeCommande
                : TypeMesure.typeCommandeParDéfaut(this._produit.typeMesure);
    }
    get demande(): number {
        return (this.editeur && this.editeur.kfDemande && this.editeur.kfDemande.aUneValeur)
            ? this.editeur.kfDemande.valeur
            : this._apiDétail.demande;
    }

    get aLivrer(): number {
        return (this.editeur && this.editeur.kfALivrer && this.editeur.kfALivrer.aUneValeur)
            ? this.editeur.kfALivrer.valeur
            : this._apiDétail.aLivrer;
    }
    set aLivrer(valeur: number) {
        this._apiDétail.aLivrer = valeur;
        if (this.editeur && this.editeur.kfALivrer) {
            this.editeur.kfALivrer.valeur = valeur;
        }
    }

    get aFacturer(): number {
        return (this.editeur && this.editeur.kfAFacturer && this.editeur.kfAFacturer.aUneValeur)
            ? this.editeur.kfAFacturer.valeur
            : this._apiDétail.aFacturer;
    }
    set aFacturer(valeur: number) {
        this._apiDétail.aFacturer = valeur;
        if (this.editeur && this.editeur.kfAFacturer) {
            this.editeur.kfAFacturer.valeur = valeur;
        }
    }
    copieALivrer() {
        this.aFacturer = this.aLivrer;
    }

    get texteTypeDemande(): string {
        return this._texteTypeDemande(this.typeCommande);
    }

    get coût(): number {
        const aFacturer = this.aFacturer;
        return this._produit.prix * aFacturer;
    }

    get préparé(): boolean {
        return this.aLivrer !== undefined && this.aLivrer !== null;
    }
    get refusé(): boolean {
        return this.aLivrer === 0;
    }

    get facturée(): boolean {
        return this.aFacturer !== undefined && this.aFacturer !== null;
    }

    get annulé(): boolean {
        return this.aFacturer === 0;
    }

    get demandeNonCopiable(): boolean {
        return this.produit.typeCommande === TypeCommande.id.ALUnitéOuEnVrac && this.typeCommande === TypeCommande.id.ALUnité;
    }

    get copiable(): boolean {
        return !this.demandeNonCopiable;
    }

    copieDemande() {
        this.aLivrer = this.demande;
    }

    /// FIN SECTION: Propriétés

    /// SECTION: Editeur

    créeEditeur(component: IDataKeyComponent) {
        this.editeur = new DetailCommandeEditeur(this, component);
    }

    /// FIN SECTION: Editeur

}
