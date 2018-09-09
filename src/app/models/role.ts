import { Entité } from './entite';
import { KfEntrée } from '../helpers/kf-composants/kf-composant/kf-entree';
import { KfNombre } from '../helpers/kf-composants/kf-elements/kf-nombre/kf-nombre';
import { KfTexte } from '../helpers/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfValidateurs } from '../helpers/kf-composants/kf-partages/kf-validateur';
import { KfListeDeroulante } from '../helpers/kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante';
import { TypeRole } from '../sécurité/type-role';

export class Role {
    Type: string;
    Nom: string;
    Adresse: string;
    Fournisseur?: Role;
}

export class RoleEntite implements Entité {
    nom = 'role';
    get champs(): { [keys: string]: KfEntrée } {
        const champs = {};

        const id = new KfNombre('id');
        id.gereVisible.visibilite = false;
        champs['id'] = id;

        const utilisateurId = new KfTexte('');
        utilisateurId.gereVisible.visibilite = false;
        champs['utilisateurId'] = utilisateurId;

        const type = new KfListeDeroulante('type', 'TypeDeRole');
        Object.keys(TypeRole).forEach(
            nomtdr => {
                const tdr = TypeRole[nomtdr];
                type.ajouteOption(tdr.nom, tdr.code);
            }
        );
        type.AjouteValidateur(KfValidateurs.required);
        champs['type'] = type;

        const nom = new KfTexte('nom', 'Nom');
        nom.AjouteValidateur(KfValidateurs.required);
        nom.AjouteValidateur(KfValidateurs.longueurMax(200));
        nom.AjouteValidateur(KfValidateurs.doublon(nom.nom));
        champs['nom'] = nom;

        const adresse = new KfTexte('adresse', 'Adresse');
        adresse.AjouteValidateur(KfValidateurs.longueurMax(500));
        champs['adresse'] = adresse;

        return champs;
    }
}
