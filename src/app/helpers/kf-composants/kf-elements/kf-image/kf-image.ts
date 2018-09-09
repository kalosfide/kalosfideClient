import { KfParametres } from '../../kf-composants-parametres';
import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';

export class KfImage extends KfElement {

    constructor(nom: string, image: string) {
        super(nom, KfTypeDeComposant.image, null, image);
    }

    get image(): string {
        return this.imageAvant;
    }
    get urlImage(): string {
        return KfParametres.urlImage(this.image);
    }

}
