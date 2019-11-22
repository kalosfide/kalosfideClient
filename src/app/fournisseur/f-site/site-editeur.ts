import { KeyUidRnoEditeur } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-editeur';
import { Site } from 'src/app/modeles/site';
import { EtapeDeFormulaireEditeur } from 'src/app/disposition/formulaire/etape-de-formulaire';
import { SiteService } from 'src/app/modeles/site.service';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { ApiAction } from 'src/app/commun/api-route';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { SiteALESComponent } from './site-ales.component';

export class SiteEditeur extends KeyUidRnoEditeur<Site> implements EtapeDeFormulaireEditeur {
    private _créeComposants(component?: SiteALESComponent): KfComposant[] {
        const nomSite = Fabrique.input.texte('nomSite', 'Nom');
        const titre = Fabrique.input.texte('titre', 'Titre');
        if (component && component.action.nom === ApiAction.data.supprime) {
            nomSite.lectureSeule = true;
            titre.lectureSeule = true;
            return [nomSite, titre];
        } else {
            const aideNomSite = new KfEtiquette('aideNomSite', `Le nom de site est utilisé dans l'adresse internet de vos pages.`);
            nomSite.ajouteValidateur(KfValidateurs.required);
            nomSite.ajouteValidateur(KfValidateurs.longueurMax(50));
            const texteAutorisés = `Seuls les 26 lettres minuscules, les 9 chiffres et '-' et '_' sont autorisés.`;
            const autorisés = KfValidateurs.chiffres.concat(KfValidateurs.minuscules).concat('-_');
            nomSite.ajouteValidateur(KfValidateurs.validateurDeFn(
                'carInterdit',
                (value: any) => KfValidateurs.contientUnHorsDe(value, autorisés),
                texteAutorisés
            ));
            nomSite.ajouteValidateur(KfValidateurs.validateurDoublon('nomSitePris', 'Ce nom est déjà pris'));
            nomSite.placeholder = 'ex: magasin_kalosfide ou le-magasin-de-kalosfide';
            nomSite.texteAide = Fabrique.texteAide(nomSite.nom,
                `Ce nom doit uniquement contenir des lettres minuscules non accentuées, des chiffres et '-' et '_'.`);
            titre.ajouteValidateur(KfValidateurs.required);
            titre.ajouteValidateur(KfValidateurs.longueurMax(200));
            titre.ajouteValidateur(KfValidateurs.validateurDoublon('titrePris', 'Ce titre est déjà pris'));
            titre.placeholder = 'ex: Le magasin de Kalosfide';
            return [aideNomSite, nomSite, titre];
        }
    }
    créeAutresChamps(component: SiteALESComponent) {
        this.keyAuto = true;
        this._créeComposants(component).forEach(composant => {
            this.ajoute(composant);
        });
    }

    créeContenus(): KfComposant[] {
        return this._créeComposants();
    }
}
