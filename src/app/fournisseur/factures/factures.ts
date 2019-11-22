import { Facture } from './facture';
import { ApiFacture } from './facture-api';
import { Catalogue } from 'src/app/modeles/catalogue/catalogue';
import { Client } from 'src/app/modeles/clientele/client';

export class Factures {
    factures: Facture[];

    constructor(factures: ApiFacture[], clients: Client[], catalogue: Catalogue) {
        this.factures = factures.map(data => {
            const client = clients.find(c => data.uid === c.uid && data.rno === c.rno);
            return new Facture(data, client, catalogue);
        });
    }

    get total(): number {
        let total = 0;
        this.factures.forEach(f => total += f.montant);
        return total;
    }
}
