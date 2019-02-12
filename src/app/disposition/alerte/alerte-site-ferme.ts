import { Alerte, TypeAlerte} from './alerte';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { FournisseurRoutes, FournisseurPages } from 'src/app/fournisseur/fournisseur-pages';
import { Site } from 'src/app/modeles/site';
import { Fabrique } from '../fabrique/fabrique';

export const ALERTE_SITE_FERME_ID = 'site-ferme';
export function AlerteSiteFerme(site: Site): Alerte {
    const alerte = new Alerte();
    alerte.id = ALERTE_SITE_FERME_ID;
    alerte.type = TypeAlerte.danger;
    alerte.fermable = false;
    alerte.contenu = new KfEtiquette('');
    let texte = new KfTexte('', 'Attention!');
    texte.balisesAAjouter = [KfTypeDeBaliseHTML.strong];
    alerte.contenu.contenuPhrase.ajoute(texte);
    texte = new KfTexte('', 'Votre site ');
    alerte.contenu.contenuPhrase.ajoute(texte);
    texte = new KfTexte('', site.titre);
    texte.balisesAAjouter = [KfTypeDeBaliseHTML.i];
    alerte.contenu.contenuPhrase.ajoute(texte);
    texte = new KfTexte('', 'est fermé. Vos clients ne peuvent pas commander.');
    alerte.contenu.contenuPhrase.ajoute(texte);
    const lien = Fabrique.lienEnLigne(FournisseurPages.site, FournisseurRoutes, site.nomSite);
    lien.fixeTexte('Ouverture');
    lien.style = {
        float: 'right'
    };
    alerte.contenu.contenuPhrase.ajoute(lien);
    return alerte;
}
