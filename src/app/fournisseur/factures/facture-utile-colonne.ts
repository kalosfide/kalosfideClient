import { FactureUtile } from './facture-utile';
import { FactureUtileUrl } from './facture-utile-url';
import { CommandeUtileColonne } from 'src/app/commandes/commande-utile-colonne';
import { FactureUtileLien } from './facture-utile-lien';
import { Facture } from './facture';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { Tri } from 'src/app/commun/outils/trieur';
import { Compare } from 'src/app/modeles/compare';
import { FactureCommande } from './facture-commande';
import { FactureProduit } from './facture-produit';
import { FactureDétail } from './facture-detail';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Factures } from './factures';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';

export class FactureUtileColonne extends CommandeUtileColonne {

    constructor(factureUtile: FactureUtile) {
        super(factureUtile);
        this.créeDétail();
    }

    get factureUtile(): FactureUtile {
        return this._parent as FactureUtile;
    }

    get url(): FactureUtileUrl {
        return this.factureUtile.url;
    }

    get lien(): FactureUtileLien {
        return this.factureUtile.lien;
    }

    facture_client(): IKfVueTableColonneDef<Facture> {
        return {
            nom: 'client',
            créeContenu: (facture: Facture) => facture.client.nom,
            enTeteDef: { titreDef: 'Client' },
            tri: new Tri<Facture>('client',
                (f1: Facture, f2: Facture): number => Compare.AvecClient_nomClient(f1, f2)),
        };
    }

    facture_aFacturer(): IKfVueTableColonneDef<Facture> {
        return {
            nom: 'commandes',
            créeContenu: (facture: Facture) => '' + facture.commandes.length,
            enTeteDef: { titreDef: 'Commandes' }
        };
    }

    facture_facturés(): IKfVueTableColonneDef<Facture> {
        return {
            nom: 'facturées',
            créeContenu: (facture: Facture) => '' + facture.nbFacturées,
            enTeteDef: { titreDef: 'Prêtes à facturer' }
        };
    }
    facture_etat(): IKfVueTableColonneDef<Facture> {
        return {
            nom: 'etat',
            créeContenu: (facture: Facture) => ({ texteDef: () => facture.texteEtat }),
            classeDefs: Facture.classeDefsEtat(),
            enTeteDef: { titreDef: 'Etat' },
        };
    }

    facture_montant(factures: Factures): IKfVueTableColonneDef<Facture> {
        return {
            nom: 'montant',
            créeContenu: (facture: Facture) => Fabrique.texte.prix(facture.montant),
            enTeteDef: { titreDef: 'Montant' },
            bilanDef: {
                titreDef: 'Total',
                valeurDef: ({ texteDef: () => Fabrique.texte.prix(factures.total) }),
                agrégation: (agrégé: number, facture: Facture) => facture.montant + (agrégé ? agrégé : 0),
                formate: (valeur: number) => Fabrique.texte.prix(valeur),
                titreVisiblesSeulement: 'Total des affichés'
            }
        };
    }

    facture_choisit(): IKfVueTableColonneDef<Facture> {
        return {
            nom: 'choisit',
            créeContenu: (facture: Facture) => ({ composant: this.lien.facture(facture) }),
            nePasAfficherSi: this.factureUtile.conditionTable.bilan,
        };
    }

    facture(factures: Factures): IKfVueTableColonneDef<Facture>[] {
        return [
            this.facture_client(),
            this.facture_aFacturer(),
            this.facture_facturés(),
            this.facture_etat(),
            this.facture_montant(factures),
            this.facture_choisit(),
        ];
    }

    commande_no(): IKfVueTableColonneDef<FactureCommande> {
        return {
            nom: '',
            créeContenu: (factureCommande: FactureCommande) => factureCommande.texteBonDeCommande,
            enTeteDef: { titreDef: 'Commande' }
        };
    }
    commande_livraison(): IKfVueTableColonneDef<FactureCommande> {
        return {
            nom: 'livraison',
            créeContenu: (factureCommande: FactureCommande) => factureCommande.texteLivraison,
            enTeteDef: { titreDef: 'Livraison' }
        };
    }
    commande_aFacturer(): IKfVueTableColonneDef<FactureCommande> {
        return {
            nom: 'aFacturer',
            créeContenu: (factureCommande: FactureCommande) => factureCommande.texteAFacturer,
            enTeteDef: { titreDef: 'A facturer' }
        };
    }
    commande_facturés(): IKfVueTableColonneDef<FactureCommande> {
        return {
            nom: 'facturés',
            créeContenu: (factureCommande: FactureCommande) => ({ texteDef: () => factureCommande.texteFacturés }),
            enTeteDef: { titreDef: 'Facturés' }
        };
    }
    commande_etat(): IKfVueTableColonneDef<FactureCommande> {
        return {
            nom: 'etat',
            créeContenu: (factureCommande: FactureCommande) => ({ texteDef: () => factureCommande.texteEtat }),
            classeDefs: FactureCommande.classeDefsEtat(),
            enTeteDef: { titreDef: 'Etat' },
        };
    }
    commande_montant(facture: Facture): IKfVueTableColonneDef<FactureCommande> {
        return {
            nom: 'montant',
            créeContenu: (factureCommande: FactureCommande) => ({ texteDef: () => Fabrique.texte.prix(factureCommande.coût) }),
            enTeteDef: { titreDef: 'Montant' },
            bilanDef: {
                titreDef: 'Total',
                valeurDef: ({ texteDef: () => Fabrique.texte.prix(facture.montant) }),
            }
        };
    }
    commande_edite(): IKfVueTableColonneDef<FactureCommande> {
        return {
            nom: 'edite',
            créeContenu: (factureCommande: FactureCommande) => ({ composant: this.lien.factureCommande(factureCommande) }),
        };
    }
    commande_copie(facture: Facture): IKfVueTableColonneDef<FactureCommande> {
        return {
            nom: 'copier',
            enTeteDef: { titreDef: { composant: this.factureUtile.bouton.copieCommandes(facture) } },
            créeContenu: (factureCommande: FactureCommande) => {
                const bouton = this.factureUtile.bouton.copieCommande(factureCommande);
                return { composant: bouton };
            },
            nePasAfficherSi: this.factureUtile.conditionTable.pasEdition,
        };
    }
    commande_annule(facture: Facture): IKfVueTableColonneDef<FactureCommande> {
        return {
            nom: 'annuler',
            enTeteDef: { titreDef: 'Annuler' },
            créeContenu: (factureCommande: FactureCommande) => {
                const bouton = this.factureUtile.bouton.annuleCommande(factureCommande);
                return { composant: bouton };
            },
            nePasAfficherSi: this.factureUtile.conditionTable.pasEdition,
        };
    }
    commande_toolbar(facture: Facture): IKfVueTableColonneDef<FactureCommande> {
        return {
            nom: 'toolbar',
            enTeteDef: { titreDef: { composant: this.factureUtile.bouton.btnToolbarFacture(facture) } },
            créeContenu: (factureCommande: FactureCommande) => {
                const bouton = this.factureUtile.bouton.btnToolbarCommande(factureCommande);
                return { composant: bouton };
            },
            nePasAfficherSi: this.factureUtile.conditionTable.pasEdition,
        };
    }

    factureCommande(facture: Facture): IKfVueTableColonneDef<FactureCommande>[] {
        return [
            this.commande_no(),
            this.commande_livraison(),
            this.commande_aFacturer(),
            this.commande_facturés(),
            this.commande_toolbar(facture),
            this.commande_etat(),
            this.commande_montant(facture),
        ];
    }

    détail_aFacturer(): IKfVueTableColonneDef<FactureDétail> {
        return {
            nom: 'aFacturer',
            créeContenu: (détail: FactureDétail) => ({ composant: détail.aLivrerTexte }), // '' + Fabrique.texte.aFacturerAvecUnité(détail),
            enTeteDef: { titreDef: 'A facturer' }
        };
    }
    détail_facturé(): IKfVueTableColonneDef<FactureDétail> {
        return {
            nom: 'facturés',
            créeContenu: (détail: FactureDétail) => ({ composant: détail.aFacturerNombre }),
            enTeteDef: { titreDef: 'Facturés' }
        };
    }
    détail_prix(): IKfVueTableColonneDef<FactureDétail> {
        return {
            nom: 'prixUnitaire',
            créeContenu: (détail: FactureProduit) => Fabrique.texte.prix(détail.produit.prix),
            enTeteDef: { titreDef: 'P.U.' }
        };
    }
    détail_coût(factureCommande: FactureCommande): IKfVueTableColonneDef<FactureDétail> {
        return {
            nom: 'coût',
            créeContenu: (détail: FactureDétail) => {
                return ({ texteDef: () => Fabrique.texte.coûtFacturés(détail) });
            },
            enTeteDef: { titreDef: 'Coût' },
            bilanDef: {
                titreDef: 'Total',
                valeurDef: '',
                agrégation: (agrégé: number, détail: FactureDétail) => détail.coût + agrégé,
                valeur0: 0,
                formate: (valeur: number) => Fabrique.texte.prix(valeur),
                titreVisiblesSeulement: 'Total des affichés'
            }
        };
    }
    détail_copie(factureCommande: FactureCommande): IKfVueTableColonneDef<FactureDétail> {
        return {
            nom: 'copier',
            enTeteDef: { titreDef: { composant: this.factureUtile.bouton.copieCommande(factureCommande) } },
            créeContenu: (détail: FactureDétail) => {
                const bouton = this.factureUtile.bouton.copieDétail(détail);
                return { composant: bouton };
            },
            nePasAfficherSi: this.factureUtile.conditionTable.pasEdition,
        };
    }
    détail_annule(factureCommande: FactureCommande): IKfVueTableColonneDef<FactureDétail> {
        return {
            nom: 'annule',
            enTeteDef: { titreDef: { composant: this.factureUtile.bouton.annuleCommande(factureCommande) } },
            créeContenu: (détail: FactureDétail) => {
                const bouton = this.factureUtile.bouton.annuleDétail(détail);
                return { composant: bouton };
            },
            nePasAfficherSi: this.factureUtile.conditionTable.pasEdition,
        };
    }
    détail_toolbarDétail(factureCommande: FactureCommande): IKfVueTableColonneDef<FactureDétail> {
        return {
            nom: 'toolbar',
            enTeteDef: { titreDef: { composant: this.factureUtile.bouton.btnToolbarCommande(factureCommande, true) } },
            créeContenu: (détail: FactureDétail) => {
                const bouton = this.factureUtile.bouton.btnToolbarDétail(détail);
                return { composant: bouton };
            },
            nePasAfficherSi: this.factureUtile.conditionTable.pasEdition,
        };
    }

    détailFacture(factureCommande: FactureCommande): IKfVueTableColonneDef<FactureDétail>[] {
        return [
            this._détail.catégorie(),
            this._détail.produit(),
            this.détail_aFacturer(),
            this.détail_facturé(),
            this.détail_toolbarDétail(factureCommande),
            this.détail_prix(),
            this.détail_coût(factureCommande),
        ];
    }

    produit_catégorie(): IKfVueTableColonneDef<FactureProduit> {
        return {
            nom: 'catégorie',
            créeContenu: (fp: FactureProduit) => Fabrique.texte.nomCatégorie(fp),
            enTeteDef: { titreDef: 'Catégorie' },
            tri: new Tri('categorie',
                (fp1: FactureProduit, fp2: FactureProduit): number => Compare.nomCatégorie(fp1, fp2))
        };
    }
    produit_produit(): IKfVueTableColonneDef<FactureProduit> {
        return {
            nom: 'produit',
            créeContenu: (fp: FactureProduit) => Fabrique.texte.nomProduit(fp),
            enTeteDef: { titreDef: 'Produit' },
            tri: new Tri('produit',
                (fp1: FactureProduit, fp2: FactureProduit): number => Compare.nomProduit(fp1, fp2))
        };
    }
    produit_facturé(): IKfVueTableColonneDef<FactureProduit> {
        return {
            nom: 'facturés',
            créeContenu: (fp: FactureProduit) => Fabrique.texte.facturésAvecUnité(fp),
            enTeteDef: { titreDef: 'Quantité' },
        };
    }
    produit_prix(): IKfVueTableColonneDef<FactureProduit> {
        return {
            nom: 'prixUnitaire',
            créeContenu: (fp: FactureProduit) => Fabrique.texte.prix(fp.produit.prix),
            enTeteDef: { titreDef: 'P.U.' },
        };
    }
    produit_coût(facture: Facture): IKfVueTableColonneDef<FactureProduit> {
        return {
            nom: 'coût',
            créeContenu: (fp: FactureDétail) => Fabrique.texte.coûtFacturés(fp),
            enTeteDef: { titreDef: 'Coût' },
            bilanDef: {
                titreDef: 'Total',
                valeurDef: Fabrique.texte.prix(facture.montant),
            }
        };
    }

    factureProduit(facture: Facture): IKfVueTableColonneDef<FactureProduit>[] {
        return [
            this.produit_catégorie(),
            this.produit_produit(),
            this.produit_facturé(),
            this.produit_prix(),
            this.produit_coût(facture)
        ];
    }

}
