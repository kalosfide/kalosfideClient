export const AppApiRoutes = {
    App: {
        visiteur: '',
        compte: 'compte',
        utilisateur: 'utilisateur',
        administrateur: 'administrateur',
        client: 'client',
        fournisseur: 'fournisseur',
        introuvable: 'introuvable',
        interdit: 'interdit',
    },
    Route(...segments: string[]): string {
        return '/' + segments.join('/');
    }
};
