import { Router, ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs';

import { AttenteAsyncService } from '../../services/attenteAsync.service';

import { FormulaireComponent } from '../../disposition/formulaire/formulaire.component';
import { DataKeyService } from './data-key.service';
import { ApiResult } from '../api-results/api-result';
import { DataTexteSoumettre, IDataPages } from './data-pages';
import { KfGroupe } from '../kf-composants/kf-groupe/kf-groupe';
import { DataKey } from './data-key';
import { DataKeyEditeur } from './data-key-editeur';
import { ApiAction } from '../api-route';
import { KfLien } from '../kf-composants/kf-elements/kf-lien/kf-lien';
import { ISiteRoutes } from 'src/app/site/site-pages';
import { Site } from 'src/app/modeles/site';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfTexteDef } from '../kf-composants/kf-partages/kf-texte-def';

export abstract class DataKeyALESComponent<T extends DataKey> extends FormulaireComponent {

    get action(): string {
        return this.pageDef.urlSegment;
    }

    abstract dataPages: IDataPages;
    abstract dataRoutes: ISiteRoutes;
    abstract site: Site;
    get nomSiteDef(): KfTexteDef {
        return () => this.site.nomSite;
    }

    protected chargeData: (data: Data) => void;

    dataEditeur: DataKeyEditeur<T>;
    abstract créeDataEditeur(): void;

    créeBoutonsDeFormulaire = () => [this.créeBoutonSoumettre(DataTexteSoumettre(this.action))];

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: DataKeyService<T>,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(service, attenteAsyncService);
    }

    créeEdition = (): KfGroupe => {
        this.créeDataEditeur();
        this.dataEditeur.créeEdition(this.action);
        this.lienRetour = Fabrique.lienBouton(this.dataPages.index, this.dataRoutes, this.nomSiteDef);
        this.lienRetour.fixeTexte('Retour à la liste');
        return this.dataEditeur.edition;
    }

    private prépareKeyAjout() {
        const key = this.service.keyDeAjoute;
        this.dataEditeur.fixeChampsKeys(key);
    }
    protected chargeValeur(data: Data) {
        this.valeur = data.valeur;
    }

    public ngOnInit_Charge() {
        this.subscriptions.push(this.route.data.subscribe(
            (data: Data) => {
                if (this.chargeData) {
                    this.chargeData(data);
                }
                if (this.action === ApiAction.data.ajoute) {
                    this.prépareKeyAjout();
                } else {
                    this.chargeValeur(data);
                }
            }
        ));
    }

    soumission = (): Observable<ApiResult> => {
        switch (this.action) {
            case ApiAction.data.ajoute:
                return this.service.ajoute(this.valeur);
            case ApiAction.data.edite:
                return this.service.edite(this.valeur);
            case ApiAction.data.supprime:
                return this.service.supprime(this.valeur);
            default:
                break;
        }
    }

    actionSiOk = (): void => {
        this.router.navigate([this.lienRetour.url]);
    }

    get valeur(): any {
        return this.dataEditeur.valeur;
    }

    set valeur(valeur: any) {
        this.dataEditeur.valeur = valeur;
    }
}
