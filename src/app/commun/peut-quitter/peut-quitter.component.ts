import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-peut-quitter',
    templateUrl: './peut-quitter.component.html',
})
export class PeutQuitterComponent {
    @Input() titre: string;

    constructor(
        public modal: NgbActiveModal
    ) {
        this.titre = 'Constructor';
    }

}
