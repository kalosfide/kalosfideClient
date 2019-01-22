import { KfListeDeroulante } from '../kf-composants/kf-elements/kf-liste-deroulante/kf-liste-deroulante';
import { DataKey } from './data-key';
import { KfTexteDef } from '../kf-composants/kf-partages/kf-texte-def';

export class DataListeDeroulante<T extends DataKey> extends KfListeDeroulante {

    constructor(nom: string,
        texte?: KfTexteDef,
        imageAvant?: KfTexteDef,
        imageApres?: KfTexteDef
    ) {
        super(nom, texte, imageAvant, imageApres);
    }

}
