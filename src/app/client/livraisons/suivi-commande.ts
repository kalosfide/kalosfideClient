import { KeyUidRnoNo } from '../../commun/data-par-key/key-uid-rno-no/key-uid-rno-no';
import { CommandeLigne, CommandeDetail } from './commande-ligne';

export class Commande extends KeyUidRnoNo {
    details: CommandeDetail[];
}

export class CommandeVue extends KeyUidRnoNo {
    lignes: CommandeLigne[];
}
