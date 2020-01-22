
export const ApiController = {
    motdepasse: 'motdepasse',
    utilisateur: 'utilisateur',
    enregistrement: 'enregistrement',
    role: 'role',
    site: 'site',
    fournisseur: 'fournisseur',
    client: 'client',
    catalogue: 'catalogue',
    produit: 'produit',
    categorie: 'categorie',
    commande: 'commande',
    detailCommande: 'detailCommande',
    livraison: 'livraison',
    peuple: 'peuple',
    facture: 'facture',
    document: 'document',
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
        litNbs: 'litNbs',
        nomPris: 'nomPris',
        nomPrisParAutre: 'nomPrisParAutre',
        titrePris: 'titrePris',
        titrePrisParAutre: 'titrePrisParAutre',
        etat: 'etat',
    },
    catalogue: {
        /** GET le catalogue actuel d'un site
         * params uid, rno du site
         */
        complet: 'complet',
        disponible: 'disponible',
        commande: 'commande',
        livraison: 'livraison',
        obsolete: 'obsolete',
        // modification
        commence: 'commence',
        termine: 'termine'
    },
    categorie: {
        ajoute: 'ajoute',
        edite: 'edite',
        supprime: 'supprime',

        lit: 'lit', // une vue où le champ nbProduits est présent

        // listes groupées
        liste: 'liste', // données
        listeNbProduits: 'nbProduits', // vues où le champ nbProduits est présent
        disponibles: 'disponibles', // données catégories ayant des produits disponibles
        changes: 'changes', // états

        nomPris: 'nomPris',
        nomPrisParAutre: 'nomPrisParAutre',
    },
    produit: {
        ajoute: 'ajoute',
        edite: 'edite',
        fixePrix: 'prix',
        supprime: 'supprime',

        lit: 'lit', // une vue où nomCatégorie est présent

        // listes groupées
        liste: 'liste', // données
        disponibles: 'disponibles', // données

        nomPris: 'nomPris',
        nomPrisParAutre: 'nomPrisParAutre',
    },
    client: {
        /**
         * ajoute un client
         * param: vue du client à ajouter
         */
        ajoute: 'ajoute',

        /**
         * edite un client
         * param: vue du client à editer
         */
        edite: 'edite',

        /**
         * change l'état d'un client
         *  nouveau -> actif (fournisseur)
         *  actif <-> inactif (client)
         *  nouveau ou actif ou inactif -> exclu (fournisseur)
         */
        etat: 'etat',

        /**
         * charge la liste des clients
         * param: keySite
         */
        liste: 'liste',

        /**
         * charge la liste des clients qui ont ouvert un compte depuis une date
         * param: keySite
         * param: date du stock
         */
        rafraichit: 'depuis',
    },

    commande: {
        /**
         * retourne un ApiCommande qui contient les données definissant la commande
         * param: key du Client
         */
        encours: 'enCours',

        /**
         * retourne un ApiContexteCommande qui contient le contexte pour commander
         * param: key du Client
         */
        contexte: 'contexte',

        /** INUTILE si contexte
         * retourne vrai si l'état du site, la date du catalogue, le numéro de la livraison, ou la commande a changé
         * param:  key de la commande et valeurs stockées
         */
        relire: 'relire',

        /**
         * crée une nouvelle commande d'un client en copiant les détails de la commande précédente
         * param: key du Client
         */
        copie: 'copie',

        /**
         * crée une nouvelle commande d'un client sans détails
         * param: key du Client
         */
        nouveau: 'nouveau',

        /**
         * Supprime les détails de la commande créés par l'utilisateur. S'il reste des détails, fixe leur aLivrer à 0.
         * S'il n'y a plus de détails, supprime la commande.
         */
        efface: 'efface',

        /**
         * ajoute un détail de commande, fixe la date de la commande
         * param: vue du détail à ajouter
         */
        ajoute: 'ajoute',

        /**
         * edite un détail de commande, fixe la date de la commande
         * param: vue du détail à editer
         */
        edite: 'edite',

        /**
         * supprime un détail de commande
         * param: vue du détail à supprimer
         */
        supprime: 'supprime',

        /**
         * fixe l'état de la commande sur Envoyé et sa date sur la date en cours
         */
        envoi: 'envoi',

        /**
         * change l'état d'une commande
         *  état àPréparer sans numéro de livraison -> àRefuser
         *  état àRefuser sans numéro de livraison -> àPréparer
         */
        etat: 'etat',
        /**
         * retourne le nombre de commandes non vides d'état Nouveau d'un site
         * param: key du site
         */
        nbouvertes: 'nbouvertes',
        /**
         * copie les demandes des détails d'une commande d'état APréparer dans les aLivrer correspondants
         * param: key de la commande
         */
        copieDemandesCommande: 'copieDemC',
        /**
         * copie les demandes d'un produit des commandes d'état APréparer dans les aLivrer correspondants
         * param: key du produit
         */
        copieDemandesProduit: 'copieDemP',
        /**
         * copie la demande d'un détail d'une commande d'état APréparer dans son aLivrer
         * param: key du détail
         */
        copieDemandeDétail: 'copieDem',

        copieDemandes: 'copieDems',
        /**
         * fixe le aLivrer d'un détail d'une commande d'état APréparer
         * param: vue du détail
         */
        fixeaLivrer: 'aLivrer',
    },

    livraison: {

        /**
         * retourne un ApiLivraison de la dernière livraison
         * param: key du Site
         */
        encours: 'enCours',

        /**
         * retourne un ApiLivraison contenant les dernières commandes ouvertes des clients avec compte
         * param: key du Site
         */
        avecCompte: 'avecCompte',

        /**
         * change en Livraison l'état du site
         * crée une nouvelle livraison, y affecte les commandes non vides sans livraisonNo
         * param: key du site
         */
        commence: 'commence',

        annule: 'annule',

        /**
         * change en Préparé l'état des commandes d'état APréparer et fixe leur livraisonNo
         * fixe le livraisonNo des commandes d'état Refusé sans livraisonNo
         * param: key du site
         */
        termine: 'termine',
    },

    peuple: {
        estPeuple: 'estPeuple',
        peuple: 'peuple',
    },

    facture: {
        clients: 'clients',
        detail: 'detail',
        annuleCommande: 'annuleCommande',
        copieCommande: 'copieCommande',
        copieCommandes: 'copieCommandes',
        facture: 'facture',
    },

    document: {
        client: 'listeC',
        listeF: 'listeF',
        commande: 'commande',
        livraison: 'livraison',
        facture: 'facture',
    },
};
