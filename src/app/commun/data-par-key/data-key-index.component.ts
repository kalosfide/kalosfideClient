import { PageTableComponent } from '../../disposition/page-table/page-table.component';
import { DataKeyService } from './data-key.service';
import { ActivatedRoute } from '@angular/router';
import { IDataKey } from './data-key';
import { Site } from 'src/app/modeles/site/site';
import { KfTexteDef } from '../kf-composants/kf-partages/kf-texte-def';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { BarreTitre, IBarreDef } from 'src/app/disposition/fabrique/fabrique-barre-titre/fabrique-barre-titre';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfComposant } from '../kf-composants/kf-composant/kf-composant';

export abstract class DataKeyIndexComponent<T extends IDataKey> extends PageTableComponent<T>  {

    abstract site: Site;
    get nomSiteDef(): KfTexteDef {
        return () => this.site.nomSite;
    }
    protected contenuAidePage: () => KfComposant[];

    constructor(
        protected route: ActivatedRoute,
        protected _service: DataKeyService<T>,
    ) {
        super(route, _service);
    }

    protected get _barreTitreDef(): IBarreDef {
        const def: IBarreDef = {
            pageDef: this.pageDef,
        };
        if (this.contenuAidePage) {
            def.contenuAidePage = this.contenuAidePage();
        }
        return def;
    }
    protected get barreTitreDef(): IBarreDef {
        return this._barreTitreDef;
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.barreTitre.barreTitre(this.barreTitreDef);
        return barre;
    }

    protected lienDefAjoute(): ILienDef {
        return { url: this._service.utile.urlKey.ajoute() };
    }
}
