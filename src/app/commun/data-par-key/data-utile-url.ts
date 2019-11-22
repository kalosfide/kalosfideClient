import { DataUtile } from './data-utile';
import { ISiteRoutes, SiteRoutes } from 'src/app/site/site-pages';
import { PageDef } from '../page-def';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { ComptePages } from 'src/app/compte/compte-pages';

export class DataUtileUrl {
    protected _parent: DataUtile;

    constructor(dataUtile: DataUtile) {
        this._parent = dataUtile;
    }

    id(texteKey: string) {
        return 'kfvt' + texteKey;
    }

    __urlDef(routes: ISiteRoutes, pageDef?: PageDef, texteKey?: string, retour?: boolean): IUrlDef {
        const urlDef: IUrlDef = {
            pageDef: pageDef,
            routes: routes,
            nomSite: () => this._parent.site.nomSite,
        };
        if (texteKey) {
            if (retour) {
                urlDef.fragment = this.id(texteKey);
            } else {
                urlDef.keys = [texteKey];
            }
        }
        return urlDef;
    }

    déconnection(): IUrlDef {
        return this.__urlDef(SiteRoutes, ComptePages.deconnection);
    }

}
