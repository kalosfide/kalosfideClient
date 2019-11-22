import { Component } from '@angular/core';
import { PageBaseComponent } from '../page-base/page-base.component';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { PageDef } from 'src/app/commun/page-def';
import { ITitrePage } from '../titre-page/titre-page';

@Component({
    templateUrl: './page-message.component.html',
    styleUrls: ['../../commun/commun.scss']
})
export abstract class PageMessageComponent {

    abstract pageDef: PageDef;
    abstract messages: string[];

    get titre(): string {
        return this.pageDef.titre;
    }
    /** à surcharger si besoin */
    get titrePage(): ITitrePage {
        return {
            titre: this.titre
        };
    }
}
