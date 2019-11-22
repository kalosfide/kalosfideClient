import { KeyUidRnoNoEditeur } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-editeur';
import { Categorie } from 'src/app/modeles/catalogue/categorie';
import { CategorieService } from 'src/app/modeles/catalogue/categorie.service';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfValidateurs, KfValidateur } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { CategorieALESComponent } from './categorie-ales.component';
import { CategoriePages } from './categorie-pages';

export class CategorieEditeur extends KeyUidRnoNoEditeur<Categorie> {
    créeAutresChamps(component: CategorieALESComponent) {
        this.keyAuto = true;

        const nom: KfComposant = Fabrique.input.texte('nom', 'Nom');
        nom.ajouteValidateur(KfValidateurs.required);
        nom.ajouteValidateur(KfValidateurs.longueurMax(200));
        if (component.pageDef === CategoriePages.ajoute) {
            nom.ajouteValidateur(KfValidateurs.validateurDeFn('nomPris',
                (value: any) => {
                    return component.service.nomPris(value);
                },
                'Ce nom est déjà pris'));
        } else {
            if (component.pageDef === CategoriePages.edite) {
                nom.ajouteValidateur(KfValidateurs.validateurDeFn('nomPris',
                    (value: any) => {
                        return component.service.nomPrisParAutre(this._kfNo.valeur, value);
                    },
                    'Ce nom est déjà pris'));
            }
        }

        this.ajoute(nom);
    }
}
