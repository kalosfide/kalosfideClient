export const VisiteurApiRoutes = {
    App: {
        contact: 'contact',
        apropos: 'apropos',
    },
    Route(segment: string): string {
        return '/' + segment;
    }
};
