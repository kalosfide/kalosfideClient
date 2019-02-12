import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfInputTexte } from '../commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfValidateurs } from '../commun/kf-composants/kf-partages/kf-validateur';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';

export interface EtatSite {
    etat: string;
    dateEtat: Date;
}
export class Site extends KeyUidRno implements EtatSite {
    nomSite: string;
    titre: string;
    etat: string;
    dateEtat: Date;

    static testOuvert(etatSite: EtatSite): boolean {
        return etatSite.etat === 'A' && etatSite.dateEtat.valueOf() <= Date.now();
    }

    static créeChamps(): KfComposant[] {
        const champs: KfComposant[] = [];
        const nomSite = new KfInputTexte('nomSite');
        nomSite.ajouteValidateur(KfValidateurs.required);
        champs.push(nomSite);
        const titre = new KfInputTexte('titre');
        titre.ajouteValidateur(KfValidateurs.required);
        champs.push(titre);
        return champs;
    }

    get ouvert(): boolean {
        return Site.testOuvert(this);
    }

    copie(site: Site) {
        this.uid = site.uid;
        this.rno = site.rno;
        this.nomSite = site.nomSite;
        this.titre = site.titre;
        this.etat = site.etat;
        this.dateEtat = new Date(site.dateEtat);
    }
}
