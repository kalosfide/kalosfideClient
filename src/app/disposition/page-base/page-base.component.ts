import { Subscription } from 'rxjs';


import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { PageDef } from 'src/app/commun/page-def';
import { OnDestroy } from '@angular/core';
import { isArray } from 'util';
import { KfEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';

export abstract class PageBaseComponent implements OnDestroy {

    subscriptions: Subscription[] = [];

    abstract pageDef: PageDef;

    get nom(): string {
        return this.pageDef.urlSegment;
    }
    get titre(): string {
        return this.pageDef.titre;
    }

    protected superGroupe: KfSuperGroupe;
    protected _superGroupes: KfSuperGroupe[];

    public get superGroupes(): KfSuperGroupe[] {
        if (this._superGroupes) {
            return this._superGroupes;
        } else {
            return [this.superGroupe];
        }
    }
    valeur1(superGroupe: KfSuperGroupe): any {
        if (superGroupe.gereValeur) {
            return superGroupe.gereValeur.valeur;
        } else {
            return 'indéfini';
        }
    }

    ngOnDestroy_Subscriptions() {
        this.subscriptions.forEach(
            subscription => subscription.unsubscribe()
        );
    }

    ngOnDestroy() {
        this.ngOnDestroy_Subscriptions();
    }

    traite(evenement: KfEvenement) {}

}
