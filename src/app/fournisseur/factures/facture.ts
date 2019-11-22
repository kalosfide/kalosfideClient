import { Catalogue } from 'src/app/modeles/catalogue/catalogue';
import { IKeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/i-key-uid-rno';
import { Client } from 'src/app/modeles/clientele/client';
import { ApiFacture } from './facture-api';
import { FactureCommande } from './facture-commande';
import { ApiDétailCommandeData } from 'src/app/commandes/api-commande';
import { FactureProduit } from './facture-produit';
import { EtatDef } from 'src/app/modeles/i-etat-def';
import { KfNgClasseDefDe } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css-classe';

export class Facture implements IKeyUidRno {

    static états: {
        enregistré: EtatDef<Facture>,
        prêt: EtatDef<Facture>,
        incomplet: EtatDef<Facture>,
        àFaire: EtatDef<Facture>
    } = {
        enregistré: {
            texte: 'enregistrée',
            classe: 'text-muted',
            condition: (f: Facture) => f.enregistrée
        },
        prêt: {
            texte: 'prêt',
            classe: 'text-success',
            condition: (f: Facture) => f.prête && !f.enregistrée
        },
        incomplet: {
            texte: 'à faire',
            classe: 'text-danger',
            condition: (f: Facture) => f.àFaire
        },
        àFaire: {
            texte: 'incomplet',
            classe: 'text-warning',
            condition: (f: Facture) => !f.àFaire && !f.prête
        },
    };

    client: Client;

    get uid(): string {
        return this.client.uid;
    }

    get rno(): number {
        return this.client.rno;
    }

    /**
     * infos sur les commandes conçernées: no des commandes, no et date des livraisons
     */
    commandes: FactureCommande[];

    produits: FactureProduit[];

    factureNo: number;

    static classeDefsEtat(): (string | ((t: Facture) => string) | KfNgClasseDefDe<Facture>)[] {
        return [
            EtatDef.classeDef(Facture.états.enregistré),
            EtatDef.classeDef(Facture.états.prêt),
            EtatDef.classeDef(Facture.états.incomplet),
            EtatDef.classeDef(Facture.états.àFaire),
        ];
    }

    constructor(apiFacture: ApiFacture, client: Client, catalogue: Catalogue) {
        this.client = client;
        this.commandes = apiFacture.commandes.map(apiCommande => {
            apiCommande.uid = apiFacture.uid;
            apiCommande.rno = apiFacture.rno;
            return new FactureCommande(apiCommande, this.client, catalogue);
        });
        this.factureNo = apiFacture.factureNo;
    }

    créeFactureProduits(apiFacture: ApiFacture, catalogue: Catalogue) {
        let details: ApiDétailCommandeData[] = [];
        apiFacture.commandes.forEach(c => details = details.concat(c.details));
        details = details.sort((a, b) => a.no === b.no
            ? 0
            : a.no < b.no
                ? -1
                : 1);
        const produits: FactureProduit[] = [];
        let index = 0;
        while (index < details.length) {
            const no = details[index].no;
            let prochain = details.findIndex(d => d.no > no);
            if (prochain === -1) {
                prochain = details.length;
            }
            const détailsDeNo = details.slice(index, prochain);
            const produit = catalogue.produits.find(p => p.no === no);
            produits.push(new FactureProduit(produit, détailsDeNo));
            index = prochain;
        }
        this.produits = produits;
    }

    get nbAFacturer(): number {
        return this.commandes.length;
    }

    get texteAFacturer(): string {
        return '' + this.nbAFacturer;
    }

    get nbFacturées(): number {
        return this.commandes.filter(c => c.facturée).length;
    }

    get texteFacturées(): string {
        return '' + this.nbFacturées;
    }

    get enregistrée(): boolean {
        return this.factureNo !== undefined && this.factureNo !== null;
    }
    get prête(): boolean {
        return this.nbFacturées === this.nbAFacturer;
    }
    get àFaire(): boolean {
        return this.nbFacturées === 0;
    }

    get etat(): EtatDef<Facture> {
        return this.enregistrée
            ? Facture.états.enregistré
            : this.prête
                ? Facture.états.prêt
                : this.àFaire
                    ? Facture.états.àFaire
                    : Facture.états.incomplet;
    }

    get texteEtat(): string {
        return this.etat.texte;
    }

    get nbDétailsNonFacturés(): number {
        let nb = 0;
        this.commandes.forEach(c => nb += c.détails.filter(d => d.aFacturer === null || d.aFacturer === undefined).length);
        return nb;
    }

    get montant(): number {
        let coût = 0;
        this.commandes.forEach(c => coût += c.coût);
        return coût;
    }
}
