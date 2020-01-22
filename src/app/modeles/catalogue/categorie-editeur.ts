import { KeyUidRnoNoEditeur } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-editeur';
import { Categorie } from 'src/app/modeles/catalogue/categorie';
import { CategorieService } from 'src/app/modeles/catalogue/categorie.service';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfValidateurs, KfValidateur } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { CategoriePages } from '../../fournisseur/produits/categories/categorie-pages';
import { IDataKeyComponent } from 'src/app/commun/data-par-key/i-data-key-component';

export class CategorieEditeur extends KeyUidRnoNoEditeur<Categorie> {
    kfNom: KfInputTexte;
    kfTexteEtat: KfInputTexte;

    constructor(component: IDataKeyComponent) {
        super(component);
        this.keyAuto = true;
    }

    get service(): CategorieService {
        return this._component.service as CategorieService;
    }

    private validateursNomAjoute(): KfValidateur[] {
        const validateur = KfValidateurs.validateurDeFn('nomPris',
            (value: any) => {
                return this.service.nomPris(value);
            },
            'Ce nom est déjà pris');
        return [
            KfValidateurs.required,
            KfValidateurs.longueurMax(200),
            validateur
        ];
    }
    private validateursNomEdite(): KfValidateur[] {
        const validateur = KfValidateurs.validateurDeFn('nomPris',
            (value: any) => {
                return this.service.nomPrisParAutre(this._kfNo.valeur, value);
            },
            'Ce nom est déjà pris');
        return [
            KfValidateurs.required,
            KfValidateurs.longueurMax(200),
            validateur
        ];
    }

    créeNom(validateurs?: KfValidateur[]): KfInputTexte {
        if (!validateurs) {
            this.kfNom = Fabrique.input.texteLectureSeule('nom', 'Nom');
        } else {
            this.kfNom = Fabrique.input.texte('nom', 'Nom');
            validateurs.forEach(v => this.kfNom.ajouteValidateur(v));
        }
        return this.kfNom;
    }

    créeKfDeData() {
        switch (this.pageDef) {
            case CategoriePages.ajoute:
                this.kfDeData = [
                    this.créeNom(this.validateursNomAjoute()),
                ];
                break;
            case CategoriePages.edite:
                this.kfDeData = [
                    this.créeNom(this.validateursNomEdite()),
                ];
                break;
            case CategoriePages.supprime:
                this.kfDeData = [
                    this.créeNom(),
                ];
                break;
            default:
                break;
        }
    }
}
