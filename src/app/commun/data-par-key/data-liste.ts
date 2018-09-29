import { KfListeDeroulante } from '../kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante';
import { IDataKey } from './data-key';

export class DataListeDeroulante<T extends IDataKey> extends KfListeDeroulante {

    constructor(nom: string,
        texte?: string | (() => string),
        imageAvant?: string | (() => string),
        imageApres?: string | (() => string)
    ) {
        super(nom, texte, imageAvant, imageApres);
    }

}
