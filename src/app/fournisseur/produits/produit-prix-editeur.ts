import { ProduitPrix } from '../../modeles/produit-prix';
import { ProduitPrixService } from './produit-prix.service';
import { KeyUidRnoNoEditeur } from 'src/app/commun/data-par-key/key-uid-rno-no/key-uid-rno-no-editeur';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-texte';
import { KfNombre } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-nombre';

export class ProduitPrixEditeur extends KeyUidRnoNoEditeur<ProduitPrix> {
    créeAutresChamps(action: string) {
        this.keyAuto = true;

        const nom = new KfTexte('nom', 'Nom du produit');
        nom.lectureSeule = true;
        const actuel = new KfNombre('actuel', 'Prix actuel');
        actuel.lectureSeule = true;
        const nouveau = new KfNombre('nouveau', 'Nouveau prix');
        nouveau.min = 0;
        nouveau.max = 999.99;
        nouveau.pas = 0.10;
        this.ajoute(nom, actuel, nouveau);
    }
}
