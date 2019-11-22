import { Subscription } from 'rxjs';


import { KfSuperGroupe } from '../../commun/kf-composants/kf-groupe/kf-super-groupe';
import { PageDef } from 'src/app/commun/page-def';
import { OnDestroy } from '@angular/core';
import { KfEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { ITitrePage } from '../titre-page/titre-page';
import { BarreTitre } from '../fabrique/fabrique-barre-titre/fabrique-barre-titre';

export abstract class PageBaseComponent implements OnDestroy {

    subscriptions: Subscription[] = [];

    abstract pageDef: PageDef;

    get nom(): string {
        return this.pageDef.urlSegment;
    }

    get titre(): string {
        return this.pageDef.titre;
    }

    private _iTitrePage: ITitrePage;
    get titrePage(): ITitrePage {
        return this._iTitrePage ? this._iTitrePage : { titre: this.pageDef.titre};
    }
    niveauTitre: number;
    protected créeBarreTitre: () => BarreTitre;

    protected superGroupe: KfSuperGroupe;

    get avecValeur(): boolean {
        return !!this.superGroupe.gereValeur;
    }
    get valeur(): any {
        return {
            statut: this.superGroupe.formGroup ? this.superGroupe.formGroup.status : 'indéfini',
            valeur: this.superGroupe.gereValeur.valeur,
        };
    }
    créeTitrePage() {
        const iTitrePage: ITitrePage = {
            titre: this.titre,
            niveau: this.niveauTitre !== undefined ? this.niveauTitre : 1,
        };
        if (this.créeBarreTitre) {
            iTitrePage.complement = this.créeBarreTitre().barre;
        }
        this._iTitrePage = iTitrePage;
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
