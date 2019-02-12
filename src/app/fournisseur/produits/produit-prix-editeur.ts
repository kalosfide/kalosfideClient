import { ProduitPrix } from '../../modeles/produit-prix';
import { KeyUidRnoNoEditeur } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-editeur';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-nombre';

export class ProduitPrixEditeur extends KeyUidRnoNoEditeur<ProduitPrix> {
    créeAutresChamps(action: string) {
        this.keyAuto = true;

        const nom = new KfInputTexte('nom', 'Nom du produit');
        nom.lectureSeule = true;
        const actuel = new KfInputNombre('actuel', 'Prix actuel');
        actuel.lectureSeule = true;
        const nouveau = new KfInputNombre('nouveau', 'Nouveau prix');
        nouveau.min = 0;
        nouveau.max = 999.99;
        nouveau.pas = 0.10;
        this.ajoute(nom, actuel, nouveau);
    }
}
