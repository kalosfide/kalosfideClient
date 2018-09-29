import { IKeyUidNo } from '../../commun/data-par-key/key-uid-no/i-key-uid-no';

export class Role implements IKeyUidNo {
    utilisateurId: string;
    no: number;
    type: string;
    etat: string;
    nom: string;
    adresse: string;
    fournisseurId?: string;
    fournisseurNo?: number;
}
