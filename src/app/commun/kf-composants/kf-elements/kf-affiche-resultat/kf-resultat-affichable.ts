import { KfTypeResultatAffichable } from './kf-type-resultat-affichable';

// type fixe la classe css
export class KfResultatAffichable {
    type: KfTypeResultatAffichable;
    titre: string;
    détails: string[];

    constructor(
        type: KfTypeResultatAffichable,
        titre?: string,
        détails?: string[]
    ) {
        this.type = type;
        this.titre = titre;
        this.détails = détails;
    }

}
