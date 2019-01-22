import { PageTableComponent } from '../../disposition/page-table/page-table.component';
import { KfLien } from '../kf-composants/kf-elements/kf-lien/kf-lien';
import { IDataPages } from './data-pages';
import { DataKeyService } from './data-key.service';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { DataKey } from './data-key';
import { KfSuperGroupe } from '../kf-composants/kf-groupe/kf-super-groupe';
import { KfVueTable } from '../kf-composants/kf-vue-table/kf-vue-table';

export abstract class DataKeyIndexComponent<T extends DataKey> extends PageTableComponent<T>  {

    abstract appRouteDeKey: (key: T) => string;
    abstract dataPages: IDataPages;

    protected chargeData: (data: Data) => void;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: DataKeyService<T>,
    ) {
        super();
    }

    public ngOnInit_Charge() {
        this.vueTable = new KfVueTable(this.nom + '_table', this.vueTableDef);
        this.subscriptions.push(this.route.data.subscribe(
            (data: Data) => {
                this.liste = data.liste;
                this.vueTable.initialise(this.liste);
                if (this.chargeData) {
                    this.chargeData(data);
                }
                this.superGroupe = new KfSuperGroupe(this.nom);
                this.prépareSuperGroupe();
                this.superGroupe.quandTousAjoutés();
            }
        ));
    }

    créeLien(action: string, texte: string, ligne?: T): KfLien {
        let nom = action;
        let url = '../' + action;
        if (ligne) {
            const appRouteDeKey = this.appRouteDeKey(ligne);
            nom += appRouteDeKey;
            url += '/' + appRouteDeKey;
        }
        const lien = new KfLien(nom, url, texte);
        return lien;
    }

    créeLienAjoute(): KfLien {
        const lien = this.créeLien(this.dataPages.ajoute.urlSegment, this.dataPages.ajoute.lien);
        lien.ajouteClasseDef('nav-link');
        return lien;
    }

    créeLienEdite(ligne: T): KfLien {
        return this.créeLien(this.dataPages.edite.urlSegment, this.dataPages.edite.lien, ligne);
    }

    créeLienSupprime(ligne: T): KfLien {
        return this.créeLien(this.dataPages.supprime.urlSegment, this.dataPages.supprime.lien, ligne);
    }
}
