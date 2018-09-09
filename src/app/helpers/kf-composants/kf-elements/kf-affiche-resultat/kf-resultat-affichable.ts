export enum KfTypeResultatAffichable {
    Ok = 'Ok',
    Avertissement = 'Avertissement',
    Echec = 'Echec',
}
// type fixe la classe css
export class KfResultatAffichable {
    type: KfTypeResultatAffichable;
    titre: string;
    détails: string[];

    constructor(
        type: KfTypeResultatAffichable,
        titre?: string,
        détails?: string[]
    ) {
        this.type = type;
        this.titre = titre;
        this.détails = détails;
    }

}
