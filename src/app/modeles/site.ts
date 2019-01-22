import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfTexte } from '../commun/kf-composants/kf-elements/kf-input/kf-texte';
import { KfValidateurs } from '../commun/kf-composants/kf-partages/kf-validateur';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';

export class Site extends KeyUidRno {
    nomSite: string;
    titre: string;
    etat: string;
    dateEtat: Date;

    get ouvert(): boolean {
        const e = this.dateEtat.valueOf();
        const n = Date.now();
        return this.etat === 'A' && e <= n;
    }

    static créeChamps(): KfComposant[] {
        const champs: KfComposant[] = [];
        const nomSite = new KfTexte('nomSite');
        nomSite.AjouteValidateur(KfValidateurs.required);
        champs.push(nomSite);
        const titre = new KfTexte('titre');
        titre.AjouteValidateur(KfValidateurs.required);
        champs.push(titre);
        return champs;
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
