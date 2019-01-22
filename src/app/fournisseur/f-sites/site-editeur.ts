import { KeyUidRnoEditeur } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-editeur';
import { Site } from 'src/app/modeles/site';
import { EtapeDeFormulaireEditeur } from 'src/app/disposition/formulaire/etape-de-formulaire';
import { SiteService } from 'src/app/modeles/site.service';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-texte';
import { ApiAction } from 'src/app/commun/api-route';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';

export class SiteEditeur extends KeyUidRnoEditeur<Site> implements EtapeDeFormulaireEditeur {
    private _créeComposants(action: string): KfComposant[] {
        const nomSite = new KfTexte('nomSite', 'Nom');
        const titre = new KfTexte('titre', 'Titre');
        if (action === ApiAction.data.supprime) {
            nomSite.lectureSeule = true;
            titre.lectureSeule = true;
            return [nomSite, titre];
        } else {
            const aideNomSite = new KfEtiquette('aideNomSite', `Le nom de site est utilisé dans l'adresse internet de vos pages.`);
            nomSite.AjouteValidateur(KfValidateurs.required);
            nomSite.AjouteValidateur(KfValidateurs.longueurMax(50));
            const texteAutorisés = `Seuls les 26 lettres minuscules, les 9 chiffres et '-' et '_' sont autorisés.`;
            const autorisés = KfValidateurs.chiffres.concat(KfValidateurs.minuscules).concat('-_');
            nomSite.AjouteValidateur(KfValidateurs.validateurDeFn(
                'carInterdit',
                (value: any) => KfValidateurs.contientUnHorsDe(value, autorisés),
                texteAutorisés
            ));
            nomSite.AjouteValidateur(KfValidateurs.validateurDoublon('nomSitePris', 'Ce nom est déjà pris'));
            nomSite.texteRemplissage = 'ex: magasin_kalosfide ou le-magasin-de-kalosfide';
            nomSite.texteAide = new KfEtiquette('aideNomSite',
                `Ce nom doit uniquement contenir des lettres minuscules non accentuées, des chiffres et '-' et '_'.`);
            titre.AjouteValidateur(KfValidateurs.required);
            titre.AjouteValidateur(KfValidateurs.longueurMax(200));
            titre.AjouteValidateur(KfValidateurs.validateurDoublon('titrePris', 'Ce titre est déjà pris'));
            titre.texteRemplissage = 'ex: Le magasin de Kalosfide';
            return [aideNomSite, nomSite, titre];
        }
    }
    créeAutresChamps(action: string) {
        this.keyAuto = true;
        this._créeComposants(action).forEach(composant => {
            this.ajoute(composant);
        });
    }

    créeContenus(): KfComposant[] {
        return this._créeComposants(ApiAction.data.ajoute);
    }
}
