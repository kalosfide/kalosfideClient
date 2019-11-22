import { ApiCommande } from './api-commande';
import { DetailCommande } from './detail-commande';
import { Client } from '../modeles/clientele/client';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { EtatClient } from '../modeles/clientele/etat-client';
import { KfTexte } from '../commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { texteKeyUidRnoNo, texteKeyUidRno } from '../commun/data-par-key/data-key';
import { EtatCommande } from './etat-commande';

export class Commande {
    protected _apiCommande: ApiCommande;
    get apiCommande(): ApiCommande {
        return this._apiCommande;
    }

    private _client: Client;
    /** propriétaire de la commande, présent si  */
    get client(): Client { return this._client; }

    private _livraisonNo: number;
    /** no de la livraison en cours, présent si EtatSite.livraison */
    get livraisonNo(): number { return this._livraisonNo; }

    protected _détails: DetailCommande[];
    get détails(): DetailCommande[] {
        return this._détails;
    }
    set détails(détails: DetailCommande[]) {
        this._détails = détails;
    }


    /** utile? set à afficher (nouveau) en gras */
    private _etiquetteClient: KfEtiquette;

    /**
     * Permet d'afficher la vueTable des détails d'une commande et une ligne de la vueTable des commandes d'une livraison
     * @param apiCommande données de l'Api
     * @param client propriétaire de la commande, présent si EtatSite.livraison
     * @param livraisonNo no de la livraison en cours, présent si EtatSite.livraison
     */
    constructor(apiCommande: ApiCommande, client?: Client, livraisonNo?: number) {
        this._apiCommande = apiCommande;
        this._client = client;
        this._livraisonNo = livraisonNo;
    }

    /// SECTION Propriétés

    get uid(): string { return this._apiCommande.uid; }
    get rno(): number { return this._apiCommande.rno; }
    get no(): number { return this._apiCommande.no; }
    get date(): Date { return new Date(this._apiCommande.date); }

    /**
     * vrai si l'un des détails a été créé par un client avec compte
     */
    public get crééeParLeClient(): boolean {
        return this._apiCommande.details.find(d => !!d.date) !== undefined;
    }

    /**
     * vrai si l'un des détails a été ajouté par le fournisseur
     */
    public get avecDétailDuFournisseur(): boolean {
        return this._apiCommande.details.find(d => !!d.date) !== undefined;
    }

    get ouverte(): boolean {
        return ApiCommande.ouverte(this.apiCommande);
    }

    get traitée(): boolean {
        return ApiCommande.traitée(this.apiCommande);
    }

    get terminée(): boolean {
        return ApiCommande.terminée(this.apiCommande);
    }

    public get sansaLivrer(): boolean {
        return this._apiCommande.details.find(d => d.aLivrer > 0) === undefined;
    }

    get texteBonDeCommande(): string {
        return 'BC-' + texteKeyUidRnoNo(this._apiCommande);
    }

    get texteBonDeLivraison(): string {
        return 'BL-' + texteKeyUidRnoNo(this._apiCommande) + '-' + this._apiCommande.livraisonNo;
    }

    /// FIN SECTION Propriétés

    /// SECTION: Ligne de VueTable

    get nomClient(): string { return this.client.nom; }
    get nouveauClient(): boolean { return this.client.etat === EtatClient.nouveau; }
    get texteClient(): string {
        return this.nomClient + (this.nouveauClient ? ' (nouveau)' : '');
    }
    get keyClient(): string {
        return texteKeyUidRno(this._client);
    }

    get nbDemandes(): number {
        return this._apiCommande.details.length;
    }

    get nbDemandesCréesParClient(): number {
        return this._apiCommande.details.filter(d => d.date !== undefined && d.date !== null).length;
    }

    get nbRéponses(): number {
        return this._apiCommande.details.filter(d => d.aLivrer !== undefined && d.aLivrer !== null).length;
    }

    get nbRefus(): number {
        return this._apiCommande.details.filter(d => d.aLivrer === 0).length;
    }

    get sansDétails(): boolean {
        return this._apiCommande.details.length === 0;
    }

    get incomplet(): boolean {
        return !this.sansDétails && this.nbDemandes > this.nbRéponses;
    }

    get prêt(): boolean {
        return this.nbDemandes === this.nbRéponses;
    }

    get texteEtat(): string {
        const def = this.sansDétails ? EtatCommande.sansDétails
            : this.incomplet ? EtatCommande.incomplet
            : EtatCommande.prêt;
        return def.texte;
    }

    get etiquetteClient(): KfEtiquette {
        if (!this._etiquetteClient) {
            this._etiquetteClient = new KfEtiquette('client', this.nomClient);
            if (this.nouveauClient) {
                const nouveau = new KfTexte('nouveau', '(nouveau)');
                nouveau.balisesAAjouter = [KfTypeDeBaliseHTML.strong];
                this._etiquetteClient.contenuPhrase.ajoute(nouveau);
            }
        }
        return this._etiquetteClient;
    }

    /// FIN SECTION: Ligne de VueTable

}

