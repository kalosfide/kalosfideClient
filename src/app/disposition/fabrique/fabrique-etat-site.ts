import { FabriqueMembre } from './fabrique-membre';
import { FabriqueClasse, Fabrique } from './fabrique';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { FournisseurPages } from 'src/app/fournisseur/fournisseur-pages';
import { PageDef } from 'src/app/commun/page-def';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';

export class EtatSite extends FabriqueMembre {
    id: IdEtatSite;

    /**
     * nom de l'état
     */
    nom: string;

    /**
     * titre à afficher dans la description de l'état
     */
    titre: string;

    /**
     * article à ajouter au titre
     */
    article: string;

    get article_Titre(): string {
        return this.article + ' ' + this.titre;
    }

    get article_titre(): string {
        return this.article + ' ' + this.fabrique.texte.initale(this.titre);
    }

    get Article_Titre(): string {
        return this.fabrique.texte.Initale(this.article) + ' ' + this.titre;
    }

    /**
     * pageDef de la page pour changer l'état
     */
    pageDef: PageDef;
    description: () => KfComposant[];
    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }
}

export class FabriqueEtatSite extends FabriqueMembre {
    private _états: EtatSite[];

    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
        this.créeEtats();
    }

    titre = 'Etats du site';

    intro = `Le site a trois états qui définissent les actions possibles du fournisseur et des clients qui ont un compte de connexion.`;

    get vueTableDef(): IKfVueTableDef<EtatSite> {
        const vueTableDef: IKfVueTableDef<EtatSite> = {
            colonnesDef: [
                { nom: 'nom', enTeteDef: { titreDef: 'Etat' }, créeContenu: (état: EtatSite) => état.nom, },
                { nom: 'titre', enTeteDef: { titreDef: 'Description' }, créeContenu: (état: EtatSite) => état.titre },
                {
                    nom: 'action', enTeteDef: { titreDef: 'Remarques' }, créeContenu: (état: EtatSite) => {
                        const groupe = new KfGroupe('');
                        état.description().forEach(d => groupe.ajoute(d));
                        return groupe;
                    }
                }
            ]
        };
        return vueTableDef;
    }

    private créeCatalogue(): EtatSite {
        const état = new EtatSite(this.fabrique);
        état.id = IdEtatSite.catalogue;
        état.pageDef = FournisseurPages.produits;
        état.nom = 'Catalogue';
        état.article = 'la';
        état.titre = 'Modification du catalogue';
        état.description = () => {
                const description: KfComposant[] = [];
                let etiquette: KfEtiquette;
                etiquette = new KfEtiquette('');
                etiquette = this.fabrique.ajouteEtiquetteP(description);
                this.fabrique.ajouteTexte(etiquette,
                    `La `,
                    { t: this.catalogue.titre, b: KfTypeDeBaliseHTML.i },
                    ` ne peut commencer que s'il n'y a pas de commande en attente ou en cours de traitement ou non facturées.`
                );

                etiquette = this.fabrique.ajouteEtiquetteP(description);
                this.fabrique.ajouteTexte(etiquette,
                    `Pendant la `,
                    { t: this.catalogue.titre, b: KfTypeDeBaliseHTML.i },
                    `, les commandes sont arrétées.`
                );

            return description;
        };
        return état;
    }

    private créeLivraison(): EtatSite {
        const état = new EtatSite(this.fabrique);
        état.id = IdEtatSite.livraison;
        état.pageDef = FournisseurPages.livraison;
        état.nom = 'Livraison';
        état.article = 'le';
        état.titre = 'Traitement des commandes';
        état.description = () => {
            const description: KfComposant[] = [];
            let etiquette: KfEtiquette;
                etiquette = this.fabrique.ajouteEtiquetteP(description);
                this.fabrique.ajouteTexte(etiquette,
                    `Le `,
                    { t: this.livraison.titre, b: KfTypeDeBaliseHTML.i },
                    ` ne peut pas commencer si une `,
                    { t: this.catalogue.titre, b: KfTypeDeBaliseHTML.i },
                    ` est en cours.`
                );

                etiquette = this.fabrique.ajouteEtiquetteP(description);
                this.fabrique.ajouteTexte(etiquette,
                    `Pendant le `,
                    { t: this.livraison.titre, b: KfTypeDeBaliseHTML.i },
                    `, les clients qui se connectent ne peuvent pas commander.`
                );

            return description;
        };
        return état;
    }

    private créeOuvert(): EtatSite {
        const état = new EtatSite(this.fabrique);
        état.id = IdEtatSite.ouvert;
        état.pageDef = null;
        état.nom = 'Ouvert';
        état.titre = 'Commandes ouvertes';
        état.description = () => {
            const description: KfComposant[] = [];
            let etiquette: KfEtiquette;
            etiquette = this.fabrique.ajouteEtiquetteP(description);
            this.fabrique.ajouteTexte(etiquette,
                `Le site est dans cet état quand il n'y a ni `,
                { t: this.catalogue.titre, b: KfTypeDeBaliseHTML.i },
                ` ni `,
                { t: this.livraison.titre, b: KfTypeDeBaliseHTML.i },
                ` en cours.`
            );

            etiquette = this.fabrique.ajouteEtiquetteP(description);
            this.fabrique.ajouteTexte(etiquette,
                `Les clients qui se connectent peuvent commander. Le fournisseur peut commander pour un client qui n'a pas de compte.`);

            return description;
        };
        return état;
    }

    private créeEtats() {
        this._états = [
            this.créeCatalogue(),
            this.créeLivraison(),
            this.créeOuvert(),
        ];
    }

    get catalogue(): EtatSite {
        return this._états[0];
    }
    get livraison(): EtatSite {
        return this._états[1];
    }
    get ouvert(): EtatSite {
        return this._états[2];
    }

    get états(): EtatSite[] {
        return this._états;
    }

    état(id: string): EtatSite {
        switch (id) {
            case IdEtatSite.ouvert:
                return this.ouvert;
            case IdEtatSite.catalogue:
                return this.catalogue;
            case IdEtatSite.livraison:
                return this.livraison;
            default:
                return undefined;
        }
    }
}
