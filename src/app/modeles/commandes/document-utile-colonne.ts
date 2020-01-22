import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { Tri } from 'src/app/commun/outils/trieur';
import { DocumentUtileUrl } from './document-utile-url';
import { DocumentUtileLien } from './document-utile-lien';
import { DocumentUtile } from './document-utile';
import { DataUtileColonne } from 'src/app/commun/data-par-key/data-utile-colonne';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Compare } from '../compare';
import { TypeMesure } from '../type-mesure';
import { LigneDocument } from './ligne-base';
import { CoûtDef, LigneDocumentCoût } from './cout';

export class DocumentUtileColonneDétail {
    protected _utile: DocumentUtile;

    constructor(utile: DocumentUtile) {
        this._utile = utile;
    }

    get url(): DocumentUtileUrl {
        return this._utile.url;
    }

    get lien(): DocumentUtileLien {
        return this._utile.lien;
    }

    catégorie(): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'catégorie',
            créeContenu: (détail: LigneDocument) => Fabrique.texte.nomCatégorie(détail),
            enTeteDef: { titreDef: 'Catégorie' },
            tri: new Tri('categorie',
                (d1: LigneDocument, d2: LigneDocument): number => Compare.nomCatégorie(d1, d2))
        };
    }
    produit(): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'produit',
            créeContenu: (détail: LigneDocument) => Fabrique.texte.nomProduit(détail),
            enTeteDef: { titreDef: 'Produit' },
            tri: new Tri('produit', (d1: LigneDocument, d2: LigneDocument) => Compare.nomProduit(d1, d2)),
            bilanDef: {
                titreDef: 'Total',
                titreVisiblesSeulement: 'Affichés',
                valeurDef: '',
                texteAgrégé: (détails: LigneDocument[]) => '' + détails.length,
            }
        };
    }
    prix(): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'prix',
            créeContenu: (détail: LigneDocument) => Fabrique.texte.avecProduit_prix(détail),
            enTeteDef: { titreDef: 'Prix' },
        };
    }

    seCommande(): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'typeCommande',
            créeContenu: (détail: LigneDocument) => Fabrique.texte.avecProduit_seCommande(détail),
            enTeteDef: { titreDef: 'Se commande' },
        };
    }
    typeCommande(titre: string): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'typeCommande',
            créeContenu: (détail: LigneDocument) => Fabrique.texte.avecProduit_unités(détail, détail.typeCommande),
            enTeteDef: { titreDef: titre },
            nePasAfficherSi: this._utile.conditionTable.edition,
        };
    }
    typeCommande_edite(titre: string): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'typeCommande',
            créeContenu: (détail: LigneDocument) => ({
                composant: détail.éditeur.kfTypeCommande ? détail.éditeur.kfTypeCommande : détail.éditeur.kfTypeCommande_ls
            }),
            enTeteDef: { titreDef: titre },
            afficherSi: this._utile.conditionTable.edition,
        };
    }

    demande(titre: string): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'demande',
            créeContenu: (détail: LigneDocument) => Fabrique.texte.nombre(détail.demande),
            enTeteDef: { titreDef: titre },
            nePasAfficherSi: this._utile.conditionTable.edition,
        };
    }
    demande_edite(titre: string): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'demande',
            créeContenu: (détail: LigneDocument) => {
                let    composant: KfComposant;
                if (détail.éditeur.kfDemande) {
                    composant = détail.éditeur.kfDemande;
                } else {
                    composant = détail.éditeur.kfDemande_ls;
                    détail.éditeur.kfDemande_ls.valeur = Fabrique.texte.nombre(détail.demande ? détail.demande : détail.aLivrer);
                }
                return {
                    composant: composant
                };
            },
            enTeteDef: { titreDef: titre },
            afficherSi: this._utile.conditionTable.edition,
        };
    }

    client(): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'client',
            créeContenu: (détail: LigneDocument) => détail.texteClient,
            enTeteDef: { titreDef: 'Client' },
            tri: new Tri<LigneDocument>('client',
                (d1: LigneDocument, d2: LigneDocument): number => Compare.AvecClient_nomClient(d1, d2))
        };
    }

    aLivrer(titre: string, dansFacture?: boolean): IKfVueTableColonneDef<LigneDocument> {
        const aLivrer: IKfVueTableColonneDef<LigneDocument> = {
            nom: 'aLivrer',
            créeContenu: (détail: LigneDocument) => {
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
            aLivrer.nePasAfficherSi = this._utile.conditionTable.edition;
        }
        return aLivrer;
    }

    aLivrer_edite(titre: string): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'aLivrer',
            créeContenu: (détail: LigneDocument) => ({ composant: détail.éditeur.kfALivrer }),
            enTeteDef: { titreDef: titre },
            nePasAfficherSi: this._utile.conditionTable.pasEdition
        };
    }

    aFacturer(): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'aFacturer',
            créeContenu: (détail: LigneDocument) => Fabrique.texte.nombre(détail.aFacturer),
            enTeteDef: { titreDef: 'A facturer' },
            nePasAfficherSi: this._utile.conditionTable.edition
        };
    }

    aFacturer_edite(): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'aFacturer',
            créeContenu: (détail: LigneDocument) => ({ composant: détail.éditeur.kfAFacturer }),
            enTeteDef: { titreDef: 'A facturer' },
            nePasAfficherSi: this._utile.conditionTable.pasEdition
        };
    }

    typeMesure(titre: string): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'typeMesure',
            créeContenu: (détail: LigneDocument) => TypeMesure.texteUnités(détail.produit.typeMesure, détail.produit.typeCommande),
            enTeteDef: { titreDef: titre },
            nePasAfficherSi: this._utile.conditionTable.pasEdition
        };
    }

    coût(coûtDef: CoûtDef<LigneDocument>): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'coût',
            créeContenu: (détail: LigneDocument) => {
                return ({ texteDef: () => coûtDef.texte(détail) });
            },
            enTeteDef: { titreDef: 'Coût' },
            bilanDef: {
                valeurDef: '',
                texteAgrégé: (détails: LigneDocument[]) => coûtDef.texteAgrégé(détails),
            }
        };
    }

    // colonnes de commande
    choisit(): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'choix',
            créeContenu: (détail: LigneDocument) => ({ composant: this.lien.choisit(détail) })
        };
    }
    aperçu(): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'aperçu',
            créeContenu: (détail: LigneDocument) => ({ composant: this.lien.edite(détail, true) }),
            nePasAfficherSi: this._utile.conditionTable.pasAperçu
        };
    }
    supprime(): IKfVueTableColonneDef<LigneDocument> {
        return {
            nom: 'supprime',
            créeContenu: (détail: LigneDocument) => {
                const lien = this.lien.supprime(détail);
                lien.inactivitéFnc = () => détail.client && détail.parent.crééParLeClient && détail.annulé;
                return { composant: lien };
            },
            nePasAfficherSi: this._utile.conditionTable.pasEdition
        };

    }

    defsChoixProduit(): IKfVueTableColonneDef<LigneDocument>[] {
        return [
            this.catégorie(),
            this.produit(),
            this.prix(),
            this.seCommande(),
            this.choisit(),
        ];
    }

    defsClient(): IKfVueTableColonneDef<LigneDocument>[] {
        return [
            this.catégorie(),
            this.produit(),
            this.prix(),
            this.demande(this._utile.titres.demande.client),
            this.demande_edite(this._utile.titres.demande.client),
            this.typeCommande(this._utile.titres.typeCommande.client),
            this.typeCommande_edite(this._utile.titres.typeCommande.client),
            this.coût(LigneDocumentCoût.demande()),
            this.supprime(),
        ];
    }

}

export class DocumentUtileColonne extends DataUtileColonne {
    protected _détail: DocumentUtileColonneDétail;

    constructor(utile: DocumentUtile) {
        super(utile);
    }

    get utile(): DocumentUtile {
        return this.dataUtile as DocumentUtile;
    }

    créeDétail() {
        this._détail = new DocumentUtileColonneDétail(this.utile);
    }

    get détail(): DocumentUtileColonneDétail {
        return this._détail;
    }

}
