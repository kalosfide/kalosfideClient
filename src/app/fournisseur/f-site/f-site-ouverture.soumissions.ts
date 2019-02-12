import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { SoumissionDef } from 'src/app/disposition/formulaire/i-formulaire';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfRadios } from 'src/app/commun/kf-composants/kf-elements/kf-radios/kf-radios';
import { FournisseurPages, FournisseurRoutes } from '../fournisseur-pages';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { FormulaireFabrique } from 'src/app/disposition/formulaire/formulaire-fabrique';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfRadio } from 'src/app/commun/kf-composants/kf-elements/kf-radios/kf-radio';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfInputDateTemps } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-date-temps';
import { Dateur } from 'src/app/commun/outils/dateur';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { KfTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { ProduitPages, ProduitRoutes } from '../produits/produit-pages';

export class EnTeteOuvertDef extends SoumissionDef {

    constructor() {
        super();
        this.nom = 'enTete';
        this.créeEdition = (): KfGroupe => {

            const message = Fabrique.messageSiteOuvert();
            return message.groupe;
        };
    }
}

export class EnTeteFerméDef extends SoumissionDef {
    private _texteRéouverture: KfTexte;
    private _groupe: KfGroupe;

    constructor(nomSiteDef: KfTexteDef) {
        super();
        this.nom = 'enTete';
        this.créeEdition = (): KfGroupe => {
            let etiquette = new KfEtiquette(this.nom + '_titre');
            let texte = new KfTexte('', `Le site est fermé.`);
            texte.balisesAAjouter = [KfTypeDeBaliseHTML.strong];
            etiquette.contenuPhrase.ajoute(texte);
            this._texteRéouverture = new KfTexte('', '');
            etiquette.contenuPhrase.ajoute(this._texteRéouverture);

            const message = Fabrique.messageMasquable(this.nom, etiquette);

            etiquette = new KfEtiquette('');
            texte = new KfTexte('',
                `Votre page Produits est inaccessible aux visiteurs et vos clients ne peuvent pas passer commande.`);
            texte.suiviDeSaut = true;
            etiquette.contenuPhrase.ajoute(texte);
            texte = new KfTexte('',
                `Vous pouvez`);
            etiquette.contenuPhrase.ajoute(texte);
            const lien = Fabrique.lienEnLigne(ProduitPages.index, ProduitRoutes, nomSiteDef);
            lien.fixeTexte('modifier vos produits et fixer les prix');
            lien.ajouteClasseDef('nav', 'nav-link');
            etiquette.contenuPhrase.ajoute(lien);
            texte = new KfTexte('',
                `.`);
            etiquette.contenuPhrase.ajoute(texte);
            etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
            message.masquable.ajoute(etiquette);

            this._groupe = message.groupe;
            this._groupe.ajouteClasseDef('alert');
            return this._groupe;
        };
    }

    fixeDate(dateRéouverture: Date) {
        if (dateRéouverture) {
            this._texteRéouverture.fixeTexte(`Réouverture automatique: ${Dateur.texteAujourdHuiDemainHMin(dateRéouverture)}`);
            this._groupe.supprimeClasseDef('alert-danger');
            this._groupe.ajouteClasseDef('alert-warning');
        } else {
            this._texteRéouverture.fixeTexte('Il n\'a pas de réouverture automatique prévue.');
            this._groupe.ajouteClasseDef('alert-danger');
            this._groupe.supprimeClasseDef('alert-warning');
        }
    }
}

export class ArrêterCommandesDef extends SoumissionDef {
    private _texteBons: KfTexte;

    constructor(nomSiteDef: KfTexteDef) {
        super();
        this.nom = 'commandes';
        this.créeEdition = (): KfGroupe => {
            let etiquette = new KfEtiquette(this.nom + '_titre');
            let texte = new KfTexte('', 'Commandes en attente');
            texte.balisesAAjouter = [KfTypeDeBaliseHTML.strong];
            etiquette.contenuPhrase.ajoute(texte);

            const message = Fabrique.messageMasquable(this.nom, etiquette);

            etiquette = new KfEtiquette('');
            texte = new KfTexte('', ``);
            this._texteBons = texte;
            etiquette.contenuPhrase.ajoute(texte);
            etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
            message.masquable.ajoute(etiquette);

            etiquette = new KfEtiquette('');
            texte = new KfTexte('',
                `Fermer le site arrêtera toutes les commandes en cours en les acceptant au tarif actuel.`);
            texte.suiviDeSaut = true;
            etiquette.contenuPhrase.ajoute(texte);
            texte = new KfTexte('',
                `Pour vérifier les commandes en cours avant de fermer le site, cliquez sur `);
            etiquette.contenuPhrase.ajoute(texte);
            const lien = Fabrique.lienEnLigne(FournisseurPages.commandes, FournisseurRoutes, nomSiteDef);
            lien.ajouteClasseDef('nav', 'nav-link');
            etiquette.contenuPhrase.ajoute(lien);
            etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
            message.masquable.ajoute(etiquette);

            message.groupe.ajouteClasseDef('alert', 'alert-warning');
            return message.groupe;
        };
    }

    fixeTitre(nb: number) {
        this._texteBons.fixeTexte(`Il y a ${nb > 1 ? '' + nb + ' bons' : 'un bon'} de commande en attente d'enregistrement`);
    }
}

class AvecChoixRéouverture extends SoumissionDef {
    private radios: KfRadios;
    private dateTemps: KfInputDateTemps;

    constructor(nom: string, titre: string, texteBouton: string) {
        super();
        this.nom = nom;
        this.créeEdition = (): KfGroupe => {
            const edition = new KfGroupe(nom + '_edition');
            edition.créeGereValeur();
            const etiquette = new KfEtiquette(nom + '_titre', titre);
            etiquette.ajouteClasseDef('');
            edition.ajoute(etiquette);

            const groupe = new KfGroupe('grReouverture');
            groupe.ajouteClasseDef('border p-2');
            groupe.legende = new KfEtiquette('legendeReouverture', `Réouverture programmée`);
            groupe.legende.ajouteClasseDef('kf-legende');

            this.radios = new KfRadios('typeReouverture');
            let radio = new KfRadio('h1', '1', 'Programmer la réouverture 1 heure plus tard');
            this.radios.ajoute(radio);

            radio = new KfRadio('h2', '2', 'Choisir le moment de la réouverture');
            this.radios.ajoute(radio);
            const grDate = new KfGroupe('grDate');
            this.dateTemps = new KfInputDateTemps('dateTemps');
            const d0 = new Date();
            const d1 = Dateur.ajouteHeures(d0, 1);
            this.dateTemps.valeur = d1;
            this.dateTemps.ajouteValidateur(KfValidateurs.validateurDeFn('maintenant_plus',
                (value: Date) => {
                    const maintenant = new Date();
                    return value.valueOf() <= maintenant.valueOf();
                },
                'La moment choisi est déjà passé.'));
            this.dateTemps.ajouteAValeur(edition);
            grDate.ajoute(this.dateTemps);
            radio.ajoute(grDate);

            radio = new KfRadio('h0', '0', 'Ne pas programmer de réouverture');
            this.radios.ajoute(radio);
            this.radios.valeur = '1';

            groupe.ajoute(this.radios);
            edition.ajoute(groupe);

            return edition;
        };
        this.créeBoutonsDeFormulaire = (formulaire: KfSuperGroupe): KfBouton[] => {
            return [FormulaireFabrique.CréeBoutonSoumettre(formulaire, texteBouton)];
        };
    }

    get dateRéouverture(): Date {
        switch (this.radios.valeur) {
            case '0':
                return Dateur.ajouteHeures(new Date(), -1);
            case '1':
                return Dateur.ajouteHeures(new Date(), 1);
            case '2':
                return this.dateTemps.valeur;
        }
    }
}

export class FermerDef extends AvecChoixRéouverture {

    constructor() {
        super('fermer', `Fermeture du site`, 'Fermer le site');
    }

}

export class ProlongeDef extends AvecChoixRéouverture {

    constructor() {
        super('prolonge', `Fermeture du site`, 'Prolonger la fermeture');
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
            etiquette.baliseHtml = KfTypeDeBaliseHTML.h6;
            etiquette.ajouteClasseDef('');
            edition.ajoute(etiquette);
            return edition;
        };
        this.créeBoutonsDeFormulaire = (formulaire: KfSuperGroupe): KfBouton[] => {
            return [FormulaireFabrique.CréeBoutonSoumettre(formulaire, 'Ouvrir le site')];
        };
    }
}
