import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfValidateurs } from '../commun/kf-composants/kf-partages/kf-validateur';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { IdEtatSite } from './etat-site';

export class Site extends KeyUidRno {
    nomSite: string;
    titre: string;
    nbProduits?: number;
    nbClients?: number;
    etat: IdEtatSite;

    constructor(site?: Site) {
        super();
        if (site) {
            this.copie(site);
        }
    }

    static créeChamps(): KfComposant[] {
        const champs: KfComposant[] = [];
        const nomSite = Fabrique.input.texte('nomSite');
        nomSite.ajouteValidateur(KfValidateurs.required);
        champs.push(nomSite);
        const titre = Fabrique.input.texte('titre');
        titre.ajouteValidateur(KfValidateurs.required);
        champs.push(titre);
        return champs;
    }

    static compare(site1: Site, site2: Site): boolean {
        if (!site1) {
            return !site2;
        }
        if (!site2) {
            return false;
        }
        return site1.uid === site2.uid
        && site1.rno === site2.rno
        && site1.nomSite === site2.nomSite
        && site1.titre === site2.titre
        && site1.nbProduits === site2.nbProduits
        && site1.nbClients === site2.nbClients
        && site1.etat === site2.etat;
    }

    get ouvert(): boolean {
        return this.etat === IdEtatSite.ouvert;
    }

    copie(site: Site) {
        this.uid = site.uid;
        this.rno = site.rno;
        this.nomSite = site.nomSite;
        this.titre = site.titre;
        this.nbProduits = site.nbProduits;
        this.nbClients = site.nbClients;
        this.etat = site.etat;
    }
    copieEtat(site: Site) {
        this.etat = site.etat;
    }

    copieNbs(site: Site) {
        this.nbProduits = site.nbProduits;
        this.nbClients = site.nbClients;
    }
}
