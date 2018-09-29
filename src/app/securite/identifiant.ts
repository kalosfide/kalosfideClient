export class Identifiant {
    id: string;
    jeton: string;
    expireDans: number;
    revendications: RevendicationsUtilisateur;
}
export class IdentifiantVue {
    id: string;
    jeton: string;
    expireDans: number;
    revendications: RevendicationsUtilisateur;
}

export class RevendicationsUtilisateur {
    usid: string;
    utid: string;
    etut: string;
    rono: number;
    tyro: string;
    etro: string;
}
