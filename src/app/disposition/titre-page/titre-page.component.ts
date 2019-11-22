import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ITitrePage, TitrePage } from './titre-page';
import { KfEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';

@Component({
    selector: 'app-titre-page',
    templateUrl: './titre-page.html',
    styles: []
})
export class TitrePageComponent implements OnInit {
    @Input() iTitrePage: ITitrePage;

    titrePage: TitrePage;

    ngOnInit() {
        this.titrePage = new TitrePage(this.iTitrePage);
    }

}
