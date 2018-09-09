import { IIdNo } from '../../services/i-id-no';

export class Role implements IIdNo {
    utilisateurId: string;
    no: number;
    type: string;
    etat: string;
    nom: string;
    adresse: string;
    fournisseurId?: string;
    fournisseurNo?: number;
}
