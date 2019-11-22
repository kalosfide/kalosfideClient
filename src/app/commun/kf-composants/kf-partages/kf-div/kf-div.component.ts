import { Component, OnInit, Input } from '@angular/core';
import { KfDiv } from './kf-div';

@Component({
    selector: 'app-kf-div',
    templateUrl: './kf-div.component.html',
    styleUrls: ['../../kf-composants.scss']
})
export class KfDivComponent implements OnInit {
    @Input() div: KfDiv;

    ngOnInit() {
    }

}
