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
    utilisateurId: string;
    etatUtilisateur: string;
    roleNo: number;
    typeRole: string;
    etatRole: string;
}

class Rev {
   utid: string;
    etut: string;
    rono: string;
    tyro: string;
    etro: string;
}
