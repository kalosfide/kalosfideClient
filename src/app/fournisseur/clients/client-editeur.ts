import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { ClientEditeurBase, Client } from 'src/app/modeles/clientele/client';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { ClientPages } from './client-pages';
import { KfEntrée } from 'src/app/commun/kf-composants/kf-composant/kf-entree';
import { TexteEtatClient, EtatClient } from 'src/app/modeles/clientele/etat-client';
import { ClientALESComponent } from './client-ales.component';
import { BootstrapType, BootstrapNom } from 'src/app/disposition/fabrique/fabrique-bootstrap';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';

export class ClientEditeur extends ClientEditeurBase {
    action: string;
    texteEtat: KfInputTexte;
    grMessage: KfGroupe;

    private ajouteMessage(champs: KfComposant[], bootstrapType: BootstrapType, ...textes: string[]) {
        this.grMessage = Fabrique.alerte('message', bootstrapType);
        let i = 1;
        textes.forEach(t => {
            const e = new KfEtiquette('aide' + i++, t);
            e.baliseHtml = KfTypeDeBaliseHTML.p;
            this.grMessage.ajoute(e);
        });
        champs.push(this.grMessage);
    }

    private _créeComposants(component: ClientALESComponent): KfComposant[] {
        const pageDef = component.pageDef;
        const champs: KfComposant[] = this.créeContenus();
        const etat = Fabrique.input.texte('etat', 'Etat');
        etat.visible = false;
        champs.push(etat);

        if (component.pageDef === ClientPages.ajoute) {
            this.nom.ajouteValidateur(KfValidateurs.validateurDeFn('nomPris',
                (value: any) => {
                    return component.service.nomPris(value);
                },
                'Ce nom est déjà pris'));
            etat.valeur = EtatClient.actif;
        } else {
            if (component.pageDef === ClientPages.edite) {
                this.nom.ajouteValidateur(KfValidateurs.validateurDeFn('nomPris',
                    (value: any) => {
                        return component.service.nomPrisParAutre(this._kfUid.valeur, this._kfRno.valeur, value);
                    },
                    'Ce nom est déjà pris'));
            }
        }

        if (pageDef === ClientPages.accepte || pageDef === ClientPages.exclut) {
            champs.forEach(c => (c as KfEntrée).lectureSeule = true);
        }

        if (pageDef === ClientPages.exclut) {
            this.texteEtat = Fabrique.input.texte('texteEtat', 'Etat');
            this.texteEtat.estRacineV = true;
            this.texteEtat.lectureSeule = true;
            champs.push(this.texteEtat);
        }
        return champs;
    }
    créeAutresChamps(component: ClientALESComponent) {
        this.keyAuto = true;
        this._créeComposants(component).forEach(composant => {
            this.ajoute(composant);
        });
    }
    fixeValeur(valeur: Client) {
        this.edition.fixeValeur(valeur);
        if (this.texteEtat) {
            this.texteEtat.valeur = TexteEtatClient(valeur.etat);
        }
    }

    rafraichit(component: ClientALESComponent): KfComposant[] {
        const pageDef = component.pageDef;
        const champs: KfComposant[] = this.créeContenus();
        const etat = Fabrique.input.texte('etat', 'Etat');
        etat.visible = false;
        champs.push(etat);

        if (component.pageDef === ClientPages.ajoute) {
            this.nom.ajouteValidateur(KfValidateurs.validateurDeFn('nomPris',
                (value: any) => {
                    return component.service.nomPris(value);
                },
                'Ce nom est déjà pris'));
            etat.valeur = EtatClient.actif;
        } else {
            if (component.pageDef === ClientPages.edite) {
                this.nom.ajouteValidateur(KfValidateurs.validateurDeFn('nomPris',
                    (value: any) => {
                        return component.service.nomPrisParAutre(this._kfUid.valeur, this._kfRno.valeur, value);
                    },
                    'Ce nom est déjà pris'));
            }
        }

        if (pageDef === ClientPages.accepte || pageDef === ClientPages.exclut) {
            champs.forEach(c => (c as KfEntrée).lectureSeule = true);
        }

        if (pageDef === ClientPages.exclut) {
            this.texteEtat = Fabrique.input.texte('texteEtat', 'Etat');
            this.texteEtat.estRacineV = true;
            this.texteEtat.lectureSeule = true;
            champs.push(this.texteEtat);
        }

        return champs;
    }
}
