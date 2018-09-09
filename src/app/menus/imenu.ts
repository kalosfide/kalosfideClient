
export interface IItemDeMenu {
    texte?: string;
    image?: string;
    // si route est défini pas de sousMenu
    route?: any;
    nom?: string;
    sousMenu?: IItemDeMenu[];
    menu?: IMenu;
}

export interface IMenu {
    nom: string;
    site: IItemDeMenu;
    items: IItemDeMenu[];
    compte: IItemDeMenu;
}
