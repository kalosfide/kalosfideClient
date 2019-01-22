import { KfComposant } from '../kf-composant/kf-composant';
import { KfListe } from './kf-liste';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfBouton } from '../kf-elements/kf-bouton/kf-bouton';
import { KfParametres } from '../kf-composants-parametres';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../kf-partages/kf-evenements';
import { KfLien } from '../kf-elements/kf-lien/kf-lien';

/**
 * KfListeSelecteursInterface
 * contient les informations nécessaires pour créer les sélecteurs des items et du nouveau
 * les descriptions des champs sont avec le constructeur de KfListeSelecteurs
 */
export interface KfListeSelecteursInterface {
    creeSelecteur?: (item?: object) => KfComposant;
    texte?: (item?: object) => string;
    imageAvant?: (item?: object) => string;
    imageApres?: (item?: object) => string;
    /**
     * type des composants des sélecteurs, doit être constructible par texte et images et emettre des clics
     * (implémentés: bouton et lien (si avecIds))
     */
    typeDeComposant?: KfTypeDeComposant;
    baseDesTextes?: string;
    texteNouveau?: string;
    /**
     * par défaut, le template place les contenus entre des balises div
     * si avecNav est vrai, les contenus seront entre des balises nav
     */
    avecNav?: boolean;
    /**
     * par défaut, le template n'utilise pas de balises de liste pour afficher les contenus
     * si avecUL est vrai, il utilisera les balises ul et li
     */
    avecUL?: boolean;
}

/**
 * KfListeSelecteurs: objet permettant à la KfListe parent de associer des sélecteurs aux items
 */
export class KfListeSelecteurs {

    /**
     * parent du gestionnaire
     */
    liste: KfListe;

    // valeur par défaut créée à partir de texte, des images et du type
    // si item non défini, retourne la valeur pour le sélecteur de la commande nouveau
    creeSelecteur: (item?: object) => KfComposant;

    // valeur par défaut créée à partir de baseDesTextes
    // si item non défini, retourne la valeur pour le sélecteur de la commande nouveau
    texte: (item?: object) => string;

    // si item non défini, retourne la valeur pour le sélecteur de la commande nouveau
    imageAvant: (item?: object) => string;

    // si item non défini, retourne la valeur pour le sélecteur de la commande nouveau
    imageApres: (item?: object) => string;

    // valeur par défaut: TYPE_EN_TETE_PAR_DEFAUT
    typeDeComposant: KfTypeDeComposant;

    // valeur par défaut: TEXTE_EN_TETE_PAR_DEFAUT
    baseDesTextes: string;
    /**
     * par défaut, le template place les contenus entre des balises div
     * si avecNav est vrai, les contenus seront entre des balises nav
     */
    avecNav: boolean;
    /**
     * par défaut, le template n'utilise pas de balises de liste pour afficher les contenus
     * si avecUL est vrai, il utilisera les balises ul et li
     */
    avecUL: boolean;

    /**
     * permet d'associer un item et son sélecteur
     */
    private tableDesSelecteurs: { selecteur: KfComposant, item: object }[];

    /**
     * sélecteur de l'item nouveau, créé si la liste est avec liens
     */
    selecteurNouveau: KfComposant;

    /**
     * objet permettant à la KfListe parent de associer des sélecteurs aux items
     * @param liste parent du gestionnaire
     * @param selecteursInterface {
     *  @param creeSelecteur retourne le sélecteur du item passé en paramètre,sans paramètre celui de la commande nouveau
     *      valeur par défaut: créée à partir de texte, des images et du type
     *  @param texte retourne le texte pour le item passé en paramètre, sans paramètre celui pour la commande nouveau
     *      valeur par défaut si imageAvant et imageApres ne sont pas définies: créée à partir de baseDesTextes
     *  @param imageAvant retourne l'imageAvant pour le item passé en paramètre, sans paramètre celle pour la commande nouveau
     *  @param imageApres retourne l'imageApres pour le item passé en paramètre, sans paramètre celle pour la commande nouveau
     *  @param typeDeComposant type des composants des sélecteurs, doit être constructible par texte et images et emettre des clics
     *      valeur par défaut: LISTE_TYPE_EN_TETE_PAR_DEFAUT
     *  @param baseDesTextes texte(item) sera baseDesTextes + ' ' + item.id si items avec ids
     *      valeur par défaut: LISTE_TEXTE_EN_TETE_PAR_DEFAUT
     *  @param texteNouveau texte() sera texteNouveau
     *      valeur par défaut: LISTE_TEXTE_EN_TETE_NOUVEAU_PAR_DEFAUT
     * }
     */
    constructor(liste: KfListe, selecteursInterface?: KfListeSelecteursInterface) {
        this.tableDesSelecteurs = [];
        this.liste = liste;
        const inter = selecteursInterface ? selecteursInterface : {};
        if (inter.creeSelecteur) {
            this.creeSelecteur = (): KfComposant => {
                const selecteur = inter.creeSelecteur();
                selecteur.ajouteClasseDef(
                    () => selecteur === this.liste.selecteurChoisi ? 'kf-choisi' : null
                );
                selecteur.inactivitéFnc = this.liste.editions.editionEnCoursFnc;
                return selecteur;
            };
        } else {
            this.typeDeComposant = inter.typeDeComposant ? inter.typeDeComposant
                : KfParametres.listeParDefaut.typeSelecteur;
            if (inter.texte) {
                this.texte = inter.texte;
            } else {
                this.baseDesTextes = inter.baseDesTextes ? inter.baseDesTextes
                    : KfParametres.listeParDefaut.nomDeBaseSelecteur;
                inter.texteNouveau = inter.texteNouveau ? inter.texteNouveau
                    : KfParametres.listeParDefaut.texteSelecteurNouveau;
                this.texte = (item?: object): string => {
                    if (item) {
                        let id: number;
                        if (this.liste.creeItems) {
                            id = this.liste.creeItems.id(item);
                        }
                        return id ? this.baseDesTextes + ' ' + id : this.baseDesTextes;
                    } else {
                        return inter.texteNouveau;
                    }
                };
            }
            this.creeSelecteur = (item: object): KfComposant => {
                let nom = KfParametres.listeParDefaut.nomDeBaseSelecteur;
                let id: number;
                if (this.liste.creeItems) {
                    id = this.liste.creeItems.id(item);
                }
                nom = nom + (id ? id : '_' + this.liste.contenuDeItem(item).nom);
                let t: string;
                if (this.texte) {
                    t = this.texte(item);
                }
                let iav: string;
                if (this.imageAvant) {
                    iav = this.imageAvant(item);
                }
                let iap: string;
                if (this.imageApres) {
                    iap = this.imageApres(item);
                }
                let selecteur: KfComposant;
                switch (this.typeDeComposant) {
                    case KfTypeDeComposant.bouton:
                        selecteur = new KfBouton(nom, t, iav, iap);
                        selecteur.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic,
                            (evenement: KfEvenement) => {
                                this.liste.fixeChoisi(item);
                                evenement.statut = KfStatutDEvenement.fini;
                            }
                        );
                        break;
                    case KfTypeDeComposant.lien:
                        selecteur = new KfLien(nom, id.toString(), t, iav, iap);
                        break;
                    default:
                        break;
                }
                selecteur.ajouteClasseDef('kf-liste-selecteur');
                selecteur.ajouteClasseDef(
                    () => selecteur === this.liste.selecteurChoisi ? 'kf-choisi' : null
                );
                selecteur.inactivitéFnc = this.liste.editions.editionEnCoursFnc;
                return selecteur;
            };
            if (this.typeDeComposant === KfTypeDeComposant.lien) {
                this.selecteurNouveau = new KfLien(
                    KfParametres.listeParDefaut.nomDeBaseSelecteur + 0,
                    '0',
                    inter.texteNouveau ? inter.texteNouveau : KfParametres.listeParDefaut.texteSelecteurNouveau
                );
            }
        }
        this.avecNav = inter.avecNav === true;
        this.avecUL = inter.avecUL === true;
    }

    get avecLiens(): boolean {
        return this.typeDeComposant === KfTypeDeComposant.lien;
    }

    titre(item: object): string {
        const i = this.liste.editions && this.liste.editions.itemNouveau === item ? null : item;
        if (this.texte) {
            return this.texte(i);
        } else {
            return this.liste.contenuDeItem(i).nom;
        }
    }

    ajoute(item: object) {
        this.tableDesSelecteurs.push(
            {
                selecteur: this.creeSelecteur(item),
                item: item
            }
        );
    }

    supprime(item: object) {
       this.tableDesSelecteurs = this.tableDesSelecteurs.filter(se => se.item !== item);
    }

    effaceTout() {
        this.tableDesSelecteurs = [];
    }

    remplit() {
        this.tableDesSelecteurs = [];
        this.liste.items.forEach(
            (item: object) => this.tableDesSelecteurs.push(
                {
                    selecteur: this.creeSelecteur(item),
                    item: item
                }
            )
        );
    }

    /**
     * retourne l'item d'un sélecteur
     */
    item(selecteur: KfComposant): object {
        const selecteur_item = this.tableDesSelecteurs.find(tc => tc.selecteur === selecteur);
        if (selecteur_item) {
            return selecteur_item.item;
        }
    }


    /**
     * retrouve le sélecteur d'un item
     */
    selecteur(item: object): KfComposant {
        const selecteur_item = this.tableDesSelecteurs.find(tc => tc.item === item);
        if (selecteur_item) {
            return selecteur_item.selecteur;
        }
    }

    /**
     * retourne l'array des selecteurs dans l'ordre des items
     * */
    get selecteurs(): KfComposant[] {
        return this.liste.items.map(
            (item: object) => this.selecteur(item)
        );
    }

}
