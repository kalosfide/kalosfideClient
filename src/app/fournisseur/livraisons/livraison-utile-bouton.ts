import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { LivraisonProduit } from './livraison-produit';
import { IContenuPhraseDef } from 'src/app/disposition/fabrique/fabrique-contenu-phrase';
import { DetailCommande } from 'src/app/commandes/detail-commande';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { LivraisonUtile } from './livraison-utile';
import { LivraisonService } from './livraison.service';
import { CommandeUtileBouton } from 'src/app/commandes/commande-utile-bouton';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { IBoutonDef } from 'src/app/disposition/fabrique/fabrique-bouton';
import { BootstrapNom } from 'src/app/disposition/fabrique/fabrique-bootstrap';
import { ModeAction } from 'src/app/commandes/condition-action';
import { LivraisonProduits } from './livraison-produits';
import { Commande } from 'src/app/commandes/commande';

export class LivraisonUtileBouton extends CommandeUtileBouton {
    private get _livraisonUtile(): LivraisonUtile {
        return this._dataUtile as LivraisonUtile;
    }

    constructor(livraisonUtile: LivraisonUtile) {
        super(livraisonUtile);
    }

    private get service(): LivraisonService {
        return this._livraisonUtile.service;
    }

    // boutons
    private créeBoutonAttente(nom: string, contenu: IContenuPhraseDef,
        demandeApi: () => Observable<ApiResult>, actionSiOk: () => void
        ): KfBouton {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: null,
            demandeApi: demandeApi,
            actionSiOk: actionSiOk,
        };
        const bouton = Fabrique.bouton.boutonAttenteDeColonne(nom, contenu, apiRequêteAction, this.service);
        return bouton;
    }

    copieDétail(détail: DetailCommande): KfBouton {
        const bouton = this.créeBoutonAttente('copie1',
            Fabrique.contenu.copier,
            () => {
                return this.service.copieDemande(détail);
            },
            () => {
                this.service.siCopieDemandeOk(détail);
                détail.copieDemande();
            }
        );
        return bouton;
    }

    copieCommande(commande: Commande): KfBouton {
        const bouton = this.créeBoutonAttente('copie_C',
            Fabrique.contenu.copier,
            () => this.service.copieDemandesCommande(commande),
            () => {
                this.service.siCopieDemandesCommandeOk(commande);
                commande.copieDemande();
            }
        );
        return bouton;
    }

    copieProduit(produit: LivraisonProduit): KfBouton {
        const bouton = this.créeBoutonAttente('copie',
            Fabrique.contenu.copier,
            () => this.service.copieDemandesProduit(produit),
            () => {
                this.service.siCopieDemandesProduitOk(produit);
                produit.copieDemande();
            }
        );
        bouton.inactivitéFnc = () => produit.préparé;
        return bouton;
    }

    copieProduits(livraisonProduits: LivraisonProduits): KfBouton {
        const bouton = this.créeBoutonAttente('copie',
            Fabrique.contenu.copier,
            () => this.service.copieDemandes(),
            () => {
                this.service.siCopieDemandesOk();
                livraisonProduits.copieDemande();
            }
        );
        return bouton;
    }

    termineLivraison(superGroupe: KfSuperGroupe): KfBouton {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this.service.envoieBon();
            },
            actionSiOk: (): void => {
                this.service.siEnvoieBonOk();
                this.service.changeMode(ModeAction.edite);
            },
        };
        const bouton = Fabrique.bouton.boutonAction('envoi', 'Terminer la livraison', apiRequêteAction, this.service);
        return bouton;
    }

    annulerEnvoiBon(): KfBouton {
        const def: IBoutonDef = {
            nom: 'annuler',
            contenu: { texte: 'Annuler' },
            bootstrapType: BootstrapNom.dark,
            action: () => {
                this.service.changeMode(ModeAction.edite);
            }
        };
        const bouton = Fabrique.bouton.bouton(def);
        return bouton;
    }

}
