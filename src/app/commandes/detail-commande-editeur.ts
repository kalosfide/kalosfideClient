import { KeyUidRnoNo2Editeur } from '../commun/data-par-key/key-uid-rno-no-2/key-uid-rno-no-2-editeur';
import { ApiDétailCommande } from './api-commande';
import { DetailCommande, DetailCommandeTitre } from './detail-commande';
import { IDataKeyComponent } from '../commun/data-par-key/i-data-key-component';
import { KfListeDeroulanteTexte } from '../commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { KfInputTexte } from '../commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from '../commun/kf-composants/kf-elements/kf-input/kf-input-nombre';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { TypeCommande } from '../modeles/type-commande';
import { TypeMesure } from '../modeles/type-mesure';
import { KfValidateurs } from '../commun/kf-composants/kf-partages/kf-validateur';
import { CommanderPages } from '../client/commandes/commander-pages';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../commun/kf-composants/kf-partages/kf-evenements';
import { LivraisonPages } from '../fournisseur/livraisons/livraison-pages';
import { FacturePages } from '../fournisseur/factures/facture-pages';
import { KfEntrée } from '../commun/kf-composants/kf-composant/kf-entree';
import { CommandeService } from './commande.service';
import { Produit } from '../modeles/catalogue/produit';

export class DetailCommandeEditeur extends KeyUidRnoNo2Editeur<ApiDétailCommande> {
    private _detail: DetailCommande;

    private _produit: Produit;

    kfTypeCommande: KfListeDeroulanteTexte;
    kfTypeCommande_ls: KfInputTexte;
    kfDemande_ls: KfInputTexte;
    kfDemande: KfInputNombre;
    kfALivrer_ls: KfInputTexte;
    kfALivrer: KfInputNombre;
    kfAFacturer_ls: KfInputTexte;
    kfAFacturer: KfInputNombre;

    constructor(detail: DetailCommande, component: IDataKeyComponent) {
        super(component);
        this._detail = detail;
    }

    get service(): CommandeService {
        return this._component.service as CommandeService;
    }

    private créeCatégorie(): KfInputTexte {
        return Fabrique.input.texteLectureSeule('categorie', 'Catégorie', this._produit.nomCategorie);
    }

    private créeProduit(): KfInputTexte {
        return Fabrique.input.texteLectureSeule('produit', 'Produit', this._produit.nom);
    }

    private créePrix(): KfInputTexte {
        return Fabrique.input.texteLectureSeule('prix', 'Prix', Fabrique.texte.avecProduit_prix(this._produit));
    }

    private créeUnitéPrix(): KfInputTexte {
        const input = Fabrique.input.texteLectureSeule('unité-prix', 'Unité',
            TypeMesure.texteUnités(this._produit.typeMesure, this._produit.typeCommande));
        input.ajouteClasseDef('unite');
        return input;
    }

    private créeTypeCommandeListe(lectureSeule?: boolean): KfListeDeroulanteTexte | KfInputTexte {
        const titre = 'Unité';
        const nom = 'typeCommande';
        const typeCommande = this._produit.typeCommande;
        const valeur = this._detail.apiDétail.typeCommande
            ? this._detail.apiDétail.typeCommande
            : TypeMesure.typeCommandeParDéfaut(this._produit.typeMesure);
        const texte = (id: string) => {
            return TypeMesure.texteUnités(this._produit.typeMesure, id);
        };
        let input: KfListeDeroulanteTexte | KfInputTexte;
        if (lectureSeule || typeCommande !== TypeCommande.id.ALUnitéOuEnVrac) {
            this.kfTypeCommande_ls = Fabrique.input.texteLectureSeule(nom + '_ls', titre, texte(valeur));
            input = this.kfTypeCommande_ls;
        } else {
            this.kfTypeCommande = Fabrique.listeDéroulante.texte(nom, titre);
            if (typeCommande === TypeCommande.id.ALUnitéOuEnVrac || typeCommande === TypeCommande.id.EnVrac) {
                this.kfTypeCommande.créeEtAjouteOption(texte(TypeCommande.id.EnVrac), TypeCommande.id.EnVrac);
            }
            if (typeCommande === TypeCommande.id.ALUnitéOuEnVrac || typeCommande === TypeCommande.id.ALUnité) {
                this.kfTypeCommande.créeEtAjouteOption(texte(TypeCommande.id.ALUnité), TypeCommande.id.ALUnité);
            }
            this.kfTypeCommande.ajouteValidateur(KfValidateurs.required);
            this.kfTypeCommande.valeur = valeur;
            input = this.kfTypeCommande;
        }
        input.ajouteClasseDef('unite');
        return input;
    }

    private créeDemande(titre: string, lectureSeule?: boolean): KfInputNombre | KfInputTexte {
        const nom = 'demande';
        let input: KfInputNombre | KfInputTexte;
        if (lectureSeule) {
            this.kfDemande_ls = Fabrique.input.texteLectureSeule(nom + '_ls', titre, Fabrique.texte.nombre(this._detail.apiDétail.demande));
            input = this.kfDemande_ls;
        } else {
            this.kfDemande = Fabrique.input.nombreQuantité('demande', () => this._detail.apiDétail.typeCommande, titre);
            const valeur = this._detail.demande;
            if (valeur) {
                this.kfDemande.valeur = valeur;
            }
            this.kfDemande.ajouteValidateur(KfValidateurs.nombreNonNul);
            input = this.kfDemande;
        }
        input.ajouteClasseDef('nombre', 'quantite');
        return input;
    }

    private lieDemandeEtTypeCommande() {
        if (!this.kfTypeCommande) {
            return;
        }
        this.kfTypeCommande.gereHtml.suitLaValeur = true;
        this.kfTypeCommande.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
            (evenement: KfEvenement) => {
                const pas = TypeCommande.pasInputNombre(this.kfTypeCommande.valeur);
                if (this.kfDemande.pas !== pas) {
                    this.kfDemande.valeur = 0;
                    this.kfDemande.pas = pas;
                }
                evenement.statut = KfStatutDEvenement.fini;
            });
    }

    private créeALivrer(titre: string, lectureSeule?: boolean): KfInputNombre | KfInputTexte {
        const nom = 'aLivrer';
        let input: KfInputNombre | KfInputTexte;
        if (lectureSeule) {
            this.kfALivrer_ls = Fabrique.input.texteLectureSeule(nom + '_ls', titre,
                Fabrique.texte.quantitéAvecUnité(this._produit, this._detail.apiDétail.aLivrer));
            input = this.kfALivrer_ls;
        } else {
            this.kfALivrer = Fabrique.input.nombreQuantité('aLivrer',
                () => TypeMesure.typeCommandeParDéfaut(this._produit.typeMesure), titre);
            const valeur = this._detail.aLivrer;
            if (valeur >= 0) {
                this.kfALivrer.valeur = valeur;
            }
            this.kfALivrer.ajouteValidateur(KfValidateurs.validateurDeFn('requisSiLivraison',
            (value: any) => {
                if (this._detail.apiCommande.livraisonNo) {
                    return value === null || value === undefined || isNaN(value);
                }
            }, ''));
        input = this.kfALivrer;
        }
        input.ajouteClasseDef('nombre', 'quantite');
        return input;
    }

    private lieDemandeEtALivrer() {
        if (!this.kfALivrer || !this.kfDemande_ls) {
            return;
        }
        this.kfALivrer.gereHtml.suitLaValeur = true;
        this.kfALivrer.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
            (evenement: KfEvenement) => {
                this.kfDemande_ls.valeur = Fabrique.texte.nombre(this.kfALivrer.valeur);
                evenement.statut = KfStatutDEvenement.fini;
            });
    }

    private créeAFacturer(lectureSeule?: boolean): KfInputNombre | KfInputTexte {
        const titre = 'Facturé';
        const nom = 'aFacturer';
        let input: KfInputNombre | KfInputTexte;
        if (lectureSeule) {
            this.kfAFacturer_ls = Fabrique.input.texteLectureSeule(nom + '_ls', titre, Fabrique.texte.aFacturerAvecUnité(this._detail));
            input = this.kfAFacturer_ls;
        } else {
            this.kfAFacturer = Fabrique.input.nombreQuantité('aFacturer', () => this._detail.typeCommande, titre);
            const valeur = this._detail.aFacturer;
            if (valeur) {
                this.kfAFacturer.valeur = valeur;
            }
            this.kfAFacturer.ajouteValidateur(KfValidateurs.nombreNonNul);
            input = this.kfAFacturer;
        }
        input.ajouteClasseDef('nombre', 'quantite');
        return input;
    }


    private créeKfDeDataSupprime(titre: string) {
        const lectureSeule = true;
        this.kfDeData = [
            this.créeCatégorie(),
            this.créeProduit(),
            this.créePrix(),
            this.créeUnitéPrix(),
            this.créeDemande(titre, lectureSeule),
            this.créeTypeCommandeListe(lectureSeule),
        ];
    }

    créeKfDeData() {
        const lectureSeule = true;
        const defValidePositif: (kfEntree: KfEntrée) => { nom: string, texte: string, valideFnc: (valeur: any) => boolean } =
            (kfEntrée: KfEntrée) => ({
                nom: kfEntrée.nom,
                texte: kfEntrée.texte,
                valideFnc: (valeur: any) => {
                    const v = Number.parseFloat('' + valeur);
                    return !isNaN(v) && v > 0;
                }
            });

        switch (this.pageDef) {
            case CommanderPages.ajoute:
                this.kfDeData = [
                    this.créeCatégorie(),
                    this.créeProduit(),
                    this.créePrix(),
                    this.créeDemande(DetailCommandeTitre.demande.client),
                    this.créeTypeCommandeListe(),
                ];
                this.lieDemandeEtTypeCommande();
                this.kfDemande.ajouteValidateur(KfValidateurs.required);
                break;
            case LivraisonPages.ajoute:
                if (this._detail.apiCommande.livraisonNo) {
                    this.kfDeData = [
                        this.créeCatégorie(),
                        this.créeProduit(),
                        this.créePrix(),
                        this.créeALivrer(DetailCommandeTitre.aLivrer.livraison),
                        this.créeUnitéPrix(),
                    ];
                    this.kfALivrer.ajouteValidateur(KfValidateurs.required);
                } else {
                    this.kfDeData = [
                        this.créeCatégorie(),
                        this.créeProduit(),
                        this.créePrix(),
                        this.créeDemande(DetailCommandeTitre.demande.fournisseur),
                        this.créeTypeCommandeListe(),
                        this.créeALivrer(DetailCommandeTitre.aLivrer.commande),
                        this.créeUnitéPrix(),
                    ];
                    this.lieDemandeEtTypeCommande();
                    this._groupe.ajouteValidateur(KfValidateurs.auMoinsUn(
                        'doit être supérieur à 0',
                        defValidePositif(this.kfDemande),
                        defValidePositif(this.kfALivrer)
                    ));
                }
                break;
            case CommanderPages.supprime:
                this.créeKfDeDataSupprime(DetailCommandeTitre.demande.client);
                break;
            case LivraisonPages.supprime:
                this.créeKfDeDataSupprime(DetailCommandeTitre.demande.fournisseur);
                this.kfDeData.push(this.créeALivrer(DetailCommandeTitre.aLivrer.commande, lectureSeule));
                break;
            case CommanderPages.liste:
                this.kfDeData = [
                    this.créeDemande(DetailCommandeTitre.demande.client),
                    this.créeTypeCommandeListe(),
                ];
                this.lieDemandeEtTypeCommande();
                this.kfDemande.ajouteValidateur(KfValidateurs.required);
                break;
            case LivraisonPages.liste:
                this.kfDeData = [
                    this.créeDemande(DetailCommandeTitre.demande.fournisseur, lectureSeule),
                    this.créeTypeCommandeListe(lectureSeule),
                    this.créeALivrer(DetailCommandeTitre.aLivrer.commande),
                ];
                this.lieDemandeEtALivrer();
                this.kfALivrer.ajouteValidateur(KfValidateurs.required);
                break;
            case LivraisonPages.apercu:
                this.kfDeData = [
                    this.créeDemande(DetailCommandeTitre.demande.fournisseur, lectureSeule),
                    this.créeTypeCommandeListe(lectureSeule),
                    this.créeALivrer(DetailCommandeTitre.aLivrer.commande, lectureSeule),
                ];
                break;
            case LivraisonPages.produit:
                this.kfDeData = [
                    this.créeDemande(DetailCommandeTitre.demande.fournisseur, lectureSeule),
                    this.créeALivrer(DetailCommandeTitre.aLivrer.commande)
                ];
                this.kfALivrer.ajouteValidateur(KfValidateurs.required);
                break;
            case FacturePages.commande:
                this.kfDeData = [
                    this.créeAFacturer(),
                ];
                this.kfAFacturer.ajouteValidateur(KfValidateurs.required);
                break;

            default:
                console.log(this.pageDef);
                break;
        }
    }
}
