import { LivraisonRoutes, LivraisonPages } from './livraison-pages';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfInitialObservable } from 'src/app/commun/kf-composants/kf-partages/kf-initial-observable';
import { LivraisonService } from './livraison.service';
import { LivraisonUtileBouton } from './livraison-utile-bouton';
import { LivraisonUtileColonne } from './livraison-utile-colonne';
import { CommandeUtile } from 'src/app/commandes/commande-utile';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { Conditions } from 'src/app/commun/condition/condition';
import { BilanLivraison } from './livraison-etat';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { GroupeBoutonsMessages } from 'src/app/disposition/fabrique/fabrique-formulaire';

class ConditionsComposées extends Conditions<string> {
    constructor(utile: LivraisonUtile) {
        super();
        this.ajoute('catalogueOuPasDeClients', KfInitialObservable.ou(utile.conditionSite.catalogue,
            KfInitialObservable.nouveau(utile.site.nbClients === 0)));
        this.ajoute('livraisonOuEdite', KfInitialObservable.ou(utile.conditionSite.livraison, utile.conditionAction.edite));
        this.ajoute('livraisonEtEdite', KfInitialObservable.et(utile.conditionSite.livraison, utile.conditionAction.edite));
        this.ajoute('non_livraisonEtEdite', KfInitialObservable.ou(utile.conditionSite.pas_livraison, utile.conditionAction.pas_edite));
        this.ajoute('pasLivraisonEtEdite', KfInitialObservable.et(utile.conditionSite.pas_livraison, utile.conditionAction.edite));
    }

    get catalogueOuPasDeClients(): KfInitialObservable<boolean> {
        return this.conditionIO('catalogueOuPasDeClients');
    }

    get non_catalogueOuPasDeClients(): KfInitialObservable<boolean> {
        return this.pas_conditionIO('catalogueOuPasDeClients');
    }

    get livraisonOuEdite(): KfInitialObservable<boolean> {
        return this.conditionIO('livraisonOuEdite');
    }

    get non_livraisonOuEdite(): KfInitialObservable<boolean> {
        return this.pas_conditionIO('livraisonOuEdite');
    }

    get non_livraisonEtEdite(): KfInitialObservable<boolean> {
        return this.conditionIO('non_livraisonEtEdite');
    }

    get non_non_livraisonEtEdite(): KfInitialObservable<boolean> {
        return this.pas_conditionIO('non_livraisonEtEdite');
    }

    get pasLivraisonEtEdite(): KfInitialObservable<boolean> {
        return this.conditionIO('pasLivraisonEtEdite');
    }

    get livraisonEtEdite(): KfInitialObservable<boolean> {
        return this.conditionIO('livraisonEtEdite');
    }
}

export class LivraisonUtile extends CommandeUtile {
    private _condition: ConditionsComposées;

    constructor(service: LivraisonService) {
        super(service);
        this._bouton = new LivraisonUtileBouton(this);
        this._colonne = new LivraisonUtileColonne(this);
        this.colonne.créeDétail();
    }

    texte = {
        définition_Commander: `Commander consiste à choisir des produits et à fixer les quantités demandées.`,
        définition_Traiter: `Traiter une commande consiste à fixer la quantité à livrer de chaque produit demandé.`,
        titre: 'Livraison',
        titre_Commencer: 'Préparer',
        titre_Vérifier: 'Vérifier',
        titre_AnnulerCommencer: 'Arrêter',
        titre_AnnulerVérifier: 'Reprendre',
        titre_Terminer: 'Valider',
    };

    créeAutresConditions() {
        this._condition = new ConditionsComposées(this);
    }

    get condition(): ConditionsComposées {
        return this._condition;
    }

    get bouton(): LivraisonUtileBouton {
        return this._bouton as LivraisonUtileBouton;
    }

    get colonne(): LivraisonUtileColonne {
        return this._colonne as LivraisonUtileColonne;
    }

    get service(): LivraisonService {
        return this._service as LivraisonService;
    }

    retourneALaListe() {
        this.routeur.naviguePageDef(LivraisonPages.commandes, LivraisonRoutes, this.site.nomSite);
    }

    // pour LivraisonCommandesComponent et LivraisonProduitsComponent
    groupeCatalogue(): KfGroupe {
        const messages: KfComposant[] = [];
        let etiquette: KfEtiquette;
        etiquette = Fabrique.ajouteEtiquetteP(messages);
        Fabrique.ajouteTexte(etiquette, `Une modification du catalogue est en cours.`);
        etiquette = Fabrique.ajouteEtiquetteP(messages);
        Fabrique.ajouteTexte(etiquette, 'Vous ne pouvez pas créer de commandes pour vos clients.'
            + ' Vous ne pouvez pas traiter les commandes reçues.');
        const groupe = new GroupeBoutonsMessages('catalogue', messages);
        groupe.alerte('danger');
        groupe.groupe.nePasAfficherSi(this.conditionSite.pas_catalogue);
        return groupe.groupe;
    }

    // pour LivraisonCommandesComponent
    groupeEnvoi(superGroupe: KfSuperGroupe, bilanLivraisonIO: KfInitialObservable<BilanLivraison>): KfGroupe {
        const messages: KfComposant[] = [];
        let etiquette: KfEtiquette;
        const fixeEtiquetteVide = (nbSansDétails: number) => {
            if (nbSansDétails > 0) {
                etiquette.visible = true;
                etiquette.fixeTexte(`Il y a ${nbSansDétails} commandes vides. Ces commandes vont être supprimées.`);
            } else {
                etiquette.visible = false;
            }
        };
        etiquette = Fabrique.ajouteEtiquetteP(messages);
        etiquette.ajouteClasseDef('text-danger');
        fixeEtiquetteVide(bilanLivraisonIO.valeur.nbSansDétails);
        bilanLivraisonIO.observable.subscribe(bilan => fixeEtiquetteVide(bilan.nbSansDétails));

        etiquette = Fabrique.ajouteEtiquetteP(messages);
        Fabrique.ajouteTexte(etiquette, 'Les commandes ne pourront plus être modifiées.');
        etiquette = Fabrique.ajouteEtiquetteP(messages);
        Fabrique.ajouteTexte(etiquette, 'Cette action ne pourra pas être annulée.');

        const groupe = new GroupeBoutonsMessages('envoi', messages);
        groupe.créeBoutons([this.bouton.annulerEnvoiBon(), this.bouton.termineLivraison(superGroupe)]);
        groupe.alerte('warning');
        groupe.groupe.nePasAfficherSi(this.conditionAction.pas_envoi);
        return groupe.groupe;
    }

    fixeContenuPositionBoutonTerminer(etiquette: KfEtiquette) {
        Fabrique.ajouteTexte(etiquette, 'Le bouton ');
        Fabrique.ajouteTexte(etiquette, this.texte.titre_Terminer, KfTypeDeBaliseHTML.b);
        Fabrique.ajouteTexte(etiquette, ' se trouve en bas de la page ');
        etiquette.contenuPhrase.ajoute(this.lien.desClients());
    }

    // pour LivraisonProduitsComponent
    groupeEnvoiProduits(superGroupe: KfSuperGroupe): KfGroupe {
        const messages: KfComposant[] = [];
        let etiquette: KfEtiquette;
        etiquette = Fabrique.ajouteEtiquetteP(messages);
        this.fixeContenuPositionBoutonTerminer(etiquette);

        const groupe = new GroupeBoutonsMessages('envoi', messages);
        groupe.alerte('primary');
        groupe.groupe.nePasAfficherSi(this.conditionAction.pas_envoi);
        return groupe.groupe;
    }

    groupeEnvoyé(): KfGroupe {
        const messages: KfComposant[] = [];
        let etiquette = new KfEtiquette('', 'La livraison s\'est terminée avec succès. Les commandes sont maintenant ouvertes.');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        messages.push(etiquette);
        etiquette = new KfEtiquette('', 'Si vous avez terminé, pensez à vous ');
        etiquette.contenuPhrase.ajoute(this.lien.déconnection());
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        messages.push(etiquette);
        const groupe = new GroupeBoutonsMessages('envoi', messages);
        groupe.alerte('success');
        groupe.groupe.nePasAfficherSi(this.conditionAction.pas_envoyer);
        return groupe.groupe;
    }

    // Utiles
    get titreCommande(): string {
        let titre = LivraisonPages.commandes.titre;
        titre = titre + '';
        return titre;
    }

    bilanLivraison(): KfGroupe {
        const groupe = new KfGroupe('');
        groupe.créeGereValeur();
        groupe.estRacineV = true;
        return groupe;
    }

}
