import { KeyUidRnoNoEditeur } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-editeur';
import { Produit } from 'src/app/modeles/catalogue/produit';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { TypeMesure, IdTypeMesure } from 'src/app/modeles/type-mesure';
import { TypeCommande, IdTypeCommande } from 'src/app/modeles/type-commande';
import { Categorie } from 'src/app/modeles/catalogue/categorie';
import { KfInputNombre } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-nombre';
import { ProduitPages } from './produit-pages';
import { Data } from '@angular/router';
import { KfTypeDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { EtatsProduits } from 'src/app/modeles/catalogue/etat-produit';
import { ProduitALESComponent } from './produit-ales.component';
import { KfListeDeroulanteNombre } from 'src/app/commun/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante-texte';

export class ProduitEditeur extends KeyUidRnoNoEditeur<Produit> {
    categories: Categorie[];
    categorieNo: KfListeDeroulanteNombre;
    nomCategorie: KfInputTexte;
    texteTypeMesure: KfInputTexte;
    texteTypeCommande: KfInputTexte;
    texteEtat: KfInputTexte;
    prix: KfInputNombre;
    prixActuel: KfInputTexte;
    component: ProduitALESComponent;

    private créeNom(lectureSeule?: boolean) {
        const nom = Fabrique.input.texte('nom', 'Nom du produit');
        if (lectureSeule) {
            nom.lectureSeule = true;
        } else {
            nom.ajouteValidateur(KfValidateurs.required);
            nom.ajouteValidateur(KfValidateurs.longueurMax(200));
            if (this.component.pageDef === ProduitPages.ajoute) {
                nom.ajouteValidateur(KfValidateurs.validateurDeFn('nomPris',
                    (value: any) => {
                        return this.component.service.nomPris(value);
                    },
                    'Ce nom est déjà pris'));
            } else {
                if (this.component.pageDef === ProduitPages.edite) {
                    nom.ajouteValidateur(KfValidateurs.validateurDeFn('nomPris',
                        (value: any) => {
                            return this.component.service.nomPrisParAutre(this._kfNo.valeur, value);
                        },
                        'Ce nom est déjà pris'));
                }
            }
        }
        this.ajoute(nom);
    }
    private créeCategorie(lectureSeule?: boolean) {
        if (lectureSeule) {
            this.nomCategorie = Fabrique.input.texte('nomCategorie', 'Catégorie');
            this.nomCategorie.lectureSeule = true;
            this.ajoute(this.nomCategorie);
        } else {
            const categorieNo = Fabrique.listeDéroulante.nombre('categorieNo', 'Catégorie');
            this.categorieNo = categorieNo;
            categorieNo.ajouteValidateur(KfValidateurs.required);
            categorieNo.ajouteValidateur(KfValidateurs.longueurMax(200));
            this.ajoute(categorieNo);
        }
    }
    private créeTypesMesureEtCommande(lectureSeule?: boolean) {
        const titreMesure = 'Prix fixé...';
        const titreCommande = 'Mode de commande';
        if (lectureSeule) {
            this.texteTypeMesure = Fabrique.input.texte('texteTypeMesure', titreMesure);
            this.texteTypeMesure.lectureSeule = true;
            this.texteTypeMesure.estRacineV = true;
            this.texteTypeCommande = Fabrique.input.texte('texteTypeCommande', titreCommande);
            this.texteTypeCommande.lectureSeule = true;
            this.texteTypeCommande.estRacineV = true;
            this.ajoute(this.texteTypeMesure, this.texteTypeCommande);
        } else {
            const typeMesure = Fabrique.listeDéroulante.texte('typeMesure', titreMesure);
            TypeMesure.Mesures.forEach(mesure => {
                typeMesure.créeEtAjouteOption(Fabrique.texte.typeMesure(mesure), mesure);
            });
            typeMesure.ajouteValidateur(KfValidateurs.required);
            typeMesure.créeOption0();
            typeMesure.valeur = IdTypeMesure.ALaPièce;

            const typeCommande = Fabrique.listeDéroulante.texte('typeCommande', titreCommande);
            TypeCommande.commandes.forEach(commande => {
                typeCommande.créeEtAjouteOption(Fabrique.texte.typeCommande(commande), commande);
            });
            typeCommande.ajouteValidateur(KfValidateurs.required);
            typeCommande.créeOption0();
            typeCommande.valeur = IdTypeCommande.ALUnité;

            this.ajoute(typeMesure, typeCommande);

            const rafraichit = () => {
                if (typeMesure.valeur === IdTypeMesure.ALaPièce) {
                    typeCommande.valeur = IdTypeCommande.ALUnité;
                    typeCommande.options.forEach(option => {
                        option.inactif = option.valeur !== IdTypeCommande.ALUnité ? true : undefined;
                    });
                } else {
                    typeCommande.options.forEach(option => option.inactif = undefined);
                }
            };

            rafraichit();
            typeMesure.gereHtml.suitLaValeur = true;
            typeMesure.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange, rafraichit);
        }
    }

    private créePrix(lectureSeule?: boolean) {
        this.prix = Fabrique.input.nombrePrix('prix', 'Nouveau prix');
        this.prix.min = 0;
        this.prix.max = 999.99;
        this.prix.pas = 0.05;
        this.prix.lectureSeule = lectureSeule;
        this.ajoute(this.prix);
    }

    private créePrixAvecAncien() {
        this.prixActuel = Fabrique.input.texte('prixActuel', 'Ancien prix');
        this.prixActuel.lectureSeule = true;
        this.prixActuel.gereValeur.estRacineV = true;
        this.ajoute(this.prixActuel);
    }

    private créeEtat(lectureSeule?: boolean) {
        const titre = 'Etat';
        if (lectureSeule) {
            this.texteEtat = Fabrique.input.texteLectureSeule('texteEtat', titre);
            this.texteEtat.estRacineV = true;
            this.ajoute(this.texteEtat);
        } else {
            const etat = Fabrique.listeDéroulante.texte('etat', titre);
            EtatsProduits.etats.forEach(e => etat.créeEtAjouteOption(e.texte, e.valeur));
            etat.ajouteValidateur(KfValidateurs.required);
            etat.créeOption0();
            etat.valeur = EtatsProduits.disponible.valeur;
            this.ajoute(etat);
        }
    }

    créeAutresChamps(component: ProduitALESComponent) {
        this.component = component;
        this.keyAuto = true;

        const lectureSeule = true;
        switch (component.pageDef) {
            case ProduitPages.ajoute:
                this.créeCategorie();
                this.créeNom();
                this.créeTypesMesureEtCommande();
                this.créePrix();
                this.créeEtat();
                break;
            case ProduitPages.edite:
                this.créeCategorie();
                this.créeNom();
                this.créeTypesMesureEtCommande();
                break;
            case ProduitPages.supprime:
                this.créeCategorie(lectureSeule);
                this.créeNom(lectureSeule);
                this.créeTypesMesureEtCommande(lectureSeule);
                break;
            case ProduitPages.prix:
                this.créeCategorie(lectureSeule);
                this.créeNom(lectureSeule);
                this.créeTypesMesureEtCommande(lectureSeule);
                this.créePrixAvecAncien();
                this.créePrix();
                this.créeEtat();
                break;
            default:
                break;
        }
    }

    chargeData(data: Data) {
        this.categories = data.categories;
        if (this.categorieNo) {
            this.categories.forEach(c => this.categorieNo.créeEtAjouteOption(c.nom, c.no));
            this.categorieNo.valeur = this.categories[0].no;
        }
    }

    fixeValeur(produit: Produit) {
        this.edition.fixeValeur(produit);
        if (this.nomCategorie) {
            this.nomCategorie.valeur = this.categories.find(c => c.no === produit.categorieNo).nom;
            this.texteTypeMesure.valeur = TypeMesure.texte_le(produit.typeMesure);
            if (this.prixActuel) {
                this.prixActuel.valeur = Fabrique.texte.produit_prix(produit);
                this.prix.fixeTexte('Prix ' + TypeMesure.texte_le(produit.typeMesure));
            }
            this.texteTypeCommande.valeur = TypeCommande.pourListe(produit.typeCommande);
        }
    }
}
