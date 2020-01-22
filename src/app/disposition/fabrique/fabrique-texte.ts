import { Produit, IAvecProduit } from 'src/app/modeles/catalogue/produit';
import { TypeMesure } from 'src/app/modeles/type-mesure';
import { TypeCommande } from 'src/app/modeles/type-commande';
import { IAvecDemandeProduit } from 'src/app/commandes/i-avec-demande-produit';
import { ICoût } from 'src/app/commandes/detail-commande-cout';

export class FabriqueTexte {

    bon(siteUid: string, siteRno: number, clientUid: string, clientRno: number, noBon: number): string {
        return siteUid + '-' + siteRno + '-' + clientUid + '-' + clientRno + '-' + noBon;
    }

    estNombre(nombre: number): boolean {
        return nombre !== undefined && nombre !== null && !Number.isNaN(nombre);
    }

    nombre(nombre: number) {
        return this.estNombre(nombre) ? nombre.toLocaleString('fr-FR') : '';
    }

    prix(prix: number | ICoût): string {
        let icoût: ICoût;
        if (typeof (prix) === 'number') {
            icoût = { valeur: prix, complet: true };
        } else {
            icoût = prix;
        }
        let texte: string;
        if (this.estNombre(icoût.valeur)) {
            texte = icoût.valeur.toLocaleString('fr-FR', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            }) + ' €';
            if (!icoût.complet) {
                texte = '> ' + texte;
            }
        } else {
            texte = '';
        }
        return texte;
    }

    date(date: Date): string {
        return date.toLocaleDateString();
    }

    heure(date: Date): string {
        return date.toLocaleTimeString();
    }

    /**
     * met en miniscule la première lettre
     * @param texte
     */
    initale(texte: string): string {
        const initial = texte.substr(0, 1);
        const reste = texte.substring(1);
        return initial.toLowerCase() + reste;
    }

    /**
     * met en majuscule la première lettre
     * @param texte
     */
    Initale(texte: string): string {
        const initial = texte.substr(0, 1);
        const reste = texte.substring(1);
        return initial.toLocaleUpperCase() + reste;
    }

    àXHeure(date: Date): string {
        const maintenant = Date.now();
        const écart_en_ms = maintenant - date.valueOf();
        const jour_en_ms = 24 * 60 * 60 * 1000;
        const écart_en_jours = Math.floor(écart_en_ms / jour_en_ms);
        let texte = écart_en_jours === 0
            ? `aujourd'hui`
            : écart_en_jours === 1
                ? `hier`
                : `le ${date.toLocaleDateString()}`;
        texte = texte + ` ${date.toLocaleTimeString()}`;
        return texte;
    }

    typeCommande(typeCommande: string): string {
        const exemple = TypeCommande.pourExemple(typeCommande);
        return TypeCommande.pourListe(typeCommande) + (exemple ? ' (ex: ' + exemple + ')' : '');
    }

    typeMesure(typeMesure: string, ) {
        return TypeMesure.texte_au(typeMesure) + ' (ex: ' + this.prixOuIndisponible(typeMesure, 12.5) + ')';
    }
    prixOuIndisponible(typeMesure: string, prix: number): string {
        return prix <= 0 ? 'indisponible' : this.prix(prix) + ' ' + TypeMesure.texte_le(typeMesure);
    }


    private _testAvecProduit(nomFonction: string, avecProduit: IAvecProduit): Produit {
        if (!avecProduit.produit) {
            throw new Error(`${nomFonction}: le paramètre doit avoir une propriété 'produit' de type Produit`);
        }
        return avecProduit.produit as Produit;
    }
    nomCatégorie(avecProduit: IAvecProduit): string {
        const produit = this._testAvecProduit('', avecProduit);
        return produit.nomCategorie;
    }
    nomProduit(avecProduit: IAvecProduit): string {
        const produit = this._testAvecProduit('', avecProduit);
        return produit.nom;
    }
    seCommande(produit: Produit): string {
        return TypeMesure.texteSeCommande(produit.typeMesure, produit.typeCommande);
    }
    seMesure(produit: Produit): string {
        return TypeMesure.texte_au(produit.typeMesure);
    }
    avecProduit_seCommande(avecProduit: IAvecProduit): string {
        const produit = this._testAvecProduit('', avecProduit);
        return this.seCommande(produit);
    }
    produit_prix(produit: Produit): string {
        return this.prixOuIndisponible(produit.typeMesure, produit.prix);
    }
    avecProduit_prix(avecProduit: IAvecProduit): string {
        const produit = this._testAvecProduit('', avecProduit);
        return this.produit_prix(produit);
    }
    unité(produit: Produit): string {
        return TypeMesure.unité(produit.typeMesure);
    }
    avecProduit_unité(avecProduit: IAvecProduit): string {
        const produit = this._testAvecProduit('', avecProduit);
        return this.unité(produit);
    }

    unités(produit: Produit, id: string): string {
        return TypeMesure.texteUnités(produit.typeMesure, id);
    }
    avecProduit_unités(avecProduit: IAvecProduit, id: string): string {
        const produit = this._testAvecProduit('', avecProduit);
        return this.unités(produit, id);
    }

    private _quantitéAvecUnité(typeMesure: string, quantité: number, idTypeCommande?: string): string {
        if (quantité === null || quantité === undefined) {
            return '';
        }
        let texte = quantité.toLocaleString('fr-FR');
        if (idTypeCommande !== TypeCommande.id.ALUnité) {
            texte += ' ' + TypeMesure.unité(typeMesure);
        }
        return texte;
    }
    texteDemande(typeMesure: string, demande: number, typeCommande?: string): string {
        return this._quantitéAvecUnité(typeMesure, demande, typeCommande);
    }
    quantitéAvecUnité(produit: Produit, quantité: number, idTypeCommande?: string): string {
        if (quantité === null || quantité === undefined) {
            return '';
        }
        let texte = quantité.toLocaleString('fr-FR');
        if (!idTypeCommande || idTypeCommande !== TypeCommande.id.ALUnité) {
            const unité = TypeMesure.unité(produit.typeMesure);
            if (unité) {
                texte += ' ' + unité;
            }
        }
        return texte;
    }
    demandeAvecUnité(avecProduitEtDemande: IAvecDemandeProduit) {
        const produit = this._testAvecProduit('', avecProduitEtDemande);
        return this.quantitéAvecUnité(produit, avecProduitEtDemande.demande);
    }
    aLivrerAvecUnité(avecProduitEtALivrer: IAvecDemandeProduit) {
        const produit = this._testAvecProduit('', avecProduitEtALivrer);
        return this.quantitéAvecUnité(produit, avecProduitEtALivrer.aLivrer);
    }
    aFacturerAvecUnité(avecProduitEtALivrer: IAvecDemandeProduit) {
        const produit = this._testAvecProduit('', avecProduitEtALivrer);
        return this.quantitéAvecUnité(produit, avecProduitEtALivrer.aLivrer);
    }
    facturésAvecUnité(avecProduitEtAFacturer: IAvecDemandeProduit) {
        const produit = this._testAvecProduit('', avecProduitEtAFacturer);
        return this.quantitéAvecUnité(produit, avecProduitEtAFacturer.aFacturer);
    }

    coût(produit: Produit, quantité: number): string {
        return quantité !== undefined && quantité !== null && quantité !== NaN
            ? this.prix(produit.prix * quantité)
            : '';
    }
    coûtALivrer(avecProduitEtALivrer: IAvecDemandeProduit) {
        const produit = this._testAvecProduit('', avecProduitEtALivrer);
        return this.coût(produit, avecProduitEtALivrer.aLivrer);
    }
    coûtFacturés(avecProduitEtAFacturer: IAvecDemandeProduit) {
        const produit = this._testAvecProduit('', avecProduitEtAFacturer);
        return this.coût(produit, avecProduitEtAFacturer.aFacturer);
    }

}
