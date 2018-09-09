import { IItemDeMenu, IMenu } from './imenu';
import { VisiteurApiRoutes } from '../visiteur/visiteur-api-routes';
import { CompteApiRoutes } from '../compte/compte-api-routes';
import { AppApiRoutes } from '../app-api-routes';

// Items
const ItemRole: IItemDeMenu = {
    route: '/utilisateur/role',
    texte: 'Role',
};

const ItemsNonConnecté: IItemDeMenu[] = [
    {
        route: '/siteinfo',
        texte: 'SiteInfos',
    },
    {
        route: VisiteurApiRoutes.Route(VisiteurApiRoutes.App.apropos),
        texte: 'A propos',
    },
    {
        route: VisiteurApiRoutes.Route(VisiteurApiRoutes.App.contact),
        texte: 'Contact',
    }
];

const ItemsSansRole: IItemDeMenu[] = [ItemRole].concat(ItemsNonConnecté);

const SiteSansRole: IItemDeMenu = {
    texte: 'Kalosfide',
    route: '/',
};

const SiteAvecRole: IItemDeMenu = {
    texte: 'Kalosfide',
    nom: 'Kalosfide',
    sousMenu: [SiteSansRole].concat(ItemsSansRole)
};

const CompteNonConnecté: IItemDeMenu = {
    texte: 'Connection',
    nom: 'connection',
    sousMenu: [
        {
            route: CompteApiRoutes.Route(CompteApiRoutes.App.connection),
            texte: 'Connection',
        },
        {
            route: CompteApiRoutes.Route(CompteApiRoutes.App.enregistrement),
            texte: 'Enregistrement',
        },
    ]
};

const CompteDéconnection: IItemDeMenu[] = [
    {
        route: CompteApiRoutes.Route(CompteApiRoutes.App.deconnection),
        texte: 'Déconnection',
    },
    {
        route: AppApiRoutes.Route(AppApiRoutes.App.compte),
        texte: 'Mon Compte',
    }
];

const CompteSansRole: IItemDeMenu = {
    texte: 'Compte',
    nom: 'compte',
    sousMenu: CompteDéconnection
};

const CompteAvecRole: IItemDeMenu = {
    texte: 'Déconnection',
    nom: 'deconnection',
    sousMenu: [ItemRole].concat(CompteDéconnection)
};

export const VisiteurMenu: IMenu = {
    nom: 'Visiteur',
    site: SiteSansRole,
    items: ItemsNonConnecté,
    compte: CompteNonConnecté
};

export const SansRoleMenu: IMenu = {
    nom: 'SansRole',
    site: SiteSansRole,
    items: ItemsSansRole,
    compte: CompteSansRole
};

export const AdministrateurMenu: IMenu = {
    nom: 'Administrateur',
    site: SiteAvecRole,
    items: [],
    compte: CompteAvecRole
};

export const FournisseurMenu: IMenu = {
    nom: 'Fournisseur',
    site: SiteAvecRole,
    items: ItemsSansRole,
    compte: CompteAvecRole
};

export const ClientMenu: IMenu = {
    nom: 'Client',
    site: SiteAvecRole,
    items: ItemsSansRole,
    compte: CompteAvecRole
};
