import { Component, Input } from '@angular/core';
import { KfComposant } from '../../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../../kf-composants-types';

@Component({
    selector: 'app-kf-contenus',
    templateUrl: './kf-contenus.component.html',
})
export class KfContenusComponent {
    @Input() contenus: KfComposant[];
    @Input() avecClassesFormGroup: boolean;

    avecClasseFormGroup(contenu: KfComposant): boolean {
        switch (contenu.typeDeComposant) {
            case KfTypeDeComposant.caseacocher:
            case KfTypeDeComposant.input:
                return true;
            default:
                return false;
        }
    }

}
