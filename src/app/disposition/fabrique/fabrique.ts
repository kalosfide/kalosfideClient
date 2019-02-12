import { KfVueTableDef, KfVueTable } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';
import { PageDef } from 'src/app/commun/page-def';
import { ISiteRoutes } from 'src/app/site/site-pages';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { AppRoutes } from 'src/app/app-pages';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfIcone } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfTexteDef, ValeurTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';

const ICONE_OUVERT = faAngleDown;
const ICONE_FERME = faAngleUp;

export interface IMessageMasquable {
    groupe: KfGroupe;
    masquable: KfGroupe;
}

class FabriqueClasse {

    // KfVueTable
    vueTable<T>(nom: string, vueTableDef: KfVueTableDef<T>): KfVueTable<T> {
        vueTableDef.classesCellules = (item: T) => ['align-middle'];
        const vueTable = new KfVueTable(nom + '_table', vueTableDef);
        vueTable.ajouteClasseDef('table-sm');
        vueTable.ajouteClasseEntete('thead-light');
        return vueTable;
    }

    // liens
    url(pageDef: PageDef, routes: ISiteRoutes, nomSite?: KfTexteDef): KfTexteDef {
        return nomSite
            ? () => routes.url(ValeurTexteDef(nomSite), [pageDef.urlSegment])
            : () => AppRoutes.url([pageDef.urlSegment]);
    }
    lien(pageDef: PageDef, routes?: ISiteRoutes, nomSite?: KfTexteDef): KfLien {
        const lien = new KfLien(pageDef.urlSegment, this.url(pageDef, routes, nomSite));
        lien.fixeTexte(pageDef.lien);
        return lien;
    }
    lienEnLigne(pageDef: PageDef, routes?: ISiteRoutes, nomSite?: KfTexteDef): KfLien {
        const lien = this.lien(pageDef, routes, nomSite);
        return lien;
    }
    lienBouton(pageDef: PageDef, routes?: ISiteRoutes, nomSite?: KfTexteDef): KfLien {
        const lien = this.lien(pageDef, routes, nomSite);
        return lien;
    }

    messageMasquable(nom: string, titre: KfEtiquette): IMessageMasquable {
        const groupe = new KfGroupe(nom);
        const enTete = new KfGroupe(nom + '_enTete');
        const masquable = new KfGroupe(nom + '_masquable');
        masquable.masquable(false);

        enTete.ajoute(titre);
        const bouton = new KfBouton(nom + '_bouton');
        const icone = new KfIcone(nom + '_icone', () => masquable.masque ? ICONE_OUVERT : ICONE_FERME);
        bouton.contenuPhrase.ajoute(icone);
        bouton.ajouteClasseDef('close');
        bouton.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic,
            (evenement: KfEvenement) => {
                masquable.basculeMasque();
                evenement.statut = KfStatutDEvenement.fini;
            });
        enTete.ajoute(bouton);

        groupe.ajoute(enTete);
        groupe.ajoute(masquable);

        return {
            groupe: groupe,
            masquable: masquable
        };

    }

    get nomMessageSiteOuvert(): string {
        return 'messageSiteOuvert';
    }
    messageSiteOuvert(): IMessageMasquable {
        let etiquette = new KfEtiquette(this.nomMessageSiteOuvert + '_titre');
        let texte = new KfTexte('',
            `Le site est ouvert.`);
        texte.balisesAAjouter = [KfTypeDeBaliseHTML.strong];
        etiquette.contenuPhrase.ajoute(texte);

        const message = this.messageMasquable(this.nomMessageSiteOuvert, etiquette);

        etiquette = new KfEtiquette('');
        texte = new KfTexte('',
            `Votre page Produits est accessible aux visiteurs et vos clients peuvent passer commande.`);
        texte.suiviDeSaut = true;
        etiquette.contenuPhrase.ajoute(texte);
        texte = new KfTexte('',
            `Vous ne pouvez pas modifier vos produits ni fixer les prix.`);
        etiquette.contenuPhrase.ajoute(texte);
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        message.masquable.ajoute(etiquette);

        message.groupe.ajouteClasseDef('alert', 'alert-info');
        return message;

    }

}

export const Fabrique = new FabriqueClasse();
