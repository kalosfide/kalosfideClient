export class DialogueDef {
    /** si défini, une barre de titre affiche ce texte */
    titre?: string;
    /** si défini, texte du dialogue */
    message?: string | string[];
    /** texte du bouton Ok, par défaut 'Ok' */
    texteOk?: string;
    /** texte du bouton Annuler, par défaut 'Annuler' */
    texteAnnuler?: string;
    /** action exécutée quand le bouton Ok est pressé */
//    actionSiConfirmé?: () => void;
}
