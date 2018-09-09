import { AppApiRoutes } from '../app-api-routes';

export const CompteApiRoutes = {
    App: {
        connection: 'connection',
        deconnection: 'deconnection',
        enregistrement: 'enregistrement',
        gestion: 'gestion'
    },
    Api: {
        connecte: 'connecte',
        deconnecte: 'deconnecte',
        enregistre: 'enregistre',
    },
    Route(segment: string) {
        return '/' + AppApiRoutes.App.compte + '/' + segment;
    }
};
