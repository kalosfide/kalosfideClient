import { UtilisateurApiRoutes } from '../utilisateur-api-routes';

export const RoleApiRoutes = {
    App: {
        ajoute: 'ajoute',
        edite: 'edite',
    },
    Api: {
        lit: 'lit',
        fournisseurs: 'fournisseurs',
    },
    Route(segment: string, no?: number): string {
        let route = UtilisateurApiRoutes.Route(UtilisateurApiRoutes.App.role) + '/' + segment;
        if (no) {
            route = route + '/' + no;
        }
        return route;
    }
};
