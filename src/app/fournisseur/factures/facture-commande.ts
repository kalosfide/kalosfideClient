import { Commande } from 'src/app/commandes/commande';
import { Client } from 'src/app/modeles/clientele/client';
import { Catalogue } from 'src/app/modeles/catalogue/catalogue';
import { ApiFactureCommande } from './facture-api';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { FactureDétail } from './facture-detail';
import { KfNgClasseDefDe } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css-classe';
import { EtatDef } from 'src/app/modeles/i-etat-def';

export class FactureCommande extends Commande {

    static états: { prêt: EtatDef<FactureCommande>, incomplet: EtatDef<FactureCommande>, àFaire: EtatDef<FactureCommande> } = {
        prêt: {
            texte: 'prêt',
            classe: 'text-success',
            condition: (fc: FactureCommande) => fc.nbAFacturer === fc.nbFacturés
        },
        incomplet: {
            texte: 'à faire',
            classe: 'text-danger',
            condition: (fc: FactureCommande) => fc.nbFacturés === 0
        },
        àFaire: {
            texte: 'incomplet',
            classe: 'text-warning',
            condition: (fc: FactureCommande) => fc.nbFacturés !== 0 && fc.nbFacturés !== fc.nbAFacturer
        },
    };

    constructor(apiCommande: ApiFactureCommande, client: Client, catalogue: Catalogue) {
        super(apiCommande, client);
        apiCommande.uid = client.uid;
        apiCommande.rno = client.rno;
        this._détails = apiCommande.details.map(d => {
            const produit = catalogue.produits.find(p => p.no === d.no);
            return new FactureDétail(apiCommande, produit, client);
        });
    }

    get apiCommande(): ApiFactureCommande {
        return this._apiCommande as ApiFactureCommande;
    }

    get texteLivraison(): string {
        return `${this.apiCommande.livraisonNo} du ${Fabrique.texte.date(new Date(this.apiCommande.dateLivraison))}`;
    }

    get nbAFacturer(): number {
        return this.apiCommande.details.length;
    }

    get nbFacturés(): number {
        return this.apiCommande.details.filter(d => d.aFacturer !== undefined && d.aFacturer !== null).length;
    }

    get coût(): number {
        let coût = 0;
        this.détails.forEach(d => coût += d.coût);
        return coût;
    }

    get facturée(): boolean {
        return this.nbFacturés === this.nbAFacturer;
    }

    get texteAFacturer(): string {
        return `${this.nbAFacturer} produits`;
    }

    get texteFacturés(): string {
        return `${this.nbFacturés} produits`;
    }

    get etat(): EtatDef<FactureCommande> {
        return this.nbFacturés === this.nbAFacturer
            ? FactureCommande.états.prêt
            : this.nbFacturés === 0
                ? FactureCommande.états.àFaire
                : FactureCommande.états.incomplet;
    }

    get texteEtat(): string {
        return this.etat.texte;
    }
    static classeDefsEtat(): (string | ((t: FactureCommande) => string) | KfNgClasseDefDe<FactureCommande>)[] {
        return [
            EtatDef.classeDef(FactureCommande.états.prêt),
            EtatDef.classeDef(FactureCommande.états.incomplet),
            EtatDef.classeDef(FactureCommande.états.àFaire),
        ];
    }
}
