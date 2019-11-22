import { DetailCommande } from './detail-commande';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { Tri } from '../commun/outils/trieur';
import { CommandeUtileUrl } from './commande-utile-url';
import { CommandeUtileLien } from './commande-utile-lien';
import { CommandeUtile } from './commande-utile';
import { DataUtileColonne } from '../commun/data-par-key/data-utile-colonne';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { Compare } from '../modeles/compare';

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
            tri: new Tri('produit', (d1: DetailCommande, d2: DetailCommande) => Compare.nomProduit(d1, d2))
        };
    }
    prix(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'prix',
            créeContenu: (détail: DetailCommande) => Fabrique.texte.avecProduit_prix(détail),
            enTeteDef: { titreDef: 'Prix' },
        };
    }
    typeCommande(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'typeCommande',
            créeContenu: (détail: DetailCommande) => Fabrique.texte.avecProduit_seCommande(détail),
            enTeteDef: { titreDef: 'Type de commande' },
        };
    }
    quantité(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'demande',
            créeContenu: (détail: DetailCommande) => Fabrique.texte.demandeAvecUnité(détail),
            enTeteDef: { titreDef: 'Quantité' },
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
    demande(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'demande',
            créeContenu: (détail: DetailCommande) => Fabrique.texte.demandeAvecUnité(détail),
            enTeteDef: { titreDef: 'Demandé' },
        };
    }
    aLivrer(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'aLivrer',
            créeContenu: (détail: DetailCommande) => ({ texteDef: () =>
                détail.refusé
                ? 'refusé'
                : !détail.prêt
                    ? 'à faire'
                    : Fabrique.texte.aLivrerAvecUnité(détail) }),
            enTeteDef: { titreDef: 'Préparé' },
            classeDefs: [
                {
                    nom: 'text-danger',
                    active: (détail: DetailCommande) => détail.refusé
                },
            ]
        };
    }

    // colonnes de commande
    choisit(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'choix',
            créeContenu: (détail: DetailCommande) => ({ composant: this.lien.choisit(détail) })
        };
    }

    edite(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'edite',
            créeContenu: (détail: DetailCommande) => ({ composant: détail.aLivrerNombre }),
            nePasAfficherSi: this._commandeUtile.conditionTable.pasEdition
        };
    }
    supprime(): IKfVueTableColonneDef<DetailCommande> {
        return {
            nom: 'supprime',
            créeContenu: (détail: DetailCommande) => {
                const lien = this.lien.supprime(détail);
                lien.inactivité = détail.client && détail.crééParLeClient && détail.refusé;
                return { composant: lien };
            },
            nePasAfficherSi: this._commandeUtile.conditionTable.pasEdition
        };

    }

    defsClient(): IKfVueTableColonneDef<DetailCommande>[] {
        return [
                this.catégorie(),
                this.produit(),
                this.prix(),
                this.quantité(),
                this.edite(),
                this.supprime(),
            ];
    }

    protected _defsFournisseur(): IKfVueTableColonneDef<DetailCommande>[] {
        return [
                this.catégorie(),
                this.produit(),
                this.demande(),
                this.aLivrer(),
                this.edite(),
                this.supprime(),
            ];
    }

    protected _defsDUnProduit(): IKfVueTableColonneDef<DetailCommande>[] {
        return [
                this.client(),
                this.demande(),
                this.aLivrer(),
                this.edite(),
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
