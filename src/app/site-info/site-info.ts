import { IKeyNumber } from '../commun/data-par-key/key-number/i-key-number';

export class SiteInfo implements IKeyNumber {
    id: number;
    nom: string;
    titre: string;
    date: string;
}
