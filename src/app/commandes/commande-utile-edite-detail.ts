import { Fabrique } from '../disposition/fabrique/fabrique';
import { DetailCommande } from './detail-commande';
import { KfInputTexte } from '../commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from '../commun/kf-composants/kf-elements/kf-input/kf-input-nombre';
import { TypeCommande } from '../modeles/type-commande';
import { KfValidateurs, KfValidateur } from '../commun/kf-composants/kf-partages/kf-validateur';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';
import { KfListeDeroulanteTexte } from '../commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';
import { DetailCommandeTitres } from './detail-commande-titres';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../commun/kf-composants/kf-partages/kf-evenements';

export class CommandeUtileEditeDétail {
    private _detail: DetailCommande;
    private _type: '+' | '-';
    get ajout(): boolean { return this._type === '+'; }
    get suppression(): boolean { return this._type === '-'; }
    private _groupe: KfGroupe;

    constructor(detail: DetailCommande) {
        this._detail = detail;
    }

    private _ajouteTexteInvisible(nom: string, valeur: string): KfInputTexte {
        const input = Fabrique.input.texteInvisible(nom, valeur);
        this._groupe.ajoute(input);
        return input;
    }

    private _ajouteNombreInvisible(nom: string, valeur: number): KfInputNombre {
        const input = Fabrique.input.nombreInvisible(nom, valeur);
        this._groupe.ajoute(input);
        return input;
    }

    private _ajouteLectureSeule(nom: string, titre: string, valeur: string): KfInputTexte {
        const input = Fabrique.input.texteLectureSeule(nom, titre, valeur);
        this._groupe.ajoute(input);
        return input;
    }

    private _ajouteKeyUidRnoNo2() {
        this._ajouteTexteInvisible('uid', this._detail.apiDétail.uid);
        this._ajouteNombreInvisible('rno', this._detail.apiDétail.rno);
        this._ajouteNombreInvisible('no', this._detail.apiDétail.no);
        this._ajouteTexteInvisible('uid2', this._detail.apiDétail.uid2);
        this._ajouteNombreInvisible('rno2', this._detail.apiDétail.rno2);
        this._ajouteNombreInvisible('no2', this._detail.apiDétail.no2);
    }

    private _ajouteTypeCommandeListe(): KfListeDeroulanteTexte {
        const typeCommandeListe = Fabrique.listeDéroulante.texte('typeCommande', DetailCommandeTitres.typeCommande);
        this._detail.optionsTypeCommande.forEach(o => {
            typeCommandeListe.créeEtAjouteOption(o.texte, o.valeur);
        });
        typeCommandeListe.créeOption0();
        typeCommandeListe.valeur = this._detail.apiDétail.typeCommande
            ? this._detail.apiDétail.typeCommande
            : this._detail.produit.typeCommande;
        this._groupe.ajoute(typeCommandeListe);
        if (this.suppression || this._detail.typeCommandeLectureSeule) {
            typeCommandeListe.visible = false;
            this._ajouteLectureSeule('typeCommandeTexte', DetailCommandeTitres.typeCommande, this._detail.texteTypeDemande);
        } else {
            typeCommandeListe.ajouteValidateur(KfValidateurs.required);
        }
        this._detail.typeCommandeListe = typeCommandeListe;
        return typeCommandeListe;
    }

    private _ajouteDemandeNombre(): KfInputNombre {
        let demandeNombre: KfInputNombre;
        if (this.suppression || this._detail.demandeLectureSeule) {
            demandeNombre = this._ajouteNombreInvisible('demande', this._detail.demande);
            this._detail.demandeTexte =
                this._ajouteLectureSeule('demandeTexte', DetailCommandeTitres.demande, Fabrique.texte.demandeAvecUnité(this._detail));
        } else {
            const titre = this._detail.étatSiteLivraison ? DetailCommandeTitres.demande : DetailCommandeTitres.quantité;
            demandeNombre = Fabrique.input.nombreQuantité('demande', () => this._detail.typeCommande, titre);
            const valeur = this._detail.demande;
            if (valeur) {
                demandeNombre.valeur = valeur;
            }
            demandeNombre.ajouteValidateur(KfValidateurs.nombreNonNul);
            this._groupe.ajoute(demandeNombre);
        }
        this._detail.demandeNombre = demandeNombre;
        return demandeNombre;
    }

    private _ajouteALivrerNombre(): KfInputNombre {
        let aLivrerNombre: KfInputNombre;
        if (this.suppression || !(this._detail.roleFournisseur && this._detail.étatSiteLivraison) || !this._detail.estDansFacture) {
            aLivrerNombre = this._ajouteNombreInvisible('aLivrer', this._detail.aLivrer);
            this._detail.aLivrerTexte =
                this._ajouteLectureSeule('aLivrerTexte', DetailCommandeTitres.aLivrer, Fabrique.texte.aLivrerAvecUnité(this._detail));
        } else {
            aLivrerNombre = Fabrique.input.nombreQuantité('aLivrer', () => this._detail.typeCommande, this._detail.estDansFacture
                ? DetailCommandeTitres.aLivrerFacture
                : DetailCommandeTitres.aLivrer
            );
            const valeur = this._detail.aLivrer;
            if (valeur) {
                aLivrerNombre.valeur = valeur;
            }
            this._groupe.ajoute(aLivrerNombre);
        }
        this._detail.aLivrerNombre = aLivrerNombre;
        return aLivrerNombre;
    }

    private _ajouteAFacturerNombre(): KfInputNombre {
        let aFacturerNombre: KfInputNombre;
        aFacturerNombre = Fabrique.input.nombreQuantité('aFacturer',
            (() => this._detail.typeCommande).bind(this), DetailCommandeTitres.aFacturer);
        aFacturerNombre.ajouteValidateur(KfValidateurs.required);
        const valeur = this._detail.aFacturer;
        if (valeur !== null && valeur !== undefined) {
            aFacturerNombre.valeur = valeur;
        }
        this._groupe.ajoute(aFacturerNombre);
        this._detail.aFacturerNombre = aFacturerNombre;
        return aFacturerNombre;
    }

    prépareGroupe(groupe: KfGroupe, type?: '+' | '-') {
        this._type = type;
        this._groupe = groupe;

        this._ajouteKeyUidRnoNo2();

        // champs d'info
        if (!this._detail.estDansListeParProduit) {
            this._ajouteLectureSeule('nomCategorie', DetailCommandeTitres.categorie, this._detail.nomCategorie);
            this._ajouteLectureSeule('nomProduit', DetailCommandeTitres.produit, this._detail.nomProduit);
        }
        if (!this._detail.roleFournisseur) {
            this._ajouteLectureSeule('prix', DetailCommandeTitres.prix, Fabrique.texte.avecProduit_prix(this._detail));
        } else {
            //            this._ajouteLectureSeule('nomClient', this._detail.labelClient, this._detail.texteClient);
        }

        // champs de valeur

        if (!this._detail.estDansFacture) {
            const typeCommandeListe = this._ajouteTypeCommandeListe();
            const demandeNombre = this._ajouteDemandeNombre();

            if (!(this.suppression || this._detail.typeCommandeLectureSeule || this._detail.demandeLectureSeule)) {
                typeCommandeListe.gereHtml.suitLaValeur = true;
                typeCommandeListe.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
                    (evenement: KfEvenement) => {
                        const pas = TypeCommande.pasInputNombre(typeCommandeListe.valeur);
                        if (demandeNombre.pas !== pas) {
                            demandeNombre.valeur = 0;
                            demandeNombre.pas = pas;
                        }
                        evenement.statut = KfStatutDEvenement.fini;
                    });
            }

            if (this._detail.roleFournisseur) {
                this._ajouteALivrerNombre();
            }

            if (this._detail.étatSiteLivraison) {
                if (this._detail.estDansListeParProduit) {
                    this._detail.aLivrerNombre.ajouteValidateur(KfValidateurs.required);
                } else {
                    groupe.ajouteValidateur(KfValidateurs.auMoinsUnRequis(
                        { nom: this._detail.demandeNombre.nom, texte: DetailCommandeTitres.demande },
                        { nom: this._detail.aLivrerNombre.nom, texte: DetailCommandeTitres.aLivrer },
                    ));
                }
            } else {
                demandeNombre.ajouteValidateur(KfValidateurs.required);
            }
        } else {
            this._ajouteALivrerNombre();
            this._ajouteAFacturerNombre();
        }

    }

}
