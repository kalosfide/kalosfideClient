import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { DataKeyALESComponent } from 'src/app/commun/data-par-key/data-key-ales.component';
import { ProduitPrix, EtatPrix, textePrix } from '../../modeles/produit-prix';
import { PageDef } from 'src/app/commun/page-def';
import { ProduitPages, ProduitRoutes } from './produit-pages';
import { Site } from 'src/app/modeles/site';
import { KfVueTable } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table';
import { KfInputNombre } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-nombre';
import { ProduitPrixService } from './produit-prix.service';
import { AttenteAsyncService } from 'src/app/services/attenteAsync.service';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { ProduitPrixEditeur } from './produit-prix-editeur';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
    styles: []
})
export class ProduitPrixComponent extends DataKeyALESComponent<ProduitPrix> implements OnInit {

    static _pageDef: PageDef = ProduitPages.prix;
    pageDef: PageDef = ProduitPages.prix;

    get titre(): string {
        return this.pageDef.titre;
    }

    get action(): string {
        return ProduitPages.ajoute.urlSegment;
    }

    site: Site;

    dataPages = ProduitPages;
    dataRoutes = ProduitRoutes;

    private _produitPrix: ProduitPrix;
    private _anciensPrix: KfVueTable<EtatPrix>;
    private _nouveau: KfInputNombre;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected service: ProduitPrixService,
        protected attenteAsyncService: AttenteAsyncService,
    ) {
        super(router, route, service, attenteAsyncService);

        this.titreRésultatErreur = 'Mise à jour impossible';

        this.créeBoutonsDeFormulaire = () => [this.créeBoutonSoumettre('Fixer le prix')];
    }

    créeEdition = (): KfGroupe => {
        const edition = new KfGroupe('edition');
        edition.créeGereValeur();
        const nomCategorie = new KfInputTexte('nomCategorie', 'Catégorie');
        nomCategorie.lectureSeule = true;
        nomCategorie.valeur = this._produitPrix.nomCategorie;
        edition.ajoute(nomCategorie);
        const nomProduit = new KfInputTexte('nomProduit', 'Produit');
        nomProduit.valeur = this._produitPrix.nomProduit;
        nomProduit.lectureSeule = true;
        edition.ajoute(nomProduit);
        this._anciensPrix = Fabrique.vueTable<EtatPrix>('', {
            enTetesDef: [{ texte: 'Historique' }],
            cellules: (ligne: EtatPrix) => [this.textePrix(ligne)]
        });
        edition.ajoute(this._anciensPrix);
        const nouveau = new KfInputNombre('nouveau', 'Nouveau prix');
        nouveau.min = 0;
        nouveau.max = 999.99;
        nouveau.pas = 0.10;
        edition.ajoute(nouveau);
        this._nouveau = nouveau;
        return edition;
    }

    indisponible(ligne: EtatPrix): boolean {
        return !ligne || ligne.prix <= 0;
    }

    textePrix(ligne: EtatPrix): string {
        const t = this.indisponible(ligne) ? 'indisponible' : textePrix(ligne.prix);
        const date: Date = new Date(ligne.date);
        return t + (ligne ? ' (' + date.toLocaleDateString('fr-FR') + ')' : '');
    }

    créeDataEditeur(): void {
        this.dataEditeur = new ProduitPrixEditeur();
    }

    ngOnInit() {
        this.site = this.service.navigation.siteEnCours;
        this.subscriptions.push(this.route.data.subscribe(
            (data: Data) => {
                this._produitPrix = data.valeur;
                this.créeFormulaire();
                this._anciensPrix.initialise(this._produitPrix.etats);
            }
        ));
    }

    get valeur(): ProduitPrix {
        return {
            uid: this._produitPrix.uid,
            rno: this._produitPrix.rno,
            no: this._produitPrix.no,
            etats: [{
                prix: this._nouveau.formControl.value
            }]
        };
    }
}
