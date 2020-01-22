import { ApiCommande, ApiDétailCommandeData } from './api-commande';
import { DetailCommande } from './detail-commande';
import { Client } from '../modeles/client/client';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { EtatClient } from '../modeles/client/etat-client';
import { KfTexte } from '../commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { EtatCommande } from './etat-commande';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';
import { KeyUidRnoNo } from '../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { IDemandeCopiable } from './i-demande-copiable';
import { DATE_NULLE } from '../modeles/date-nulle';

export class Commande implements IDemandeCopiable {
    protected _apiCommande: ApiCommande;
    get apiCommande(): ApiCommande {
        return this._apiCommande;
    }

    private _client: Client;
    /** propriétaire de la commande, présent si l'utilisateur est le fournisseur */
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

    /** utile? sert à afficher (nouveau) en gras */
    private _etiquetteClient: KfEtiquette;

    /**
     * Permet d'afficher la vueTable des détails d'une commande et une ligne de la vueTable des commandes d'une livraison
     * @param apiCommande données de l'Api
     * @param client propriétaire de la commande, présent si l'utilisateur est le fournisseur
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
    get date(): Date {
        if (this._apiCommande.date) {
            return new Date(this._apiCommande.date);
        }
    }

    /**
     * Indéfini après la fin de la livraison, vrai si la commande a été créé par un client avec compte
     */
    public get crééeParLeClient(): boolean {
        if (!this._apiCommande.dateLivraison) {
            return this._apiCommande.date !== DATE_NULLE;
        }
    }

    /**
     * Ouverte = sans date (propriétaire = client) ou date égale à DATE_NULLE (propriétaire = fournisseur).
     * Le propriétaire peut supprimer la commande, créer et supprimer des détails et éditer leurs demandes.
     */
    get ouverte(): boolean {
        return !this._apiCommande.date || this.date === DATE_NULLE;
    }

    get préparable(): boolean {
        return this._apiCommande.date !== undefined && this._apiCommande.livraisonNo === undefined;
    }

    get refusée(): boolean {
        return this._apiCommande.date !== undefined
            && this._apiCommande.livraisonNo !== undefined && this._apiCommande.dateLivraison !== undefined
            && this._apiCommande.details.find(d => d.aLivrer > 0) === undefined;
    }

    public get sansaLivrer(): boolean {
        return this._apiCommande.details.find(d => d.aLivrer > 0) === undefined;
    }

    get texteBonDeCommande(): string {
        return 'BC-' + KeyUidRnoNo.texteDeKey(this._apiCommande);
    }

    get texteBonDeLivraison(): string {
        return 'BL-' + KeyUidRnoNo.texteDeKey(this._apiCommande) + '-' + this._apiCommande.livraisonNo;
    }

    /// FIN SECTION Propriétés

    /// SECTION: Ligne de VueTable

    get nomClient(): string { return this.client.nom; }
    get nouveauClient(): boolean { return this.client.etat === EtatClient.nouveau; }
    get texteClient(): string {
        return this.nomClient + (this.nouveauClient ? ' (nouveau)' : '');
    }
    get keyClient(): string {
        return KeyUidRno.texteDeKey(this._client);
    }

    get nbDemandes(): number {
        return this._apiCommande.details.length;
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

    get préparé(): boolean {
        return this.nbDemandes === this.nbRéponses;
    }

    get àCopier(): DetailCommande[] {
        if (this.détails) {
            return this.détails.filter(d => d.copiable && !d.préparé);
        }
    }
    copieDemande() {
        this.détails.forEach(d => {
            if (d.copiable && !d.préparé) {
                d.copieDemande();
            }
        });
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

