import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { SoumissionDef } from 'src/app/disposition/formulaire/i-formulaire';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseDEtiquette } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfRadios } from 'src/app/commun/kf-composants/kf-elements/kf-radios/kf-radios';
import { FournisseurPages, FournisseurRoutes } from '../fournisseur-pages';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { FormulaireFabrique } from 'src/app/disposition/formulaire/formulaire-fabrique';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { Site } from 'src/app/modeles/site';
import { SiteService } from 'src/app/modeles/site.service';

export class EnTeteOuvertDef extends SoumissionDef {

    constructor() {
        super();
        this.nom = 'enTete';
        this.créeEdition = (): KfGroupe => {
            const groupe = new KfGroupe('enTete');
            let etiquette = new KfEtiquette('',
                `Le site est ouvert.`);
            etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.P;
            etiquette.ajouteClasseDef('');
            groupe.ajoute(etiquette);
            etiquette = new KfEtiquette('',
                `Votre page Produits est accessible et vos clients peuvent passer commande.`);
            etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.P;
            etiquette.ajouteClasseDef('');
            groupe.ajoute(etiquette);
            etiquette = new KfEtiquette('',
                `Vous ne pouvez pas modifier vos produits ni fixer les prix.`);
            etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.P;
            etiquette.ajouteClasseDef('');
            groupe.ajoute(etiquette);
            groupe.ajouteClasseDef('alert', 'alert-info');
            return groupe;
        };
    }
}

export class ArrêterCommandesDef extends SoumissionDef {
    lien: KfLien;
    private _etiquette: KfEtiquette;

    constructor() {
        super();
        this.nom = '';
        this.créeEdition = (): KfGroupe => {
            const groupe = new KfGroupe('commandes');
            const etiquette = new KfEtiquette('');
            etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.P;
            etiquette.ajouteClasseDef('');
            groupe.ajoute(etiquette);
            this._etiquette = etiquette;
            this.lien = new KfLien('commandes', '', FournisseurPages.commandes.lien);
            this.lien.ajouteClasseDef('nav', 'nav-link');
            groupe.ajoute(this.lien);
            groupe.ajouteClasseDef('alert', 'alert-warning');
            return groupe;
        };
    }

    fixeTexte(nb: number) {
        let bons = ' un bon';
        let ouvert = ' ouvert';
        let cloture = ' le cloturera.';
        if (nb > 1) {
            bons = ' ' + nb + ' bons';
            ouvert += 's';
            cloture = ' les cloturera tous.';
        }
        this._etiquette.fixeTexte('Il y a' + bons + ' de commande' + ouvert + ' en attente d\'enregistrement. Fermer le site'
            + cloture + ' Pour les vérifier au préalable, cliquez sur ' + FournisseurPages.commandes.lien);
    }
}

export class FermerDef extends SoumissionDef {
    private _radios: KfRadios;

    constructor() {
        super();
        this.nom = 'ferme';
        this.créeEdition = (): KfGroupe => {
            const edition = new KfGroupe('edition');
            edition.créeGereValeur();
            let etiquette = new KfEtiquette('',
                `Fermeture du site`);
            etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.h6;
            etiquette.ajouteClasseDef('');
            edition.ajoute(etiquette);
            const groupe = new KfGroupe('fermer');
            etiquette = new KfEtiquette('',
                `Vous pouvez choisir de programmer la réouverture automatique quand vous fermez le site.`);
            etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.P;
            etiquette.ajouteClasseDef('');
            groupe.ajoute(etiquette);
            const radios = new KfRadios('fermer');
            radios.AjouteChoix('h1', '1', 'Programmer la réouverture 1 heure plus tard');
            radios.AjouteChoix('h2', '2', 'Programmer la réouverture 2 heures plus tard');
            radios.AjouteChoix('h0', '0', 'Ne pas programmer de réouverture');
            radios.valeur = '1';
            groupe.ajoute(radios);
            edition.ajoute(groupe);
            return edition;
        };
        this.créeBoutonsDeFormulaire = (formulaire: KfSuperGroupe): KfBouton[] => {
            return [FormulaireFabrique.CréeBoutonSoumettre(formulaire, 'Fermer le site')];
        };
    }

    get dateRéouverture(): Date {
        const maintenant = new Date();
        const h1 = 60 * 60 * 1000;
        switch (this._radios.abstractControl.value) {
            case '0':
                return new Date(maintenant.getTime() - h1);
            case '1':
                return new Date(maintenant.getTime() + h1);
            case '2':
                return new Date(maintenant.getTime() + 2 * h1);
        }
    }

}

export class EnTeteFerméDef extends SoumissionDef {
    private _etiquette: KfEtiquette;
    private _groupe: KfGroupe;

    constructor() {
        super();
        this.nom = 'enTete';
        this.créeEdition = (): KfGroupe => {
            const groupe = new KfGroupe('enTete');
            let etiquette = new KfEtiquette('', `Le site est fermé.`);
            etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.P;
            groupe.ajoute(etiquette);
            etiquette = new KfEtiquette('', `Votre page Produits est inaccessible et vos clients ne peuvent pas passer commande.`);
            etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.P;
            groupe.ajoute(etiquette);
            this._etiquette = new KfEtiquette('');
            this._etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.P;
            groupe.ajouteClasseDef('alert');
            this._groupe = groupe;
            return groupe;
        };
    }

    fixeDate(dateRéouverture: Date) {
        if (dateRéouverture) {
            this._etiquette.fixeTexte('La réouverture automatique aura lieu le '
                + dateRéouverture.toLocaleDateString('fr-FR')
                + ' à ' + dateRéouverture.toLocaleTimeString('fr-FR')
            );
            this._groupe.supprimeClasseDef('alert-danger');
            this._groupe.ajouteClasseDef('alert-warning');
        } else {
            this._etiquette.fixeTexte('Il n\'a pas de réouverture automatique prévue.');
            this._groupe.ajouteClasseDef('alert-danger');
            this._groupe.supprimeClasseDef('alert-warning');
        }
    }
}

export class AllerAuxProduitsDef extends SoumissionDef {
    lien: KfLien;

    constructor() {
        super();
        this.nom = 'produits';
        this.créeEdition = (): KfGroupe => {
            const groupe = new KfGroupe('');
            let etiquette = new KfEtiquette('', `Vous pouvez modifier vos produits et fixer les prix.`);
            etiquette = new KfEtiquette('', `Le site est fermé.`);
            etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.P;
            etiquette.ajouteClasseDef('');
            groupe.ajoute(etiquette);
            this.lien = new KfLien('produits', '', FournisseurPages.produits.lien);
            groupe.ajoute(this.lien);
            return groupe;
        };
    }
}

export class ProlongeDef extends SoumissionDef {

    constructor() {
        super();
        this.nom = 'prolonge';
        this.créeEdition = (): KfGroupe => {
            const edition = new KfGroupe('edition');
            const etiquette = new KfEtiquette('',
                `Réouverture programmée`);
            etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.h6;
            etiquette.ajouteClasseDef('');
            edition.ajoute(etiquette);
            const radios = new KfRadios('fermer');
            radios.AjouteChoix('h1', '1', 'Programmer la réouverture dans 1 heure');
            radios.AjouteChoix('h2', '2', 'Programmer la réouverture dans 2 heures');
            radios.AjouteChoix('h0', '0', 'Ne pas programmer de réouverture');
            edition.ajoute(radios);
            return edition;
        };
        this.créeBoutonsDeFormulaire = (formulaire: KfSuperGroupe): KfBouton[] => {
            return [FormulaireFabrique.CréeBoutonSoumettre(formulaire, 'Prolonger la fermeture')];
        };
    }
}

export class OuvreDef extends SoumissionDef {

    constructor() {
        super();
        this.nom = 'ouvre';
        this.créeEdition = (): KfGroupe => {
            const edition = new KfGroupe('edition');
            const etiquette = new KfEtiquette('',
                `Réouverture immédiate`);
            etiquette.baliseHTML = KfTypeDeBaliseDEtiquette.h6;
            etiquette.ajouteClasseDef('');
            edition.ajoute(etiquette);
            return edition;
        };
        this.créeBoutonsDeFormulaire = (formulaire: KfSuperGroupe): KfBouton[] => {
            return [FormulaireFabrique.CréeBoutonSoumettre(formulaire, 'Ouvrir le site')];
        };
    }
}
