import { Commande } from 'src/app/commandes/commande';
import { LivraisonProduit } from './livraison-produit';
import { DetailCommande, DetailCommandeTitre } from 'src/app/commandes/detail-commande';
import { LivraisonUtile } from './livraison-utile';
import { CommandeUtileColonne, CommandeUtileColonneDétail } from 'src/app/commandes/commande-utile-colonne';
import { LivraisonUtileBouton } from './livraison-utile-bouton';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { Tri } from 'src/app/commun/outils/trieur';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { CommandeUtileLien } from 'src/app/commandes/commande-utile-lien';
import { LivraisonProduits } from './livraison-produits';
import { Compare } from 'src/app/modeles/compare';
import { KfInitialObservable } from 'src/app/commun/kf-composants/kf-partages/kf-initial-observable';
import { BilanLivraison } from './livraison-etat';

export class LivraisonUtileColonneDétail extends CommandeUtileColonneDétail {
    private get _utile(): LivraisonUtile {
        return this._commandeUtile as LivraisonUtile;
    }

    constructor(livraisonUtile: LivraisonUtile) {
        super(livraisonUtile);
    }

    private get bouton(): LivraisonUtileBouton {
        return this._utile.bouton as LivraisonUtileBouton;
    }

    copierCommande(commande: Commande): IKfVueTableColonneDef<DetailCommande> {
        const rienACopier = KfInitialObservable.transforme(this._utile.service.bilanLivraisonIO,
            (bilan: BilanLivraison) => {
                return commande.àCopier.length === 0;
            });
        const nePasAfficherSi = KfInitialObservable.ou(rienACopier, this._utile.conditionTable.pasEdition);
        return {
            nom: 'copier',
            enTeteDef: { titreDef: { composant: this.bouton.copieCommande(commande) } },
            créeContenu: (détail: DetailCommande) => {
                const bouton = this.bouton.copieDétail(détail);
                bouton.inactivitéFnc = () => !détail.copiable || détail.préparé;
                return { composant: bouton };
            },
            nePasAfficherSi: nePasAfficherSi,
        };
    }

    copierProduit(livraisonProduit: LivraisonProduit): IKfVueTableColonneDef<DetailCommande> {
        const rienACopier = KfInitialObservable.transforme(this._utile.service.bilanLivraisonIO,
            (bilan: BilanLivraison) => {
                return livraisonProduit.àCopier.length === 0;
            });
        const nePasAfficherSi = KfInitialObservable.ou(rienACopier, this._utile.conditionTable.pasEdition);
        return {
            nom: 'copier',
            enTeteDef: { titreDef: { composant: this.bouton.copieProduit(livraisonProduit) } },
            créeContenu: (détail: DetailCommande) => {
                const bouton = this.bouton.copieDétail(détail);
                bouton.inactivitéFnc = () => !détail.copiable || détail.préparé;
                return { composant: bouton };
            },
            nePasAfficherSi: nePasAfficherSi,
        };
    }

    defsFournisseur(commande: Commande): IKfVueTableColonneDef<DetailCommande>[] {
        return [
            this.catégorie(),
            this.produit(),
            this.demande(DetailCommandeTitre.demande.fournisseur),
            this.demande_edite(DetailCommandeTitre.demande.fournisseur),
            this.typeCommande(DetailCommandeTitre.typeCommande.fournisseur),
            this.typeCommande_edite(DetailCommandeTitre.typeCommande.fournisseur),
            this.copierCommande(commande),
            this.aLivrer(DetailCommandeTitre.aLivrer.commande),
            this.aLivrer_edite(DetailCommandeTitre.aLivrer.commande),
            this.typeMesure(DetailCommandeTitre.typeMesure.commande),
            this.supprime(),
        ];
    }

    defsDUnProduit(livraisonProduit: LivraisonProduit): IKfVueTableColonneDef<DetailCommande>[] {
        return [
            this.client(),
            this.demande(DetailCommandeTitre.demande.fournisseur),
            this.demande_edite(DetailCommandeTitre.demande.fournisseur),
            this.copierProduit(livraisonProduit),
            this.aLivrer(DetailCommandeTitre.aLivrer.commande),
            this.aLivrer_edite(DetailCommandeTitre.aLivrer.commande),
        ];
    }

}

class LivraisonUtileColonneAvecNombres {
    protected _livraisonUtile: LivraisonUtile;

    constructor(livraisonUtile: LivraisonUtile) {
        this._livraisonUtile = livraisonUtile;
    }

    get lien(): CommandeUtileLien {
        return this._livraisonUtile.lien;
    }

    get bouton(): LivraisonUtileBouton {
        return this._livraisonUtile.bouton as LivraisonUtileBouton;
    }

}

class LivraisonUtileColonneCommande extends LivraisonUtileColonneAvecNombres {

    constructor(livraisonUtile: LivraisonUtile) {
        super(livraisonUtile);
    }

    client(): IKfVueTableColonneDef<Commande> {
        return {
            nom: 'client',
            créeContenu: (commande: Commande) => commande.texteClient,
            enTeteDef: { titreDef: 'Client' },
            tri: new Tri<Commande>('client',
                (d1: Commande, d2: Commande): number => Compare.AvecClient_nomClient(d1, d2)),
        };
    }

    demandes(): IKfVueTableColonneDef<Commande> {
        return {
            nom: 'demandes',
            créeContenu: (commande: Commande) => '' + commande.nbDemandes,
            enTeteDef: { titreDef: 'Demandes' },
//            nePasAfficherSi: this._livraisonUtile.conditionSite.livraison
        };
    }

    àPréparer(): IKfVueTableColonneDef<Commande> {
        return {
            nom: 'àPréparer',
            créeContenu: (commande: Commande) => '' + commande.nbDemandes,
            enTeteDef: { titreDef: 'à préparer', chapeauDef: 'Commandes', longueurChapeau: 3 },
////            nePasAfficherSi: this._livraisonUtile.conditionSite.pas_livraison
        };
    }

    préparés(): IKfVueTableColonneDef<Commande> {
        return {
            nom: 'préparés',
            créeContenu: (commande: Commande) => '' + commande.nbRéponses,
            enTeteDef: { titreDef: 'préparées' },
//            nePasAfficherSi: this._livraisonUtile.conditionSite.pas_livraison
        };
    }

    annulés(): IKfVueTableColonneDef<Commande> {
        return {
            nom: 'annulés',
            créeContenu: (commande: Commande) => '' + commande.nbRefus,
            enTeteDef: { titreDef: 'dont annulées' },
//            nePasAfficherSi: this._livraisonUtile.conditionSite.pas_livraison
        };
    }

    état(): IKfVueTableColonneDef<Commande> {
        return {
            nom: 'état',
            créeContenu: (commande: Commande) => ({ texteDef: () => commande.texteEtat }),
            enTeteDef: { titreDef: 'Etat' },
            classeDefs: [
                {
                    nom: 'text-success',
                    active: (commande: Commande) => commande.préparé
                },
                {
                    nom: 'text-warning',
                    active: (commande: Commande) => commande.incomplet
                },
                {
                    nom: 'text-danger',
                    active: (commande: Commande) => commande.sansDétails
                },
            ]
        };
    }

    edite(): IKfVueTableColonneDef<Commande> {
        return {
            nom: 'edite',
            créeContenu: (commande: Commande) => ({ composant: this.lien.dUnClient(commande, commande.client.avecCompte) }),
            afficherSi: this._livraisonUtile.condition.editeOuAperçu
        };
    }
    editeSiLivraison(): IKfVueTableColonneDef<Commande> {
        return {
            nom: 'edite',
            créeContenu: (commande: Commande) => ({ composant: this.lien.dUnClient(commande) }),
            afficherSi: this._livraisonUtile.conditionAction.edite
        };
    }

    supprime(): IKfVueTableColonneDef<Commande> {
        return {
            nom: 'supprime',
            créeContenu: (commande: Commande) => {
                const lien = this.lien.supprimeCommande(commande);
                if (commande.client.avecCompte) {
                    lien.inactivité = true;
                }
                return { composant: lien };
            },
            afficherSi: this._livraisonUtile.conditionAction.edite
        };
    }

    supprimeSiLivraison(): IKfVueTableColonneDef<Commande> {
        return {
            nom: 'supprime',
            créeContenu: (commande: Commande) => {
                const lien = this.lien.supprimeCommande(commande);
                if (commande.crééeParLeClient) {
                    lien.inactivité = commande.nbDemandes === commande.nbRefus;
                }
                return { composant: lien };
            },
            afficherSi: this._livraisonUtile.conditionAction.edite
        };
    }

    aperçu(): IKfVueTableColonneDef<Commande> {
        return {
            nom: 'aperçu',
            créeContenu: (commande: Commande) => ({ composant: this.lien.dUnClient(commande, true) }),
            nePasAfficherSi: this._livraisonUtile.conditionTable.pasBilan
        };
    }

    choisit(): IKfVueTableColonneDef<Commande> {
        return {
            nom: 'choisit',
            créeContenu: (commande: Commande) => ({ composant: this.lien.choisitCommande(commande) }),
        };
    }

    defsCommandes(): IKfVueTableColonneDef<Commande>[] {
        return [
            this.client(),
            this.demandes(),
            this.àPréparer(),
            this.préparés(),
            this.annulés(),
            this.état(),
            this.edite(),
            this.editeSiLivraison(),
            this.supprime(),
            this.supprimeSiLivraison(),
            this.aperçu(),
        ];
    }
}

class LivraisonUtileColonneProduit extends LivraisonUtileColonneAvecNombres {

    constructor(livraisonUtile: LivraisonUtile) {
        super(livraisonUtile);
    }

    catégorie(): IKfVueTableColonneDef<LivraisonProduit> {
        return {
            nom: 'catégorie',
            créeContenu: (livraisonProduit: LivraisonProduit) => Fabrique.texte.nomCatégorie(livraisonProduit),
            enTeteDef: { titreDef: 'Catégorie' },
            tri: new Tri('categorie',
                (lp1: LivraisonProduit, lp2: LivraisonProduit): number => Compare.nomCatégorie(lp1, lp2))
        };
    }

    produit(): IKfVueTableColonneDef<LivraisonProduit> {
        return {
            nom: 'produit',
            créeContenu: (livraisonProduit: LivraisonProduit) => Fabrique.texte.nomProduit(livraisonProduit),
            enTeteDef: { titreDef: 'Produit' },
            tri: new Tri('produit',
                (lp1: LivraisonProduit, lp2: LivraisonProduit): number => Compare.nomProduit(lp1, lp2))
        };
    }

    état(): IKfVueTableColonneDef<LivraisonProduit> {
        return {
            nom: 'état',
            créeContenu: (livraisonProduit: LivraisonProduit) => ({ texteDef: () => livraisonProduit.texteEtat }),
            enTeteDef: { titreDef: 'Etat' },
//            nePasAfficherSi: this._livraisonUtile.conditionSite.pas_livraison,
            classeDefs: [
                {
                    nom: 'text-success',
                    active: (livraisonProduit: LivraisonProduit) => livraisonProduit.préparé
                },
                {
                    nom: 'text-warning',
                    active: (livraisonProduit: LivraisonProduit) => !livraisonProduit.préparé
                },
            ]
        };
    }

    àPréparer_Nombre(): IKfVueTableColonneDef<LivraisonProduit> {
        return {
            nom: 'àPréparer',
            créeContenu: (commande: LivraisonProduit) => '' + commande.nbDemandes,
            enTeteDef: { titreDef: 'à préparer', chapeauDef: 'Demandes', longueurChapeau: 3 },
//            nePasAfficherSi: this._livraisonUtile.conditionSite.pas_livraison
        };
    }

    préparés_Nombre(): IKfVueTableColonneDef<LivraisonProduit> {
        return {
            nom: 'préparés',
            créeContenu: (commande: LivraisonProduit) => '' + commande.nbRéponses,
            enTeteDef: { titreDef: 'préparées' },
//            nePasAfficherSi: this._livraisonUtile.conditionSite.pas_livraison
        };
    }

    annulés_Nombre(): IKfVueTableColonneDef<LivraisonProduit> {
        return {
            nom: 'annulés',
            créeContenu: (commande: LivraisonProduit) => '' + commande.nbRefus,
            enTeteDef: { titreDef: 'dont annulées' },
//            nePasAfficherSi: this._livraisonUtile.conditionSite.pas_livraison
        };
    }

    àPréparer_Quantité(): IKfVueTableColonneDef<LivraisonProduit> {
        return {
            nom: 'àPréparer',
            créeContenu: (àPréparer: LivraisonProduit) => Fabrique.texte.demandeAvecUnité(àPréparer),
            enTeteDef: { titreDef: 'à préparer', chapeauDef: 'Quantités', longueurChapeau: 2 },
//            nePasAfficherSi: this._livraisonUtile.conditionSite.pas_livraison
        };
    }

    préparés_Quantité(): IKfVueTableColonneDef<LivraisonProduit> {
        return {
            nom: 'préparés',
            créeContenu: (àPréparer: LivraisonProduit) => Fabrique.texte.aLivrerAvecUnité(àPréparer),
            enTeteDef: { titreDef: 'préparées' },
//            nePasAfficherSi: this._livraisonUtile.conditionSite.pas_livraison
        };
    }

    edite(): IKfVueTableColonneDef<LivraisonProduit> {
        return {
            nom: 'edite',
            créeContenu: (livraisonProduit: LivraisonProduit) => ({ composant: this.lien.dUnProduit(livraisonProduit) }),
            nePasAfficherSi: this._livraisonUtile.conditionTable.pasEdition
        };
    }

    copier(livraisonProduits: LivraisonProduits): IKfVueTableColonneDef<LivraisonProduit> {
        const rienACopier = KfInitialObservable.transforme(this._livraisonUtile.service.bilanLivraisonIO,
            (bilan: BilanLivraison) => {
                return livraisonProduits.àCopier.length === 0;
            });
        const nePasAfficherSi = rienACopier;
        return {
            nom: 'copier',
            enTeteDef: { titreDef: { composant: this.bouton.copieProduits(livraisonProduits) } },
            créeContenu: (livraisonProduit: LivraisonProduit) => {
                const bouton = this.bouton.copieProduit(livraisonProduit);
                bouton.inactivitéFnc = () => livraisonProduit.àCopier.length === 0;
                return { composant: bouton };
            },
            nePasAfficherSi: nePasAfficherSi,
        };
    }

    defsProduits(livraisonProduits: LivraisonProduits): IKfVueTableColonneDef<LivraisonProduit>[] {
        return [
            this.catégorie(),
            this.produit(),
            this.àPréparer_Nombre(),
            this.préparés_Nombre(),
            this.annulés_Nombre(),
            this.àPréparer_Quantité(),
            this.préparés_Quantité(),
            this.état(),
            this.edite(),
            this.copier(livraisonProduits),
        ];
    }

}

export class LivraisonUtileColonne extends CommandeUtileColonne {
    private get _livraisonUtile(): LivraisonUtile {
        return this.commandeUtile as LivraisonUtile;
    }

    private _commande: LivraisonUtileColonneCommande;
    private _produit: LivraisonUtileColonneProduit;

    constructor(livraisonUtile: LivraisonUtile) {
        super(livraisonUtile);
        this._détail = new LivraisonUtileColonneDétail(this._livraisonUtile);
        this._commande = new LivraisonUtileColonneCommande(livraisonUtile);
        this._produit = new LivraisonUtileColonneProduit(livraisonUtile);
    }

    créeDétail() {
        this._détail = new LivraisonUtileColonneDétail(this._livraisonUtile);
    }

    get détail(): LivraisonUtileColonneDétail {
        return this._détail as LivraisonUtileColonneDétail;
    }

    get commande(): LivraisonUtileColonneCommande {
        return this._commande;
    }

    get produit(): LivraisonUtileColonneProduit {
        return this._produit;
    }

}
