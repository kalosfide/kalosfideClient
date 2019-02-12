import { PageTableComponent } from '../../disposition/page-table/page-table.component';
import { KfLien } from '../kf-composants/kf-elements/kf-lien/kf-lien';
import { IDataPages } from './data-pages';
import { DataKeyService } from './data-key.service';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { DataKey } from './data-key';
import { KfSuperGroupe } from '../kf-composants/kf-groupe/kf-super-groupe';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ISiteRoutes } from 'src/app/site/site-pages';
import { Site } from 'src/app/modeles/site';
import { KfTexteDef, ValeurTexteDef } from '../kf-composants/kf-partages/kf-texte-def';
import { PageDef } from '../page-def';

export abstract class DataKeyIndexComponent<T extends DataKey> extends PageTableComponent<T>  {

    abstract appRouteDeKey: (key: T) => string;
    abstract dataPages: IDataPages;
    abstract dataRoutes: ISiteRoutes;
    abstract site: Site;
    get nomSiteDef(): KfTexteDef {
        return () => this.site.nomSite;
    }

    protected chargeData: (data: Data) => void;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: DataKeyService<T>,
    ) {
        super();
    }

    public ngOnInit_Charge() {
        this.vueTable = Fabrique.vueTable(this.nom, this.vueTableDef);
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

    créeLienAjoute(): KfLien {
        const lien = Fabrique.lienBouton(this.dataPages.ajoute, this.dataRoutes, this.nomSiteDef);
        lien.ajouteClasseDef('nav-link');
        return lien;
    }

    protected créeLien(pageDef: PageDef, ligne: T): KfLien {
        const lien = Fabrique.lienBouton(pageDef, this.dataRoutes, this.nomSiteDef);
        lien.fixeRoute(() => ValeurTexteDef(Fabrique.url(pageDef, this.dataRoutes, this.nomSiteDef)) + '/' + this.appRouteDeKey(ligne));
        return lien;
    }

    créeLienEdite(ligne: T): KfLien {
        return this.créeLien(this.dataPages.edite, ligne);
    }

    créeLienSupprime(ligne: T): KfLien {
        return this.créeLien(this.dataPages.supprime, ligne);
    }
}
