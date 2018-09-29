export const DataApiRoutes = {
    App: {
        ajoute: 'ajoute',
        details: 'details',
        edite: 'edite',
        supprime: 'supprime',
    },
    Api: {
        ajoute: 'ajoute',
        lit: 'lit',
        edite: 'edite',
        dernierNo: 'dernierNo',
        supprime: 'supprime',
    },
    texteLien(action: string): string  {
        switch (action) {
            case this.App.ajoute:
                return 'Créer';
            case this.App.edite:
                return 'Modifier';
            case this.Api.supprime:
                return 'Supprimer';
            default:
                break;
        }
    },
    texteBouton(action: string): string  {
        switch (action) {
            case this.Api.ajoute:
                return 'Créer';
            case this.Api.edite:
                return 'Mettre à jour';
            case this.Api.supprime:
                return 'Supprimer';
            default:
                break;
        }
    },
};
