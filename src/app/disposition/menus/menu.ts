import { ItemDeMenu } from './item-de-menu';
import { Site } from 'src/app/modeles/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { AppSite } from 'src/app/app-site/app-site';
import { AppRoutes } from 'src/app/app-pages';
import { ItemCompte } from 'src/app/compte/menu/item-compte';
import { TypeItemDeMenu } from './type-item-de-menu';
import { KfImageDef } from 'src/app/commun/kf-composants/kf-partages/kf-image-def';

export abstract class Menu {
    site: Site;
    identifiant: Identifiant;

    marqueImage: ItemDeMenu;
    marqueTexte: ItemDeMenu;

    itemsAction: ItemDeMenu[];

    compte: ItemDeMenu;

    protected abstract créeMarqueTexte(): ItemDeMenu;
    protected abstract créeItemsAction(): ItemDeMenu[];

    get menu(): Menu {
        return this;
    }

    protected créeMarqueImage(): ItemDeMenu {
        const i = new ItemDeMenu('imageMarque', this, TypeItemDeMenu.item);
        const urlImage = this.site ? AppSite.imageInactif : AppSite.imageActif;
        const imageDef: KfImageDef = {
            urlDef: AppRoutes.urlImage(urlImage),
            largeurDef: AppSite.côtéImage,
            hauteurDef: AppSite.côtéImage
        };
        i.image = imageDef;
        i.url = AppRoutes.url();
        i.navBarBrand = true;
        return i;
    }

    protected créeItemCompte(): ItemDeMenu {
        return new ItemCompte(this);
    }

    créeItems() {
        this.marqueImage = this.créeMarqueImage();
        this.marqueTexte = this.créeMarqueTexte();
        this.itemsAction = this.créeItemsAction();
        this.compte = this.créeItemCompte();
    }

    public rafraichit() {
        this.marqueImage.quandChange();
        this.marqueTexte.quandChange();
        this.itemsAction.forEach(i => i.quandChange());
        this.compte.quandChange();
    }

}
