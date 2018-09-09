import { AppApiRoutes } from '../app-api-routes';

export const UtilisateurApiRoutes = {
    App: {
        role: 'role',
    },
    Route(segment: string): string {
        return AppApiRoutes.Route(AppApiRoutes.App.utilisateur) + '/' + segment;
    }
};
