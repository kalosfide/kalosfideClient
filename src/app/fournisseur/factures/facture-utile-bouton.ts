import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { IContenuPhraseDef } from 'src/app/disposition/fabrique/fabrique-contenu-phrase';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { FactureUtile } from './facture-utile';
import { FactureService } from './facture.service';
import { CommandeUtileBouton } from 'src/app/commandes/commande-utile-bouton';
import { FabriqueBootstrap } from 'src/app/disposition/fabrique/fabrique-bootstrap';
import { FactureCommande } from './facture-commande';
import { Facture } from './facture';
import { KfBBtnToolbar } from 'src/app/commun/kf-composants/kf-b-btn-toolbar/kf-b-btn-toolbar';
import { KfBBtnGroup } from 'src/app/commun/kf-composants/kf-b-btn-group/kf-b-btn-group';
import { FactureDétail } from './facture-detail';

export class FactureUtileBouton extends CommandeUtileBouton {
    private get _factureUtile(): FactureUtile {
        return this._dataUtile as FactureUtile;
    }

    constructor(factureUtile: FactureUtile) {
        super(factureUtile);
    }

    private get service(): FactureService {
        return this._factureUtile.service;
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

    copieDétail(détail: FactureDétail): KfBouton {
        const bouton = this.créeBoutonAttente('copie_d',
            Fabrique.contenu.copier,
            () => {
                return this.service.copieDétail(détail);
            },
            () => {
                this.service.copieDétailOk(détail);
                détail.copieALivrer();
            }
        );
        return bouton;
    }

    annuleDétail(détail: FactureDétail): KfBouton {
        const bouton = this.créeBoutonAttente('annule_d',
            Fabrique.contenu.exclure,
            () => {
                return this.service.annuleDétail(détail);
            },
            () => {
                this.service.annuleDétailOk(détail);
            }
        );
        bouton.inactivitéFnc = () => détail.facturée;
        return bouton;
    }

    btnToolbarDétail(détail: FactureDétail): KfBBtnToolbar {
        const no = détail.apiDétail.no2;
        const toolbar = new KfBBtnToolbar('btnBar_d' + no);
        const groupe = new KfBBtnGroup('btnGroup_d' + no);
        let bouton = this.copieDétail(détail);
        bouton.nom = bouton.nom + no;
        groupe.ajoute(bouton);
        bouton = this.annuleDétail(détail);
        bouton.nom = bouton.nom + no;
        groupe.ajoute(bouton);
        toolbar.ajoute(groupe);
        return toolbar;
    }

    copieCommande(commande: FactureCommande): KfBouton {
        const bouton = this.créeBoutonAttente('copie_c',
            Fabrique.contenu.copier,
            () => this.service.copieCommande(commande),
            () => {
                this.service.copieCommandeOk(commande);
            }
        );
        bouton.inactivitéFnc = () => commande.facturée;
        return bouton;
    }

    annuleCommande(commande: FactureCommande): KfBouton {
        const bouton = this.créeBoutonAttente('annule_c',
            Fabrique.contenu.exclure,
            () => this.service.annuleCommande(commande),
            () => {
                this.service.annuleCommandeOk(commande);
            }
        );
        return bouton;
    }

    btnToolbarCommande(commande: FactureCommande, enTête?: boolean): KfBBtnToolbar {
        const no = commande.no;
        const toolbar = new KfBBtnToolbar('btnBar_c' + no);
        const groupe = new KfBBtnGroup('btnGroup_c' + no);
        if (!enTête) {
            const lien = this._factureUtile.lien.factureCommande(commande);
            FabriqueBootstrap.ajouteClasse(lien, 'btn', 'light');
            groupe.ajoute(lien);
        }
        let bouton = this.copieCommande(commande);
        bouton.nom = bouton.nom + no;
        groupe.ajoute(bouton);
        bouton = this.annuleCommande(commande);
        bouton.nom = bouton.nom + no;
        groupe.ajoute(bouton);
        toolbar.ajoute(groupe);
        return toolbar;
    }

    copieCommandes(facture: Facture): KfBouton {
        const bouton = this.créeBoutonAttente('copie_f',
            Fabrique.contenu.copier,
            () => this.service.copieCommandes(facture),
            () => {
                this.service.copieCommandesOk(facture);
            }
        );
        bouton.inactivitéFnc = () => facture.prête;
        return bouton;
    }

    btnToolbarFacture(facture: Facture): KfBBtnToolbar {
        const toolbar = new KfBBtnToolbar('btnBar_f');
        const groupe = new KfBBtnGroup('btnGroup_f');
        groupe.ajoute(Fabrique.bouton.fauxTexteSousIcone());
        const bouton = this.copieCommandes(facture);
        groupe.ajoute(bouton);
        toolbar.ajoute(groupe);
        groupe.ajoute(Fabrique.bouton.fauxTexteSousIcone());
        return toolbar;
    }

}
