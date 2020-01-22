import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientALESComponent } from './client-ales.component';
import { PageDef } from 'src/app/commun/page-def';
import { ClientPages, ClientRoutes } from './client-pages';
import { ClientService } from 'src/app/modeles/client/client.service';
import { EtatClient } from 'src/app/modeles/client/etat-client';
import { GroupeBoutonsMessages } from 'src/app/disposition/fabrique/fabrique-formulaire';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styleUrls: ['../../commun/commun.scss']
})
export class ClientExclutComponent extends ClientALESComponent {

    static _pageDef: PageDef = ClientPages.exclut;
    pageDef: PageDef = ClientPages.exclut;

    get titre(): string {
        return this.pageDef.titre;
    }

    groupeBoutonsMessages: GroupeBoutonsMessages;

    constructor(
        protected route: ActivatedRoute,
        protected _service: ClientService,
    ) {
        super(route, _service);

        this.titreRésultatErreur = 'Mise à jour impossible';

        this.action = {
            nom: this.pageDef.urlSegment,
            texteSoumettre: 'Exclure le client',
            apiDemande: () => this._service.changeEtat(this.client, EtatClient.exclu),
            actionSiOk: () => this._service.quandEtatChange(this.client)
        };

        const messages: KfComposant[] = [];
        Fabrique.ajouteEtiquetteP(messages);
        Fabrique.ajouteEtiquetteP(messages);
        this.groupeBoutonsMessages = new GroupeBoutonsMessages('', messages);
    }

    private _message(i: number): KfEtiquette {
        return (this.groupeBoutonsMessages.messages[i]) as KfEtiquette;
    }

    fixeGroupeBoutonsMessages = () => {
        if (this.client.avecCommandes) {
            this.groupeBoutonsMessages.alerte('warning');
            this._message(0).fixeTexte(
                `Exclure un client le fait passer à l'état 'inactif' pour une période de 30 jours `
                + `pendant laquelle il conserve le droit de consulter et télécharger ses documents et peut être réactivé.`
            );
            this._message(1).fixeTexte(
                `A l'issue de cette période, ses données seront conservées mais rendues anonymes et il passera à l'état exclu.`
            );
        } else {
            this.groupeBoutonsMessages.alerte('danger');
            this._message(0).fixeTexte(
                `Les données de ce client vont être supprimées. `,
            );
            this._message(1).fixeTexte(
                `Cette action ne pourra pas être annulée.`,
            );
        }

    }

}
