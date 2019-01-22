import { ItemDeMenu } from './item-de-menu';
import { Identifiant } from '../securite/identifiant';
import { Site } from '../modeles/site';
import { ItemCompte } from '../compte/menu/item-compte';
import { KfImageDef } from '../commun/kf-composants/kf-partages/kf-image-def/kf-image-def';
import { AppSite } from '../app-site/app-site';
import { AppRoutes } from '../app-pages';

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
        const i = new ItemDeMenu('imageMarque', this);
        const urlImage = this.site ? AppSite.imageInactif : AppSite.imageActif;
        const imageDef = new KfImageDef(AppRoutes.urlImage(urlImage));
        imageDef.largeurDef = AppSite.côtéImage;
        imageDef.hauteurDef = AppSite.côtéImage;
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
