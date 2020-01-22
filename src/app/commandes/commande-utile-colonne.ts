import { DetailCommande, DetailCommandeTitre } from './detail-commande';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { Tri } from '../commun/outils/trieur';
import { CommandeUtileUrl } from './commande-utile-url';
import { CommandeUtileLien } from './commande-utile-lien';
import { CommandeUtile } from './commande-utile';
import { DataUtileColonne } from '../commun/data-par-key/data-utile-colonne';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { Compare } from '../modeles/compare';
import { TypeMesure } from '../modeles/type-mesure';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { DetailCommandeCoût, ICoût, CoûtDef } from './detail-commande-cout';
import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';

export class CommandeUtileColonneDétail {
    protected _commandeUtile: CommandeUtile;

    constructor(commandeUtile: CommandeUtile) {
        this._commandeUtile = commandeUtile;
    }

    get url(): CommandeUtileUrl {
        return this._commandeUtile.url;
    }

    get lien(): CommandeUtileLien {
        return this._commandeUtile.lien;
    }

    catégorie(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'catégorie',
            créeContenu: (détail: DetailCommande) => Fabrique.texte.nomCatégorie(détail),
            enTeteDef: { titreDef: 'Catégorie' },
            tri: new Tri('categorie',
                (d1: DetailCommande, d2: DetailCommande): number => Compare.nomCatégorie(d1, d2))
        };
    }
    produit(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'produit',
            créeContenu: (détail: DetailCommande) => Fabrique.texte.nomProduit(détail),
            enTeteDef: { titreDef: 'Produit' },
            tri: new Tri('produit', (d1: DetailCommande, d2: DetailCommande) => Compare.nomProduit(d1, d2)),
            bilanDef: {
                titreDef: 'Total',
                titreVisiblesSeulement: 'Affichés',
                valeurDef: '',
                texteAgrégé: (détails: DetailCommande[]) => '' + détails.length,
            }
        };
    }
    prix(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'prix',
            créeContenu: (détail: DetailCommande) => Fabrique.texte.avecProduit_prix(détail),
            enTeteDef: { titreDef: 'Prix' },
        };
    }

    seCommande(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'typeCommande',
            créeContenu: (détail: DetailCommande) => Fabrique.texte.avecProduit_seCommande(détail),
            enTeteDef: { titreDef: 'Se commande' },
        };
    }
    typeCommande(titre: string): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'typeCommande',
            créeContenu: (détail: DetailCommande) => Fabrique.texte.avecProduit_unités(détail, détail.typeCommande),
            enTeteDef: { titreDef: titre },
            nePasAfficherSi: this._commandeUtile.conditionTable.edition,
        };
    }
    typeCommande_edite(titre: string): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'typeCommande',
            créeContenu: (détail: DetailCommande) => ({
                composant: détail.editeur.kfTypeCommande ? détail.editeur.kfTypeCommande : détail.editeur.kfTypeCommande_ls
            }),
            enTeteDef: { titreDef: titre },
            afficherSi: this._commandeUtile.conditionTable.edition,
        };
    }

    demande(titre: string): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'demande',
            créeContenu: (détail: DetailCommande) => Fabrique.texte.nombre(détail.demande),
            enTeteDef: { titreDef: titre },
            nePasAfficherSi: this._commandeUtile.conditionTable.edition,
        };
    }
    demande_edite(titre: string): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'demande',
            créeContenu: (détail: DetailCommande) => {
                let    composant: KfComposant;
                if (détail.editeur.kfDemande) {
                    composant = détail.editeur.kfDemande;
                } else {
                    composant = détail.editeur.kfDemande_ls;
                    détail.editeur.kfDemande_ls.valeur = Fabrique.texte.nombre(détail.demande ? détail.demande : détail.aLivrer);
                }
                return {
                    composant: composant
                };
            },
            enTeteDef: { titreDef: titre },
            afficherSi: this._commandeUtile.conditionTable.edition,
        };
    }

    client(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'client',
            créeContenu: (détail: DetailCommande) => détail.texteClient,
            enTeteDef: { titreDef: 'Client' },
            tri: new Tri<DetailCommande>('client',
                (d1: DetailCommande, d2: DetailCommande): number => Compare.AvecClient_nomClient(d1, d2))
        };
    }

    aLivrer(titre: string, dansFacture?: boolean): IKfVueTableColonneDef<DetailCommande> {
        const aLivrer: IKfVueTableColonneDef<DetailCommande> = {
            nom: 'aLivrer',
            créeContenu: (détail: DetailCommande) => {
                const etiquette = new KfEtiquette('');
                const texte = Fabrique.texte.nombre(détail.aLivrer);
                switch (texte) {
                    case '0':
                        etiquette.fixeTexte('refusé');
                        etiquette.ajouteClasseDef('text-danger');
                        break;
                    case '':
                        etiquette.fixeTexte('à faire');
                        break;
                    default:
                        etiquette.fixeTexte(texte);
                }
                return etiquette;
            },
            enTeteDef: { titreDef: titre },
        };
        if (!dansFacture) {
            aLivrer.nePasAfficherSi = this._commandeUtile.conditionTable.edition;
        }
        return aLivrer;
    }

    aLivrer_edite(titre: string): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'aLivrer',
            créeContenu: (détail: DetailCommande) => ({ composant: détail.editeur.kfALivrer }),
            enTeteDef: { titreDef: titre },
            nePasAfficherSi: this._commandeUtile.conditionTable.pasEdition
        };
    }

    aFacturer(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'aFacturer',
            créeContenu: (détail: DetailCommande) => Fabrique.texte.nombre(détail.aFacturer),
            enTeteDef: { titreDef: 'A facturer' },
            nePasAfficherSi: this._commandeUtile.conditionTable.edition
        };
    }

    aFacturer_edite(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'aFacturer',
            créeContenu: (détail: DetailCommande) => ({ composant: détail.editeur.kfAFacturer }),
            enTeteDef: { titreDef: 'A facturer' },
            nePasAfficherSi: this._commandeUtile.conditionTable.pasEdition
        };
    }

    typeMesure(titre: string): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'typeMesure',
            créeContenu: (détail: DetailCommande) => TypeMesure.texteUnités(détail.produit.typeMesure, détail.produit.typeCommande),
            enTeteDef: { titreDef: titre },
            nePasAfficherSi: this._commandeUtile.conditionTable.pasEdition
        };
    }

    coût(coûtDef: CoûtDef<DetailCommande>): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'coût',
            créeContenu: (détail: DetailCommande) => {
                return ({ texteDef: () => coûtDef.texte(détail) });
            },
            enTeteDef: { titreDef: 'Coût' },
            bilanDef: {
                valeurDef: '',
                texteAgrégé: (détails: DetailCommande[]) => coûtDef.texteAgrégé(détails),
            }
        };
    }

    // colonnes de commande
    choisit(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'choix',
            créeContenu: (détail: DetailCommande) => ({ composant: this.lien.choisit(détail) })
        };
    }
    aperçu(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'aperçu',
            créeContenu: (détail: DetailCommande) => ({ composant: this.lien.edite(détail, true) }),
            nePasAfficherSi: this._commandeUtile.conditionTable.pasAperçu
        };
    }
    supprime(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'supprime',
            créeContenu: (détail: DetailCommande) => {
                const lien = this.lien.supprime(détail);
                lien.inactivitéFnc = () => détail.client && détail.commandeCrééParLeClient && détail.refusé;
                return { composant: lien };
            },
            nePasAfficherSi: this._commandeUtile.conditionTable.pasEdition
        };

    }

    defsChoixProduit(): IKfVueTableColonneDef<DetailCommande>[] {
        return [
            this.catégorie(),
            this.produit(),
            this.prix(),
            this.seCommande(),
            this.choisit(),
        ];
    }

    defsClient(): IKfVueTableColonneDef<DetailCommande>[] {
        return [
            this.catégorie(),
            this.produit(),
            this.prix(),
            this.demande(DetailCommandeTitre.demande.client),
            this.demande_edite(DetailCommandeTitre.demande.client),
            this.typeCommande(DetailCommandeTitre.typeCommande.client),
            this.typeCommande_edite(DetailCommandeTitre.typeCommande.client),
            this.coût(DetailCommandeCoût.demande()),
            this.supprime(),
        ];
    }

}

export class CommandeUtileColonne extends DataUtileColonne {
    protected _détail: CommandeUtileColonneDétail;

    constructor(commandeUtile: CommandeUtile) {
        super(commandeUtile);
    }

    get commandeUtile(): CommandeUtile {
        return this.dataUtile as CommandeUtile;
    }

    créeDétail() {
        this._détail = new CommandeUtileColonneDétail(this.commandeUtile);
    }

    get détail(): CommandeUtileColonneDétail {
        return this._détail;
    }

}
