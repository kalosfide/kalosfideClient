import { UtilisateurApiRoutes } from '../utilisateur-api-routes';

export const RoleApiRoutes = {
    App: {
        ajoute: 'ajoute',
        edite: 'edite',
    },
    Api: {
        lit: 'lit'
    },
    Route(segment: string): string {
        return UtilisateurApiRoutes.Route(UtilisateurApiRoutes.App.role) + '/' + segment;
    }
};
