
export const ApiController = {
    motdepasse: 'motdepasse',
    utilisateur: 'utilisateur',
    enregistrement: 'enregistrement',
    commande: 'commande',
    detailCommande: 'detailCommande',
    role: 'role',
    fournisseur: 'fournisseur',
};

export const ApiAction = {
    motdepasse: {
        options: 'options',
    },
    data: {
        ajoute: 'ajoute',
        lit: 'lit',
        liste: 'liste',
        edite: 'edite',
        supprime: 'supprime',
        dernierNo: 'dernierNo',
    },
    utilisateur: {
        connecte: 'connecte',
        deconnecte: 'deconnecte',
        lit: 'lit',
        liste: 'liste',
        edite: 'edite',
        supprime: 'supprime',
    },
    enregistrement: {
        fournisseur: 'fournisseur',
        client: 'client',
        userNamePris: 'userNamePris',
        emailPris: 'emailPris',
    },
    role: {
        accepte: 'accepte',
    },
    fournisseur: {
        lit: 'lit',
        liste: 'liste',
        edite: 'edite',
        supprime: 'supprime',
        trouveParSite: 'trouveParSite',
    },
    site: {
        liste: 'liste',
        trouveParNom: 'trouveParNom',
        nomPris: 'nomPris',
        nomPrisParAutre: 'nomPrisParAutre',
        titrePris: 'titrePris',
        titrePrisParAutre: 'titrePrisParAutre',
        ouvert: 'ouvert',
        ouvre: 'ouvre',
        ferme: 'ferme',
    },
    categorie: {
        ajoute: 'ajoute',
        lit: 'lit',
        liste: 'liste',
        edite: 'edite',
        supprime: 'supprime',
        nomPris: 'nomPris',
        nomPrisParAutre: 'nomPrisParAutre',
    },
    produit: {
        ajoute: 'ajoute',
        lit: 'lit',
        liste: 'liste',
        edite: 'edite',
        fixePrix: 'fixePrix',
        disponibles: 'disponibles',
        nomPris: 'nomPris',
        nomPrisParAutre: 'nomPrisParAutre',
    },
    commande: {
        precedente: 'precedente',
        envoiBon: 'envoiBon',
        ouvertes: 'ouvertes',
        accepte: 'accepte',
    },
};
