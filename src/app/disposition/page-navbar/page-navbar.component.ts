

import { NavigationService } from 'src/app/services/navigation.service';
import { IdentificationService } from 'src/app/securite/identification.service';
import { AppSite } from 'src/app/app-site/app-site';
import { Identifiant } from 'src/app/securite/identifiant';
import { PageBaseComponent } from '../page-base/page-base.component';
import { NavBar } from '../navbars/navbar';

export abstract class PageNavbarComponent extends PageBaseComponent {

    barre: NavBar;
    abstract créeBarre(): NavBar;

    constructor(
        protected identification: IdentificationService,
        protected navigation: NavigationService,
    ) {
        super();
    }

    protected _ngOnInit() {

        this.subscriptions.push(
            this.navigation.changementDePageDef().subscribe(() => this.pageDefChange())
        );

        this.barre = this.créeBarre();
        this.barre.identifiant = this.identification.litIdentifiant();
    }

    protected utilisateurChange() {
        const identifiant: Identifiant = this.identification.litIdentifiant();
        this.barre.identifiant = identifiant;
        this.barre.rafraichit();
    }

    private pageDefChange() {
        let title = this.navigation.litSiteEnCours() ? this.navigation.litSiteEnCours().titre : AppSite.titre;
        for (let i = 0; i < this.navigation.pageDefs.length; i++) {
            title += ' - ' + this.navigation.pageDefs[i].title;
        }
    }

}
