import { Produit } from 'src/app/modeles/catalogue/produit';
import { TypeMesure } from 'src/app/modeles/type-mesure';
import { TypeCommande, IdTypeCommande } from 'src/app/modeles/type-commande';
import { KfInputNombre } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-nombre';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { ApiCommande, ApiDétailCommande, ApiDétailCommandeData } from './api-commande';
import { Client } from '../modeles/clientele/client';
import { EtatClient } from '../modeles/clientele/etat-client';
import { CommandeUtileEditeDétail } from './commande-utile-edite-detail';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';
import { KfListeDeroulanteTexte } from '../commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { IDemandeCopiable } from './i-demande-copiable';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { IAvecDemandeProduit } from './i-avec-demande-produit';
import { KfInputTexte } from '../commun/kf-composants/kf-elements/kf-input/kf-input-texte';

export interface ContexteDetailCommande {
    /**
     * présent si l'utilisateur est le fournisseur
     */
    client?: Client;

    /**
     * présent et vrai si le site est d'état Livraison
     */
    étatSiteLivraison?: boolean;

    /**
     * présent et vrai si dans une page de préparation de livraison par produit
     */
    estDansListeParProduit?: boolean;

    /**
     * présent et vrai si dans une page de préparation de facture
     */
    estDansFacture?: boolean;
}

/**
 * permet de représenter une ligne de détail d'une commande
 */
export class DetailCommande implements IDemandeCopiable, IAvecDemandeProduit {

    static titreChamp = {
        categorie: 'Catégorie',
        produit: 'Produit',
        prix: 'Prix',
        typeCommande: 'Type de commande',
        quantité: 'Quantité',
        demande: 'Demandé',
        aLivrer: 'Préparé'
    };

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

    /** vrai si dans préparation de livraison */
    get étatSiteLivraison(): boolean { return this._contexte && this._contexte.étatSiteLivraison; }

    /** vrai si dans préparation de livraison par produit */
    get estDansListeParProduit(): boolean { return this._contexte && this._contexte.estDansListeParProduit; }

    get estDansFacture(): boolean { return this._contexte && this._contexte.estDansFacture; }

    private _ajout: boolean;
    /**
     * si vrai, l'action est ajouter, sinon modifier
     * fixé dans le constructeur
     */
    public get ajout(): boolean { return this._ajout; }

    private _optionsTypeCommande: { texte: string, valeur: string }[] = [];
    /** liste des types de commande du produit (à l'unité, au poids) */
    get optionsTypeCommande(): { texte: string, valeur: string }[] { return this._optionsTypeCommande; }

    private _superGroupe: KfSuperGroupe;
    typeCommandeListe: KfListeDeroulanteTexte;
    demandeTexte: KfInputTexte;
    demandeNombre: KfInputNombre;
    aLivrerTexte: KfInputTexte;
    aLivrerNombre: KfInputNombre;
    aFacturerTexte: KfInputTexte;
    aFacturerNombre: KfInputNombre;

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

        if (this._produit.typeCommande === IdTypeCommande.ALUnitéOuEnVrac || this._produit.typeCommande === IdTypeCommande.ALUnité) {
            this._optionsTypeCommande.push(this.option(IdTypeCommande.ALUnité));
        }
        if (this._produit.typeCommande === IdTypeCommande.ALUnitéOuEnVrac || this._produit.typeCommande === IdTypeCommande.EnVrac) {
            this._optionsTypeCommande.push(this.option(IdTypeCommande.EnVrac));
        }

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
            if (apiDétailData.date) {
                this._apiDétail.date = new Date(apiDétailData.date);
            }
            this._apiDétail.typeCommande = apiDétailData.typeCommande;
            this._apiDétail.demande = apiDétailData.demande;
            this._apiDétail.aLivrer = apiDétailData.aLivrer;
            this._apiDétail.aFacturer = apiDétailData.aFacturer;
        } else {
            // ajout
            this._ajout = true;
            this._apiDétail.typeCommande = this._optionsTypeCommande ? this._optionsTypeCommande[0].valeur : this._produit.typeCommande;
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
        this._apiDétail.typeCommande = this.typeCommandeListe.valeur;
        this._apiDétail.demande = this.demandeNombre.valeur;
        if (this.roleFournisseur) {
            if (this.étatSiteLivraison) {
                this._apiDétail.aLivrer = this.aLivrerNombre.valeur;
            }
        } else {
            // l'utilisateur est un client donc avec compte
            if (this.ajout) {
                this._apiDétail.date = new Date(Date.now());
            }

        }
        return this._apiDétail;
    }

    fixeData(apiDétailCommandeData: ApiDétailCommandeData) {
        apiDétailCommandeData.typeCommande = this._apiDétail.typeCommande;
        apiDétailCommandeData.demande = this._apiDétail.demande;
        apiDétailCommandeData.aLivrer = this._apiDétail.aLivrer;
        apiDétailCommandeData.date = this._apiDétail.date;
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
    get prix(): number { return this._produit.prix; }

    /**
     * vrai si le détail a été créé par le client
     */
    get crééParLeClient(): boolean {
        return this._apiDétail.date !== undefined;
    }

    get nomClient(): string { return this.client ? this.client.nom : undefined; }
    get nouveauClient(): boolean { return this.client ? this.client.etat === EtatClient.nouveau : false; }
    get texteClient(): string { return this.client ? this.nomClient + (this.nouveauClient ? ' (nouveau)' : '') : undefined; }
    get labelClient(): string { return 'Client' + (this.nouveauClient ? ' (nouveau)' : ''); }

    get nomProduit(): string { return this._produit.nom; }

    private _texteTypeDemande(typeCommande: string): string {
        return TypeMesure.texteSeCommande(this.typeMesure, typeCommande);
    }

    private option(typeCommande: string): { texte: string, valeur: string } {
        return {
            texte: this._texteTypeDemande(typeCommande),
            valeur: typeCommande
        };
    }

    get typeCommande(): string {
        return (this.typeCommandeListe && this.typeCommandeListe.valeur)
            ? this.typeCommandeListe.valeur
            : this._apiDétail.typeCommande
                ? this._apiDétail.typeCommande
                : this._produit.typeCommande;
    }
    get demande(): number {
        return (this.demandeNombre && this.demandeNombre.valeur) ? this.demandeNombre.valeur : this._apiDétail.demande;
    }

    get aLivrer(): number {
        return (this.aLivrerNombre && this.aLivrerNombre.valeur) ? this.aLivrerNombre.valeur : this._apiDétail.aLivrer;
    }

    get aFacturer(): number {
        return (this.aFacturerNombre) ? this.aFacturerNombre.valeur : this._apiDétail.aFacturer;
    }
    set aFacturer(valeur: number) {
        this._apiDétail.aFacturer = valeur;
        if (this.aFacturerNombre) {
            this.aFacturerNombre.valeur = valeur;
        }
    }

    get texteTypeDemande(): string {
        return this._texteTypeDemande(this.typeCommande);
    }

    get coût(): number {
        const aFacturer = this.aFacturer;
        return this._produit.prix * aFacturer;
    }

    /** vrai si l'utilisateur est le fournisseur */
    get roleFournisseur(): boolean { return !!this.client; }

    get prêt(): boolean {
        return this.aLivrer !== undefined && this.aLivrer !== null;
    }
    get refusé(): boolean {
        return this.aLivrer === 0;
    }

    get estFacturé(): boolean {
        return this.aFacturer !== undefined && this.aFacturer !== null;
    }

    get demandeNonCopiable(): boolean {
        return this.produit.typeCommande === IdTypeCommande.ALUnitéOuEnVrac && this.typeCommande === IdTypeCommande.ALUnité;
    }

    get demandeCopiable(): boolean {
        return !this.demandeNonCopiable;
    }

    copieDemande() {
        this._apiDétail.aLivrer = this._apiDétail.demande;
        if (this.aLivrerNombre) {
            this.aLivrerNombre.valeur = this._apiDétail.aLivrer;
        }
    }

    /// FIN SECTION: Propriétés

    /// SECTION: Editeur

    get typeCommandeLectureSeule(): boolean {
        return this._optionsTypeCommande.length <= 1 // il n'a pas à choisir
            || (this.roleFournisseur && this.crééParLeClient); // détail créé par le client
    }

    get demandeLectureSeule(): boolean {
        return this.roleFournisseur && this.crééParLeClient; // détail créé par le client
    }

    créeSuperGroupe() {
        this._superGroupe = new KfSuperGroupe('');
        this._superGroupe.créeGereValeur();
        if (this.estDansFacture) {
            this._superGroupe.avecInvalidFeedback = true;
        }
        const champs = new CommandeUtileEditeDétail(this);
        champs.prépareGroupe(this._superGroupe);
        this._superGroupe.quandTousAjoutés();
    }

    créeEdition(type: '+' | '-'): KfGroupe {
        const groupe = new KfGroupe('detail');
        groupe.créeGereValeur();
        const champs = new CommandeUtileEditeDétail(this);
        champs.prépareGroupe(groupe, type);
        return groupe;
    }

    get superGroupe(): KfSuperGroupe {
        return this._superGroupe;
    }

    /// FIN SECTION: Editeur

}
