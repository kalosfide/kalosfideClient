import { IKeyUidRnoNo } from 'src/app/commun/data-par-key/key-uid-rno-no/i-key-uid-rno-no';
import { ICommandeComponent } from 'src/app/commandes/i-commande-component';

export interface ICommanderComponent extends ICommandeComponent {

    ikeyCommande: IKeyUidRnoNo;
}
